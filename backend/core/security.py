import os
from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlmodel import Session, select

from core.database import get_session
from models.user import User

# 1. Configuration
SECRET_KEY = os.getenv("KETHER_ACCESS_KEY", "kether_super_secret_fallback")
ALGORITHM = "HS256"
# Set to 24 hours
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 

# 2. Security Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# CRITICAL FIX: This must match your main.py router registration.
# main.py has: app.include_router(auth.router, prefix="/auth", ...)
# So the login endpoint is exactly "auth/login"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# --- PASSWORD HELPERS ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# --- JWT HELPERS ---

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire, 
        "sub": str(subject),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- THE SECURITY GUARD ---

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_session)
) -> User:
    """
    Decodes the token and returns the User object from the DB.
    If the database was recently reset, the token will be invalid 
    because the User ID/Email no longer exists in the 'users' table.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials - please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            print("❌ SECURITY: Token payload missing 'sub' claim.")
            raise credentials_exception
    except JWTError as e:
        print(f"❌ SECURITY: JWT Decode Error: {e}")
        raise credentials_exception

    # SQLModel query
    statement = select(User).where(User.email == email)
    user = db.exec(statement).first()
    
    if user is None:
        # This happens often after a RESET_DB=true because 
        # the user exists in your browser cookies but NOT in Postgres.
        print(f"❌ SECURITY: User {email} found in token but NOT in Database.")
        raise credentials_exception
        
    return user