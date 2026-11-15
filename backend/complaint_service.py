import secrets
import hashlib
from datetime import datetime, timezone
from database import get_db_connection

def generate_id(prefix):
    return f"{prefix}-{secrets.token_hex(5).upper()}"

def register_complaint(
    complaint_text, ward, category=None, subcategory=None,
    predicted_urgency=None, duration_days=None,
    priority_score=None, existing_issue_group_id=None
):
    if not complaint_text or not complaint_text.strip():
        raise ValueError("Complaint text cannot be empty.")
    if not ward or not ward.strip():
        raise ValueError("Ward cannot be empty.")

    complaint_id = generate_id("URB")
    tracking_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(tracking_token.encode()).hexdigest()
    now = datetime.now(timezone.utc).isoformat()

    with get_db_connection() as conn:
        if existing_issue_group_id:
            exists = conn.execute(
                "SELECT 1 FROM issue_groups WHERE issue_group_id=?",
                (existing_issue_group_id,)
            ).fetchone()
            if not exists:
                raise ValueError("Issue group does not exist.")
            issue_group_id = existing_issue_group_id
        else:
            issue_group_id = generate_id("ISS")
            conn.execute(
                "INSERT INTO issue_groups VALUES (?, ?)",
                (issue_group_id, now)
            )

        conn.execute("""
            INSERT INTO complaints (
                complaint_id, issue_group_id, complaint_text, ward,
                category, subcategory, predicted_urgency,
                duration_days, priority_score, status,
                tracking_token_hash, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?)
        """, (
            complaint_id, issue_group_id, complaint_text.strip(),
            ward.strip(), category, subcategory, predicted_urgency,
            duration_days, priority_score, token_hash, now, now
        ))

        conn.execute("""
            INSERT INTO status_history
            (complaint_id, old_status, new_status, changed_at)
            VALUES (?, NULL, 'Pending', ?)
        """, (complaint_id, now))

    return {
        "complaint_id": complaint_id,
        "issue_group_id": issue_group_id,
        "tracking_token": tracking_token
    }
