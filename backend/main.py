from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import os

# Initializing the Kether Engine
app = FastAPI(
    title="Kether AI Orchestrator",
    version="1.0.0",
    description="L1-L4 Project Management & Autonomous Execution Engine"
)

# 1. CORS Configuration
# Changed allow_origins to ["*"] temporarily to ensure Docker networking 
# doesn't block the initial handshake during your setup.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. System Health (The First Dot)
@app.get("/health")
async def health_check():
    """Returns the core API status."""
    return {
        "status": "ok",
        "timestamp": time.time(),
        "version": "1.0.0"
    }

# 3. AI Status (The Second Dot)
@app.get("/ai-status")
async def ai_status():
    """
    Specifically created for the frontend's separate ping.
    Simulates checking the OpenAI connection.
    """
    # Later, we will add an actual OpenAI ping here
    api_key_exists = os.getenv("OPENAI_API_KEY") is not None
    
    return {
        "status": "ready" if api_key_exists else "error",
        "provider": "openai",
        "latency": "12ms"
    }

# 4. Root Endpoint
@app.get("/")
async def root():
    return {"message": "Kether Engine is Online. Awaiting Orchestration Commands."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)