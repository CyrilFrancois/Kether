import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Connection String
# We pull this from the Docker environment variables defined in docker-compose
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:kether_dev_pass@db:5432/kether"
)

# 2. The Engine
# The 'engine' is the actual connection to the database
engine = create_engine(DATABASE_URL)

# 3. Session Factory
# This creates a 'SessionLocal' class. Each instance of this class 
# will be a unique database session for a single API request.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. The Base Class
# Our models (like User and Project) will inherit from this Base
Base = declarative_base()

# 5. DB Dependency
# This function is used in FastAPI routes to get a database session 
# and ensure it closes automatically when the request is finished.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 6. Automatic Table Creation
# This is a 'foundry' helper. It tells SQLAlchemy to look at all 
# imported models and create any missing tables in Postgres.
def init_db():
    # We import models here to avoid circular imports
    from models.user import User
    # from models.project import Project (Add this once we build it)
    Base.metadata.create_all(bind=engine)