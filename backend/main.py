import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

# --- 1. CORE & MODEL IMPORTS ---
from core.database import init_db
# Ensure models are imported to register with SQLModel metadata
from models.user import User
from models.project import Project, ProjectNode
from models.attribute import Attribute
from models.attributeLibrary import AttributeLibrary
from api import auth, projects, attributes

# --- 2. ENGINE LIFESPAN ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "="*50)
    print("🚀 PROJECT MANAGEMENT ENGINE: INITIALIZING")
    print("="*50)
    
    try:
        # Initialize database tables
        init_db()
        print("✅ DATABASE: Schema synchronization complete (EAV + Project Tree).")
    except Exception as e:
        print(f"❌ DATABASE: Initialization failed! Error: {e}")
    
    yield
    
    print("\n" + "="*50)
    print("🛑 ENGINE: SHUTTING DOWN")
    print("="*50)

# --- 3. APP INITIALIZATION ---
app = FastAPI(
    title="Project Management API",
    version="1.2.0",
    description="Professional Orchestration Core with Dynamic Attribute Support",
    lifespan=lifespan
)

# --- 4. MIDDLEWARE (CORS & DIAGNOSTICS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], # Allow all headers for flexible orchestration
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# --- 5. EXCEPTION HANDLERS ---
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    print(f"❌ VALIDATION ERROR at {request.url.path}: {errors}")
    return JSONResponse(status_code=422, content={"detail": errors})

# --- 6. ROUTER REGISTRATION ---
# Unified /api prefix to prevent 404s and organize the namespace

# Auth: /api/auth
app.include_router(auth.router, prefix="/api/auth", tags=["Identity"])

# Projects: /api/projects
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])

# Attributes: /api/attributes
app.include_router(attributes.router, prefix="/api/attributes", tags=["Attributes"])

# --- 7. SYSTEM ENDPOINTS ---

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "version": "1.2.0",
        "database": "connected",
        "features": ["Dynamic EAV", "Hierarchical Nodes"]
    }

@app.get("/")
async def root():
    return {
        "message": "Project Management API Core",
        "docs": "/docs",
        "api_root": "/api"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)