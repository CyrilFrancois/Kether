# Step 1: Base Image (Python 3.11 Slim for performance and security)
FROM python:3.11-slim

# Step 2: Prevent Python from writing .pyc files and buffering stdout/stderr
# This ensures logs appear in real-time in your Docker console
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Step 3: Install system dependencies (needed for psycopg2 and other tools)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Step 4: Set the working directory
WORKDIR /app

# Step 5: Install Python dependencies
# We copy this first to cache the pip install layer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Copy the rest of the backend source code
COPY . .

# Step 7: Expose the FastAPI default port
EXPOSE 8000

# Step 8: Launch the Engine with Uvicorn
# We use --reload for development so the AI can update its own logic
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]