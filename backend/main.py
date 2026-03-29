# /backend/main.py
import os
from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session, text
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Kether API", version="0.1.0")

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

@app.on_event("startup")
def on_startup():
    # This ensures the DB is reachable on start
    try:
        with Session(engine) as session:
            session.exec(text("SELECT 1"))
        print("✅ Kether Database: Connected")
    except Exception as e:
        print(f"❌ Kether Database: Connection Failed - {e}")

@app.get("/")
def read_root():
    return {"status": "Kether Online", "version": "0.1.0"}

@app.get("/health/ai")
def check_ai_config():
    key = os.getenv("GPT_KEY")
    if not key or "sk-" not in key:
        return {"status": "Warning", "message": "GPT Key missing or invalid"}
    return {"status": "Ready", "message": "AI Engine configured"}