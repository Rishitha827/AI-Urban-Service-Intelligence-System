URGENCY_SCORES = {
    "Low": 1,
    "Medium": 2,
    "High": 3,
    "Critical": 4
}

def calculate_priority(urgency, recurrence_count, duration_days):
    urgency_score = URGENCY_SCORES.get(urgency, 1)
    urgency_component = urgency_score / 4
    recurrence_component = min(recurrence_count / 20, 1)
    duration_component = (
        min(duration_days / 30, 1)
        if duration_days is not None else 0
    )

    priority = (
        0.60 * urgency_component
        + 0.25 * recurrence_component
        + 0.15 * duration_component
    ) * 100

    return round(priority, 2)
