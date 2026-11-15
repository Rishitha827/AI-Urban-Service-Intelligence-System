import sqlite3
import os
from pathlib import Path

DB_PATH = os.environ.get(
    "URBAN_DB_PATH",
    str(Path(__file__).parent / "urban_service.db")
)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def initialize_database():
    with get_db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS issue_groups (
                issue_group_id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS complaints (
                complaint_id TEXT PRIMARY KEY,
                issue_group_id TEXT NOT NULL,
                complaint_text TEXT NOT NULL,
                ward TEXT NOT NULL,
                category TEXT,
                subcategory TEXT,
                predicted_urgency TEXT,
                duration_days INTEGER,
                priority_score REAL,
                status TEXT NOT NULL DEFAULT 'Pending',
                tracking_token_hash TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(issue_group_id)
                    REFERENCES issue_groups(issue_group_id)
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS status_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                complaint_id TEXT NOT NULL,
                old_status TEXT,
                new_status TEXT NOT NULL,
                changed_at TEXT NOT NULL,
                FOREIGN KEY(complaint_id)
                    REFERENCES complaints(complaint_id)
            )
        """)
        for column in ["ward", "issue_group_id", "status"]:
            conn.execute(
                f"CREATE INDEX IF NOT EXISTS idx_complaints_{column} "
                f"ON complaints({column})"
            )
        conn.commit()
