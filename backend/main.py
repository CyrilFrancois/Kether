# backend/main.py
import os
from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine, Session, text
from models.database import Project, Functionality, FunctionalTask, TechnicalTask

app = FastAPI(title="Kether API", version="0.1.0")

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:kether_dev_pass@db:5432/kether")
engine = create_engine(DATABASE_URL)

@app.on_event("startup")
def on_startup():
    # This magic line creates all tables in Postgres based on your models
    SQLModel.metadata.create_all(engine)
    print("✅ Kether Engine: Tables Verified/Created")

@app.get("/")
def health_check():
    return {
        "status": "Kether Online",
        "database": "Connected",
        "layers": ["Project", "Functionality", "Functional Task", "Technical Task"]
    }

# Quick API to verify AI config
@app.get("/ai-status")
def ai_status():
    has_key = bool(os.getenv("GPT_KEY"))
    return {"ai_ready": has_key, "provider": "OpenAI (GPT-4o)" if has_key else "None"}

@app.on_event("startup")
def on_startup():
    retries = 5
    while retries > 0:
        try:
            SQLModel.metadata.create_all(engine)
            print("✅ Kether Engine: Tables Verified/Created")
            break
        except Exception as e:
            retries -= 1
            print(f"⌛ Waiting for Database... ({retries} retries left)")
            time.sleep(3)
    else:
        print("❌ Kether Engine: Could not connect to Database.")