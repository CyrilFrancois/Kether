from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import os

# --- 1. IMPORT DATABASE & MODELS ---
from core.database import init_db
from api import auth

# --- 2. LIFESPAN MANAGEMENT ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This runs ONCE when the docker container starts
    print("--- KETHER ENGINE STARTING ---")
    try:
        # We call init_db here. This will check the RESET_DB env var 
        # we added to your docker-compose earlier.
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
# In a professional "Pro" solution, you'd eventually replace ["*"] 
# with your actual frontend domain for better security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. REGISTER ROUTERS
# IMPORTANT: The prefix is "/auth". 
# Your frontend fetch should be: fetch('/auth/me', ...)
app.include_router(auth.router, prefix="/auth", tags=["Identity"])

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
    api_key_exists = bool(os.getenv("OPENAI_API_KEY"))
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
    # Use 'main:app' to ensure the lifespan and routes load correctly
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)