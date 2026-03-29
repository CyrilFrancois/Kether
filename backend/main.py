from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import time

# Initializing the Kether Engine
app = FastAPI(
    title="Kether AI Orchestrator",
    version="1.0.0",
    description="L1-L4 Project Management & Autonomous Execution Engine"
)

# 1. CORS Configuration
# This allows our Vite frontend (port 3000) to talk to this API (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. The Health Heartbeat
@app.get("/health")
async def health_check():
    """
    Role: Environment Check for the Frontend SystemPulse.
    Returns: The status of the API and the connectivity to the AI provider.
    """
    return {
        "status": "ok",
        "timestamp": time.time(),
        "ai_status": "ready",  # We'll link this to an OpenAI ping later
        "version": "1.0.0"
    }

# 3. Root Endpoint
@app.get("/")
async def root():
    return {"message": "Kether Engine is Online. Awaiting Orchestration Commands."}

# Future: We will include routers here
# app.include_router(auth_router, prefix="/v1/auth")
# app.include_router(project_router, prefix="/v1/projects")

if __name__ == "__main__":
    import uvicorn
    # Running the engine with hot-reload for development
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)