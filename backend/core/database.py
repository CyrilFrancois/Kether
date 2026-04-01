import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import inspect

# 1. Connection String
# Using the dev password from your environment
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:kether_dev_pass@db:5432/kether"
)

# 2. The Engine
# CRITICAL: Set echo=False to stop SQLAlchemy from printing every single SQL statement.
# This fixes the "too many logs" issue you mentioned.
engine = create_engine(DATABASE_URL, echo=False)

# 3. DB Dependency (SQLModel version)
def get_session():
    """Provides a transactional scope for the database session."""
    with Session(engine) as session:
        yield session

# 4. Modular Table Initialization
def init_db():
    """
    Synchronizes the SQLModel DNA with the PostgreSQL database.
    Only logs the high-level summary to keep the console clean.
    """
    reset_requested = os.getenv("RESET_DB", "false").lower() == "true"
    
    # IMPORT MODELS HERE
    # These imports register the tables in SQLModel.metadata
    from models.user import User
    from models.project import Project
    # Project imports Functionality/Tasks chain automatically

    print("\n--- 🛡️  Kether Database Foundry: Initializing ---")
    
    # Inspect current state before changes
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if reset_requested:
        print("⚠️  RESET_DB=true: Dropping all existing tables...")
        SQLModel.metadata.drop_all(engine)
        existing_tables = [] # Clear the list for accurate reporting below

    # Create missing tables
    SQLModel.metadata.create_all(engine)
    
    # Verify results
    current_tables = inspect(engine).get_table_names()
    
    if not current_tables:
        print("  [!] ERROR: No tables detected. Check model registrations.")
    else:
        for table in current_tables:
            # Only highlight 'CREATED' if it wasn't there before
            if table not in existing_tables:
                print(f"  [+] Table: {table: <15} | Status: CREATED ✨")
            else:
                # Summary line for existing tables (cleaner)
                pass 
        
        print(f"✅ Schema Verified: {len(current_tables)} tables online.")
        
    print("--- ✅ Database Initialization Complete ---\n")