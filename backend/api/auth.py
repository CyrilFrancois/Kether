import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel, EmailStr

# Internal imports
from core.database import get_session 
from core.security import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    get_current_user
)
from models.user import User, AuthProvider

router = APIRouter()

# --- SCHEMAS ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    fullName: str 

class UserUpdate(BaseModel):
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# --- ROUTES ---

@router.get("/health")
async def health_check():
    """
    Used by Docker Compose healthcheck. 
    Ensure docker-compose.yml points to /auth/health.
    """
    return {"status": "online", "version": "1.0.0-kether"}

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate, db: Session = Depends(get_session)):
    # 1. Check if identity already exists
    statement = select(User).where(User.email == user_in.email)
    existing_user = db.exec(statement).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Identity already exists in Kether core."
        )
    
    # 2. Map Pydantic model to SQLModel Table
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.fullName, 
        provider=AuthProvider.LOCAL,
        is_verified=True, 
        verification_token=str(uuid.uuid4())
    )
    
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        print(f"❌ DATABASE ERROR during registration: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Kether Vault could not store this record."
        )

    # 3. Issue Token immediately upon registration
    access_token = create_access_token(subject=new_user.email)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {
            "email": new_user.email, 
            "fullName": new_user.full_name,
            "id": str(new_user.id)
        }
    }

@router.post("/login", response_model=Token)
async def login(
    db: Session = Depends(get_session),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Standard OAuth2 Login.
    Note: form_data.username is treated as the user's email.
    """
    # 1. Fetch user
    statement = select(User).where(User.email == form_data.username)
    user = db.exec(statement).first()
    
    # 2. Validate credentials
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Security credentials rejected. Check email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Create Session Token
    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {
            "email": user.email, 
            "fullName": user.full_name,
            "id": str(user.id)
        }
    }

@router.get("/me", response_model=dict)
async def get_me(current_user: User = Depends(get_current_user)):
    """Simple profile check for the frontend."""
    return {
        "email": current_user.email,
        "fullName": current_user.full_name,
        "id": str(current_user.id)
    }

@router.patch("/me")
async def update_current_user(
    user_update: UserUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    db.add(current_user) 
    db.commit()
    db.refresh(current_user)
    
    return {
        "message": "Profile updated", 
        "user": {
            "email": current_user.email,
            "fullName": current_user.full_name
        }
    }

@router.delete("/me")
async def delete_current_user(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    db.delete(current_user)
    db.commit()
    return {"message": "Account purged from Kether core successfully"}