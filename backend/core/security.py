import os
from datetime import datetime, timedelta
from typing import Any, Union, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlmodel import Session, select  # <--- Changed to sqlmodel Session

from core.database import get_session
from models.user import User

# 1. Configuration
SECRET_KEY = os.getenv("KETHER_ACCESS_KEY", "kether_super_secret_fallback")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# 2. Security Setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Updated to match the typical router prefix /api/auth/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# --- PASSWORD HELPERS ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# --- JWT HELPERS ---

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Ensure 'exp' is a UTC timestamp to avoid timezone/format mismatches
    to_encode = {
        "exp": expire, 
        "sub": str(subject),
        "iat": datetime.utcnow() # 'Issued At' - good for debugging
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- THE SECURITY GUARD ---

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_session) # <--- FIXED: name 'get_db' is now 'get_session'
) -> User:
    """
    Decodes the token and returns the User object from the DB.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # SQLModel way to query by email
    statement = select(User).where(User.email == email)
    user = db.exec(statement).first()
    
    if user is None:
        raise credentials_exception
        
    return user