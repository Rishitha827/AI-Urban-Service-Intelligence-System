import hashlib

from flask import Blueprint, request, jsonify
from database import get_db_connection

tracking_bp = Blueprint("tracking", __name__)


@tracking_bp.route("/api/complaints/track", methods=["POST"])
def track_complaint():

    data = request.get_json(silent=True) or {}

    complaint_id = str(data.get("complaint_id", "")).strip()
    tracking_token = str(data.get("tracking_token", "")).strip()

    if not complaint_id or not tracking_token:
        return jsonify({
            "error": "Complaint ID and tracking token are required."
        }), 400

    token_hash = hashlib.sha256(
        tracking_token.encode()
    ).hexdigest()

    with get_db_connection() as conn:
        complaint = conn.execute("""
            SELECT complaint_id, issue_group_id, complaint_text,
                   ward, category, predicted_urgency, priority_score,
                   status, created_at, updated_at
            FROM complaints
            WHERE complaint_id = ? AND tracking_token_hash = ?
        """, (complaint_id, token_hash)).fetchone()

        if not complaint:
            return jsonify({
                "error": "Invalid complaint ID or tracking token."
            }), 401

        history = conn.execute("""
            SELECT old_status, new_status, changed_at
            FROM status_history
            WHERE complaint_id = ?
            ORDER BY id ASC
        """, (complaint_id,)).fetchall()

    return jsonify({
        "complaint": dict(complaint),
        "status_history": [dict(record) for record in history]
    }), 200
