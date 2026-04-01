import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel

# --- 1. CORE & MODEL IMPORTS ---
from core.database import init_db, engine
from models.user import User
from models.project import Project
from api import auth, projects

# --- 2. ENGINE LIFESPAN ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "="*50)
    print("🚀 KETHER AI ORCHESTRATOR: INITIALIZING")
    print("="*50)
    
    try:
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

# --- 4. EXCEPTION HANDLERS (The Diagnostic Tool) ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    This is the "Truth Logger". It catches the 422 error 
    and prints the EXACT field mismatch to the terminal.
    """
    errors = exc.errors()
    print("\n" + "!"*50)
    print("❌ VALIDATION ERROR DETECTED")
    for error in errors:
        location = error.get("loc")
        message = error.get("msg")
        print(f"   - FIELD: {location}")
        print(f"   - REASON: {message}")
    print("!"*50 + "\n")
    
    return JSONResponse(
        status_code=422,
        content={"detail": errors}
    )

# --- 5. MIDDLEWARE (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# --- 6. ROUTER REGISTRATION ---
app.include_router(auth.router, prefix="/auth", tags=["L0: Identity"])
app.include_router(projects.router, prefix="/projects", tags=["L1-L4: Orchestration"])

# --- 7. SYSTEM ENDPOINTS ---

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "timestamp": time.time(),
        "engine": "Kether 1.0.0",
        "database": "connected"
    }

@app.get("/ai-status")
async def ai_status():
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("GPT_KEY")
    return {
        "provider": "openai",
        "ready": bool(api_key),
        "status": "Awaiting commands" if api_key else "API Key missing"
    }

@app.get("/")
async def root():
    return {
        "message": "Kether Engine is Online.",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)