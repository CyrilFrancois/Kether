from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid

from core.database import get_db
from core.security import get_password_hash, verify_password, create_access_token
from models.user import User, AuthProvider
from pydantic import BaseModel, EmailStr

router = APIRouter()

# --- SCHEMAS (Request/Response Shapes) ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# --- ROUTES ---

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Create new user
    verification_token = str(uuid.uuid4())
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        provider=AuthProvider.LOCAL,
        is_verified=False, # Requires email verification
        verification_token=verification_token
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 3. [MOCK] Send Verification Email 
    # In a real setup, we'd trigger a background task here
    print(f"DEBUG: Verification link for {new_user.email}: /verify?token={verification_token}")

    # 4. Issue temporary token
    access_token = create_access_token(subject=new_user.email)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"email": new_user.email, "full_name": new_user.full_name}
    }

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first")

    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": {"email": user.email, "full_name": user.full_name}
    }

@router.post("/google")
async def google_auth(token_obj: dict, db: Session = Depends(get_db)):
    """
    Placeholder for Google OAuth. 
    The frontend will send a 'credential' string from Google's GSI library.
    """
    # Logic will go here: Verify Google Token -> Check DB -> Login or Register
    return {"message": "Google Auth initialized. Waiting for Client ID configuration."}