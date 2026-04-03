import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# --- 1. CORE & MODEL IMPORTS ---
from core.database import init_db
from models.user import User
# Updated import to reflect the new recursive model
from models.project import ProjectNode 
from api import auth, projects

# --- 2. ENGINE LIFESPAN ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "="*50)
    print("🚀 KETHER AI ORCHESTRATOR: INITIALIZING")
    print("="*50)
    
    try:
        # This synchronizes the ProjectNode table into the DB
        init_db()
        print("✅ DATABASE: 5-Layer Recursive Schema synchronized.")
    except Exception as e:
        print(f"❌ DATABASE: Initialization failed! Error: {e}")
    
    yield
    
    print("\n" + "="*50)
    print("🛑 KETHER ENGINE: SHUTTING DOWN")
    print("="*50)

# --- 3. APP INITIALIZATION ---
app = FastAPI(
    title="Kether Engine",
    version="1.1.0",
    description="The L1-L5 Recursive Orchestration Core",
    lifespan=lifespan
)

# --- 4. DIAGNOSTIC MIDDLEWARE ---
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """
    Tracks execution time. Critical for monitoring AI 'Decomposition' 
    latency and deep recursive tree fetches.
    """
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# --- 5. EXCEPTION HANDLERS ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    print("\n" + "!"*50)
    print("❌ SCHEMA MISMATCH: Validation Error")
    for error in errors:
        print(f"   - FIELD: {error.get('loc')}")
        print(f"   - MSG: {error.get('msg')}")
    print("!"*50 + "\n")
    
    return JSONResponse(
        status_code=422,
        content={"detail": errors}
    )

# --- 6. MIDDLEWARE (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# --- 7. ROUTER REGISTRATION ---
app.include_router(auth.router, prefix="/auth", tags=["L0: Identity"])
# This now points to the recursive node endpoints
app.include_router(projects.router, prefix="/projects", tags=["L1-L5: Orchestration"])

# --- 8. SYSTEM ENDPOINTS ---

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "engine": "Kether 1.1.0",
        "layers": "L1-L5 Recursive",
        "database": "connected"
    }

@app.get("/ai-status")
async def ai_status():
    # Supports both standard and internal key naming conventions
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("GPT_KEY")
    return {
        "provider": "openai",
        "ready": bool(api_key),
        "architect_agent": "ready" if api_key else "missing_credentials"
    }

@app.get("/")
async def root():
    return {
        "message": "Kether Engine: Orchestration Core is Online.",
        "docs": "/docs",
        "architecture": "Recursive Node Tree"
    }

if __name__ == "__main__":
    import uvicorn
    # Use reload=True for development to catch model changes
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)