from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from typing import Optional

from core.database import get_db
from core.security import get_password_hash, verify_password, create_access_token, get_current_user
from models.user import User, AuthProvider
from pydantic import BaseModel, EmailStr

router = APIRouter()

# --- SCHEMAS ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    fullName: str 

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# New Schema for updating the profile
class UserUpdate(BaseModel):
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# --- ROUTES ---

@router.get("/health")
async def health_check():
    return {"status": "online", "version": "1.0.0-kether"}

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Identity already exists in Kether core.")
    
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
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database engine failure.")

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
async def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Identity record not found.")

    if not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Security credentials rejected.")
    
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Account pending terminal verification.")

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

# --- NEW: UPDATE PROFILE ROUTE ---
@router.patch("/me")
def update_current_user(
    user_update: UserUpdate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
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
def delete_current_user(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # This will wipe the user and, depending on your DB relationships, cascade to their data
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully"}