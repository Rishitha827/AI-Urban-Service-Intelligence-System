
from flask import Flask, jsonify
from flask_cors import CORS

from database import initialize_database, get_db_connection
from tracking import tracking_bp
from dashboard import dashboard_bp
from area_intelligence import area_bp



from flask import request
from complaint_service import register_complaint
from prediction import predict_complaint
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from priority import calculate_priority
app = Flask(__name__)

# Allow the Next.js frontend to access the backend
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "https://ai-urban-service-intelligence-syste.vercel.app"
            ],
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    }
)

# Initialize existing database
initialize_database()

# Register existing API routes
app.register_blueprint(tracking_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(area_bp)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "AI Urban Service API is running",
        "status": "success"
    }), 200


@app.route("/api/complaints", methods=["POST"])
def create_complaint():
    try:
        data = request.get_json(silent=True) or {}

        complaint_text = data.get("complaint_text", "")
        ward = data.get("ward", "")
        duration_days = data.get("duration_days")

        if not isinstance(complaint_text, str) or not complaint_text.strip():
            return jsonify({"error": "Complaint text is required"}), 400

        if not isinstance(ward, str) or not ward.strip():
            return jsonify({"error": "Ward is required"}), 400

        if duration_days is not None:
            duration_days = int(duration_days)
            if duration_days < 0:
                return jsonify({"error": "Duration cannot be negative"}), 400

        prediction = predict_complaint(complaint_text)

        similar = None

with get_db_connection() as conn:
    rows = conn.execute("""
        SELECT complaint_id, issue_group_id, complaint_text
        FROM complaints
        WHERE LOWER(ward) = LOWER(?)
    """, (ward.strip(),)).fetchall()

if rows:
    texts = [row["complaint_text"] for row in rows]
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
    matrix = vectorizer.fit_transform(texts + [complaint_text])
    scores = cosine_similarity(matrix[-1], matrix[:-1]).flatten()

    best_index = scores.argmax()
    if scores[best_index] >= 0.55:
        similar = {
            "complaint_id": rows[best_index]["complaint_id"],
            "issue_group_id": rows[best_index]["issue_group_id"],
            "similarity_score": float(scores[best_index])
        }

        existing_group_id = (
            similar["issue_group_id"] if similar else None
        )

        recurrence_count = 0
        matched_complaint = None

        if similar:
            with get_db_connection() as conn:
                previous = conn.execute("""
                    SELECT complaint_id, issue_group_id, status, created_at
                    FROM complaints
                    WHERE complaint_id = ?
                """, (similar["complaint_id"],)).fetchone()

                recurrence_count = conn.execute("""
                    SELECT COUNT(*) AS total
                    FROM complaints
                    WHERE issue_group_id = ?
                """, (existing_group_id,)).fetchone()["total"]

                matched_complaint = {
                    "complaint_id": previous["complaint_id"],
                    "status": previous["status"],
                    "created_at": previous["created_at"],
                    "issue_group_id": previous["issue_group_id"],
                    "similarity_score": similar["similarity_score"],
                    "previous_report_count": recurrence_count
                }

        total_reports = recurrence_count + 1

        priority_score = calculate_priority(
            prediction["predicted_urgency"],
            total_reports,
            duration_days
        )

        result = register_complaint(
            complaint_text=complaint_text,
            ward=ward,
            category=prediction["category"],
            subcategory=prediction["subcategory"],
            predicted_urgency=prediction["predicted_urgency"],
            duration_days=duration_days,
            priority_score=priority_score,
            existing_issue_group_id=existing_group_id
        )

        return jsonify({
            "message": "Complaint registered successfully",
            "registration_type": (
                "possible_repeat" if similar else "first_report"
            ),
            "complaint_id": result["complaint_id"],
            "issue_group_id": result["issue_group_id"],
            "tracking_token": result["tracking_token"],
            "predicted_urgency": prediction["predicted_urgency"],
            "category": prediction["category"],
            "priority_score": priority_score,
            "similar_complaint": similar is not None,
            "similarity_score": (
                similar["similarity_score"] if similar else None
            ),
            "matched_complaint": matched_complaint,
            "total_reports_in_issue_group": total_reports
        }), 201

    except (ValueError, TypeError) as error:
        return jsonify({"error": str(error)}), 400

    except Exception:
        app.logger.exception("Complaint registration failed")
        return jsonify({
            "error": "Complaint registration failed"
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
