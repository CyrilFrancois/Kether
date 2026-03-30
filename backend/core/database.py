import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Connection String
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:kether_dev_pass@db:5432/kether"
)

# 2. The Engine
engine = create_engine(DATABASE_URL)

# 3. Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. The Base Class
Base = declarative_base()

# 5. DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 6. Modular Table Initialization
def init_db():
    reset_requested = os.getenv("RESET_DB", "false").lower() == "true"
    
    if reset_requested:
        print("--- !!! FORCE RESETTING DATABASE !!! ---")
        Base.metadata.drop_all(bind=engine)
        print("--- Tables Dropped ---")

    """
    Checks the registry and creates tables if they don't exist.
    This keeps the 'core' logic clean and the 'models' modular.
    """
    # Import the registry to "wake up" the models
    import models
    
    print("--- Kether Database Foundry: Initializing ---")
    
    # Optional: Log which tables we are expecting
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    # Create missing tables
    Base.metadata.create_all(bind=engine)
    
    # Verify creation for the logs
    new_tables = inspect(engine).get_table_names()
    for table in new_tables:
        status = "Existing" if table in existing_tables else "CREATED"
        print(f"  [+] Table: {table: <15} | Status: {status}")
        
    print("--- Database Initialization Complete ---")