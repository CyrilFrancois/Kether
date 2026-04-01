from typing import List, Optional
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship

class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"

class User(SQLModel, table=True):
    # SQLModel uses 'table=True' to define the SQLAlchemy metadata
    __tablename__: str = "users" 

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: Optional[str] = Field(default=None) # Null if Google user
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Auth Logic
    provider: str = Field(default=AuthProvider.LOCAL)
    is_verified: bool = Field(default=False)
    verification_token: Optional[str] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # --- THE CRITICAL FIX ---
    # We use a string "Project" and back_populates="owner"
    # This matches the Project class we defined previously.
    projects: List["Project"] = Relationship(
        back_populates="owner", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )