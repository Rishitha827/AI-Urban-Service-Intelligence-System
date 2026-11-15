
import joblib
from pathlib import Path

BASE = Path(__file__).parent

category_model = joblib.load(BASE / "category_model.pkl")
urgency_model = joblib.load(BASE / "urgency_model.pkl")
urgency_vectorizer = joblib.load(BASE / "urgency_vectorizer.pkl")


def predict_complaint(complaint_text):
    if not complaint_text or not complaint_text.strip():
        raise ValueError("Complaint text cannot be empty.")

    category = category_model.predict([complaint_text])[0]

    urgency_features = urgency_vectorizer.transform([complaint_text])
    urgency = urgency_model.predict(urgency_features)[0]

    return {
        "category": str(category),
        "predicted_urgency": str(urgency),
        "subcategory": None
    }
