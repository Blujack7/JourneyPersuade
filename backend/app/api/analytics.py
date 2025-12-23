import sqlite3
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Store db in data folder relative to this file
DB_PATH = os.path.join(os.path.dirname(__file__), '../../data/analytics.db')

def init_db():
    # Ensure data directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            event_data TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize on module load (simple for now)
init_db()

class Event(BaseModel):
    event_type: str
    event_data: str = None

@router.post("/track")
def track_event(event: Event):
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO events (event_type, event_data) VALUES (?, ?)",
                  (event.event_type, event.event_data))
        conn.commit()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        print(f"Error tracking event: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
def get_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        # Count by event type
        c.execute("SELECT event_type, COUNT(*) FROM events GROUP BY event_type")
        rows = c.fetchall()
        
        # Get recent events
        c.execute("SELECT * FROM events ORDER BY id DESC LIMIT 10")
        recent = c.fetchall()
        
        conn.close()
        
        stats = {row[0]: row[1] for row in rows}
        return {"summary": stats, "recent_events": recent}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
