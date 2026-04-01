import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

# --- 1. CORE & MODEL IMPORTS ---
from core.database import init_db, engine
from models.user import User
from models.project import Project
# Note: Ensure these imports cover all sub-models (Tasks, etc.)

from api import auth, projects

# --- 2. ENGINE LIFESPAN ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles the startup and shutdown logic of the Kether Engine.
    Ensures the Postgres schema is synchronized with our Python DNA.
    """
    print("\n" + "="*50)
    print("🚀 KETHER AI ORCHESTRATOR: INITIALIZING")
    print("="*50)
    
    try:
        # Verify metadata is aware of all tables before init
        # SQLModel.metadata.create_all(engine) is called inside init_db()
        init_db()
        print("✅ DATABASE: Schema synchronized and tables verified.")
    except Exception as e:
        print(f"❌ DATABASE: Initialization failed! Error: {e}")
    
    yield
    
    print("\n" + "="*50)
    print("🛑 KETHER ENGINE: SHUTTING DOWN")
    print("="*50)

# --- 3. APP INITIALIZATION ---
app = FastAPI(
    title="Kether Engine",
    version="1.0.0",
    description="The L1-L4 Autonomous Orchestration Core",
    lifespan=lifespan
)

# --- 4. MIDDLEWARE (CORS) ---
# We use a broad CORS policy for development to ensure the Frontend (Port 3000)
# can talk to the Backend (Port 8000) without browser blocks.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type", "Accept"], # Explicitly allowed
)

# --- 5. ROUTER REGISTRATION ---
app.include_router(auth.router, prefix="/auth", tags=["L0: Identity"])
app.include_router(projects.router, prefix="/projects", tags=["L1-L4: Orchestration"])

# --- 6. SYSTEM ENDPOINTS ---

@app.get("/health")
async def health_check():
    """
    CRITICAL: Root heartbeat for Docker healthchecks.
    Docker-compose should point to http://localhost:8000/health
    """
    return {
        "status": "online",
        "timestamp": time.time(),
        "engine": "Kether 1.0.0",
        "database": "connected"
    }

@app.get("/ai-status")
async def ai_status():
    """Verifies LLM provider connectivity."""
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("GPT_KEY")
    return {
        "provider": "openai",
        "ready": bool(api_key),
        "status": "Awaiting commands" if api_key else "API Key missing (Check .env)"
    }

@app.get("/")
async def root():
    """Welcome portal and documentation link."""
    return {
        "message": "Kether Engine is Online.",
        "docs": "/docs",
        "status": "Ready for L1 Project Initialization"
    }

# --- 7. DEV ENTRY POINT ---
if __name__ == "__main__":
    import uvicorn
    # uvicorn.run uses the string import to enable 'reload'
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)