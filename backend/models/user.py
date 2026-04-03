from typing import List, Optional, TYPE_CHECKING
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship

# This prevents circular imports at runtime but allows 
# IDEs and SQLModel to see the 'Project' class for type hinting.
if TYPE_CHECKING:
    from .project import Project

class AuthProvider(str, Enum):
    LOCAL = "local"
    GOOGLE = "google"

class User(SQLModel, table=True):
    __tablename__: str = "users" 

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, nullable=False)
    hashed_password: Optional[str] = Field(default=None)
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    
    # Auth Logic
    provider: str = Field(default=AuthProvider.LOCAL)
    is_verified: bool = Field(default=False)
    verification_token: Optional[str] = None
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # Relationship using string reference
    # The List["Project"] hint works because of the TYPE_CHECKING import above
    projects: List["Project"] = Relationship(
        back_populates="owner", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )