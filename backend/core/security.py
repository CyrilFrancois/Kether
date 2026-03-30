import os
from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext

# 1. Configuration
# Secret key to sign JWTs - pulls from .env (generated in our previous step)
SECRET_KEY = os.getenv("KETHER_ACCESS_KEY", "kether_super_secret_fallback")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours for development ease

# 2. Password Hashing Context
# We use bcrypt for industry-standard security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- PASSWORD HELPERS ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Checks if the provided password matches the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generates a secure hash from a plain-text password."""
    return pwd_context.hash(password)

# --- JWT HELPERS ---

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """
    Creates a signed JWT for the user session.
    The 'sub' (subject) usually contains the user's email or ID.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """
    Decodes the token to retrieve the user information.
    Raises an error if the token is expired or invalid.
    """
    try:
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token if decoded_token["exp"] >= datetime.utcnow().timestamp() else None
    except:
        return None