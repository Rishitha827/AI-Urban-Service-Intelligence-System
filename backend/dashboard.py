from flask import Blueprint, jsonify
from database import get_db_connection

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.route("/api/dashboard", methods=["GET"])
def city_dashboard():
    with get_db_connection() as conn:
        total = conn.execute(
            "SELECT COUNT(*) FROM complaints"
        ).fetchone()[0]

        statuses = conn.execute("""
            SELECT status, COUNT(*) AS count
            FROM complaints GROUP BY status
        """).fetchall()

        categories = conn.execute("""
            SELECT COALESCE(category, 'Uncategorized') AS category,
                   COUNT(*) AS count
            FROM complaints
            GROUP BY category
            ORDER BY count DESC
        """).fetchall()

        recurring_groups = conn.execute("""
            SELECT COUNT(*) FROM (
                SELECT issue_group_id
                FROM complaints
                GROUP BY issue_group_id
                HAVING COUNT(*) > 1
            )
        """).fetchone()[0]

        top_wards = conn.execute("""
            SELECT ward, COUNT(*) AS count
            FROM complaints
            GROUP BY ward
            ORDER BY count DESC
            LIMIT 5
        """).fetchall()

        priority_issues = conn.execute("""
            SELECT issue_group_id,
                   COUNT(*) AS complaint_count,
                   MAX(priority_score) AS priority_score,
                   MAX(predicted_urgency) AS urgency,
                   MAX(updated_at) AS latest_activity
            FROM complaints
            GROUP BY issue_group_id
            ORDER BY priority_score DESC
            LIMIT 10
        """).fetchall()

    status_counts = {
        row["status"]: row["count"] for row in statuses
    }

    return jsonify({
        "total_complaints": total,
        "resolved": status_counts.get("Resolved", 0),
        "pending": status_counts.get("Pending", 0),
        "in_progress": status_counts.get("In Progress", 0),
        "recurring_issue_groups": recurring_groups,
        "category_breakdown": [dict(row) for row in categories],
        "top_wards": [dict(row) for row in top_wards],
        "priority_issues": [dict(row) for row in priority_issues]
    }), 200
