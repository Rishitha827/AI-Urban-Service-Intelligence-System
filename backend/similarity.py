from pathlib import Path
from sentence_transformers import SentenceTransformer
from database import get_db_connection
import numpy as np

BASE = Path(__file__).parent

MODEL_PATH = BASE / "semantic_similarity_model"

# Provisional threshold based on initial comparison tests
SIMILARITY_THRESHOLD = 0.55

similarity_model = SentenceTransformer(str(MODEL_PATH))


def find_similar_complaint(
    complaint_text, ward, vectorizer=None
):
    if not complaint_text or not complaint_text.strip():
        return None

    if not ward or not ward.strip():
        return None

    with get_db_connection() as conn:
        complaints = conn.execute("""
            SELECT complaint_id, issue_group_id, complaint_text
            FROM complaints
            WHERE LOWER(ward) = LOWER(?)
        """, (ward.strip(),)).fetchall()

    if not complaints:
        return None

    existing_texts = [
        row["complaint_text"] for row in complaints
    ]

    # Generate semantic embeddings
    embeddings = similarity_model.encode(
        existing_texts + [complaint_text],
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    # Normalized embeddings allow cosine similarity
    # to be calculated using the dot product.
    scores = np.dot(
        embeddings[:-1],
        embeddings[-1]
    )

    best_index = int(np.argmax(scores))
    best_score = float(scores[best_index])

    if best_score >= SIMILARITY_THRESHOLD:
        best = complaints[best_index]

        return {
            "complaint_id": best["complaint_id"],
            "issue_group_id": best["issue_group_id"],
            "similarity_score": round(best_score, 4)
        }

    return None
