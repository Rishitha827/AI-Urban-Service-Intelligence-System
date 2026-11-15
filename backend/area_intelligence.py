from flask import Blueprint, request, jsonify
from database import get_db_connection
from datetime import datetime, timezone, timedelta
from collections import defaultdict

area_bp = Blueprint("area_intelligence", __name__)

URGENCY_VALUES = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Critical": 4
}

def calculate_area_statistics(ward, complaints):
    now = datetime.now(timezone.utc)
    recent_limit = now - timedelta(days=30)
    previous_limit = now - timedelta(days=60)

    total = len(complaints)
    recent_count = 0
    previous_count = 0
    unresolved = 0
    urgency_total = 0
    category_counts = defaultdict(int)
    group_counts = defaultdict(int)

    for complaint in complaints:
        # Count unresolved complaints
        if complaint["status"] != "Resolved":
            unresolved += 1

        # Count urgency
        urgency_total += URGENCY_VALUES.get(
            complaint["predicted_urgency"], 1
        )

        # Category breakdown
        category = complaint["category"] or "Uncategorized"
        category_counts[category] += 1

        # Recurrence groups
        group_counts[complaint["issue_group_id"]] += 1

        # Recent complaint trend
        try:
            created = datetime.fromisoformat(
                complaint["created_at"].replace("Z", "+00:00")
            )

            if created >= recent_limit:
                recent_count += 1
            elif previous_limit <= created < recent_limit:
                previous_count += 1

        except (ValueError, AttributeError):
            pass

    recurring_groups = sum(
        1 for count in group_counts.values() if count > 1
    )

    unresolved_rate = unresolved / total if total else 0
    recurrence_rate = recurring_groups / len(group_counts) if group_counts else 0
    average_urgency = urgency_total / total if total else 0

    # Project-defined risk score, not an official government classification.
    recent_volume_score = min(recent_count / 10, 1)

    risk_score = (
        35 * recent_volume_score
        + 25 * recurrence_rate
        + 25 * unresolved_rate
        + 15 * (average_urgency / 4)
    )

    risk_score = round(risk_score, 2)

    if risk_score >= 70:
        risk_zone = "High"
    elif risk_score >= 40:
        risk_zone = "Moderate"
    else:
        risk_zone = "Low"

    if recent_count > previous_count:
        trend = "Increasing"
    elif recent_count < previous_count:
        trend = "Decreasing"
    else:
        trend = "Stable"

    return {
        "ward": ward,
        "total_complaints": total,
        "recent_30_days": recent_count,
        "previous_30_days": previous_count,
        "complaint_trend": trend,
        "unresolved_complaints": unresolved,
        "recurring_issue_groups": recurring_groups,
        "average_urgency_score": round(average_urgency, 2),
        "risk_score": risk_score,
        "risk_zone": risk_zone,
        "category_breakdown": [
            {"category": category, "count": count}
            for category, count in sorted(
                category_counts.items(),
                key=lambda item: item[1],
                reverse=True
            )
        ]
    }

def get_all_area_statistics():
    with get_db_connection() as conn:
        rows = conn.execute("""
            SELECT ward, issue_group_id, category,
                   predicted_urgency, status, created_at
            FROM complaints
            ORDER BY created_at DESC
        """).fetchall()

    grouped = defaultdict(list)

    for row in rows:
        grouped[row["ward"]].append(dict(row))

    return [
        calculate_area_statistics(ward, complaints)
        for ward, complaints in sorted(grouped.items())
    ]

# Endpoint 1: Get statistics for all wards
@area_bp.route("/api/areas", methods=["GET"])
def get_areas():
    areas = get_all_area_statistics()

    return jsonify({
        "total_areas": len(areas),
        "areas": areas
    }), 200

# Endpoint 2: Get one ward or compare multiple wards
@area_bp.route("/api/area-intelligence", methods=["GET"])
def area_intelligence():
    wards_parameter = request.args.get("wards", "").strip()
    ward_parameter = request.args.get("ward", "").strip()

    selected_wards = (
        [w.strip() for w in wards_parameter.split(",") if w.strip()]
        if wards_parameter
        else ([ward_parameter] if ward_parameter else [])
    )

    if not selected_wards:
        return jsonify({
            "error": "Provide a ward or wards parameter."
        }), 400

    all_areas = get_all_area_statistics()

    results = []
    missing = []

    for selected in selected_wards:
        match = next(
            (
                area for area in all_areas
                if area["ward"].casefold() == selected.casefold()
            ),
            None
        )

        if match:
            results.append(match)
        else:
            missing.append(selected)

    if missing:
        return jsonify({
            "error": "Some requested wards were not found.",
            "missing_wards": missing,
            "available_wards": [
                area["ward"] for area in all_areas
            ]
        }), 404

    return jsonify({
        "comparison_count": len(results),
        "areas": results
    }), 200
