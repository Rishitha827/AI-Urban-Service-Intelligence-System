
from flask import Flask, jsonify
from flask_cors import CORS

from database import initialize_database
from tracking import tracking_bp
from dashboard import dashboard_bp
from area_intelligence import area_bp

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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
