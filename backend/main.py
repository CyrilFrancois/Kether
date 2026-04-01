from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import os

# --- 1. IMPORT DATABASE, MODELS & ROUTERS ---
from core.database import init_db
from api import auth, projects  # Added projects router

# --- 2. LIFESPAN MANAGEMENT ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs ONCE when the docker container starts
    print("--- KETHER ENGINE STARTING ---")
    try:
        # init_db() ensures all tables (User, Project, Functionality, etc.) 
        # are created in Postgres upon startup
        init_db()  
    except Exception as e:
        print(f"Critical Error during DB Init: {e}")
    
    yield
    
    # This runs when the container shuts down
    print("--- KETHER ENGINE SHUTTING DOWN ---")

# Initializing the Kether Engine
app = FastAPI(
    title="Kether AI Orchestrator",
    version="1.0.0",
    description="L1-L4 Project Management & Autonomous Execution Engine",
    lifespan=lifespan
)

# 3. CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. REGISTER ROUTERS
# Identity & Profile Management
app.include_router(auth.router, prefix="/auth", tags=["Identity"])

# Orchestration Engine (Project Hierarchy, Map, and Backlog)
# This enables /projects/ endpoints as defined in backend/api/projects.py
app.include_router(projects.router, prefix="/projects", tags=["Orchestration"])

# 5. System Health
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "timestamp": time.time(),
        "version": "1.0.0"
    }

# 6. AI Status
@app.get("/ai-status")
async def ai_status():
    # Looks for GPT_KEY as per your README/env setup
    api_key_exists = bool(os.getenv("GPT_KEY"))
    return {
        "status": "ready" if api_key_exists else "error",
        "provider": "openai",
        "key_configured": api_key_exists
    }

# 7. Root Endpoint
@app.get("/")
async def root():
    return {"message": "Kether Engine is Online. Awaiting Orchestration Commands."}

if __name__ == "__main__":
    import uvicorn
    # Standard uvicorn entry point
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)