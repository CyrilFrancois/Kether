from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship # <--- Added this
from sqlalchemy.sql import func
import enum
from core.database import Base

class AuthProvider(str, enum.Enum):
    LOCAL = "local"     # Email + Password
    GOOGLE = "google"   # OAuth2

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True) # Null if Google user
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # Auth Logic
    provider = Column(String, default=AuthProvider.LOCAL)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # --- The Relationship Piece ---
    # This connects the User to the Projects table.
    # back_populates="owner" must match the variable name in Project model.
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")