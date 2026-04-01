import os
from sqlmodel import SQLModel, create_engine, Session, select
from sqlalchemy import inspect

# 1. Connection String (Updated to match your dev password)
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:kether_dev_pass@db:5432/kether"
)

# 2. The Engine
# echo=True is your best friend right now; it prints the SQL being sent to Postgres
engine = create_engine(DATABASE_URL, echo=True)

# 3. DB Dependency (SQLModel version)
def get_session():
    with Session(engine) as session:
        yield session

# 4. Modular Table Initialization
def init_db():
    """
    Synchronizes the SQLModel DNA with the PostgreSQL database.
    """
    reset_requested = os.getenv("RESET_DB", "false").lower() == "true"
    
    # IMPORT MODELS HERE
    # This is the "Wake Up" call. Without these imports, 
    # SQLModel.metadata is empty when we call create_all().
    from models.user import User
    from models.project import Project
    # Note: Project.py imports Functionality/Tasks, so they follow along.

    if reset_requested:
        print("\n--- !!! ⚠️  FORCE RESETTING DATABASE ⚠️  !!! ---")
        SQLModel.metadata.drop_all(engine)
        print("--- Tables Dropped ---\n")

    print("--- 🛡️  Kether Database Foundry: Initializing ---")
    
    # Create the inspector to see what's already there
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    # CRITICAL: Use SQLModel's metadata, not SQLAlchemy's Base
    SQLModel.metadata.create_all(engine)
    
    # Verify creation for the logs
    new_tables = inspect(engine).get_table_names()
    
    if not new_tables:
        print("  [!] WARNING: No tables were created. Check model imports.")
    
    for table in new_tables:
        status = "Existing" if table in existing_tables else "CREATED ✨"
        print(f"  [+] Table: {table: <15} | Status: {status}")
        
    print("--- ✅ Database Initialization Complete ---\n")