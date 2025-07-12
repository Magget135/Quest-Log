from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from motor.motor_asyncio import AsyncIOMotorCollection
from models import User, TokenData

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "quest-tavern-secret-key-2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# OAuth2 scheme
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_user_by_email(email: str, users_collection: AsyncIOMotorCollection) -> Optional[User]:
    """Get user by email."""
    user_data = await users_collection.find_one({"email": email})
    if user_data:
        return User(**user_data)
    return None


async def get_user_by_username(username: str, users_collection: AsyncIOMotorCollection) -> Optional[User]:
    """Get user by username."""
    user_data = await users_collection.find_one({"username": username})
    if user_data:
        return User(**user_data)
    return None


async def get_user_by_id(user_id: str, users_collection: AsyncIOMotorCollection) -> Optional[User]:
    """Get user by ID."""
    user_data = await users_collection.find_one({"id": user_id})
    if user_data:
        return User(**user_data)
    return None


async def authenticate_user(
    email_or_username: str, 
    password: str, 
    users_collection: AsyncIOMotorCollection
) -> Union[User, bool]:
    """Authenticate a user with email/username and password."""
    # Try to find user by email first
    user = await get_user_by_email(email_or_username, users_collection)
    if not user:
        # If not found by email, try username
        user = await get_user_by_username(email_or_username, users_collection)
    
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    users_collection: AsyncIOMotorCollection = None
) -> User:
    """Get the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(token_data.user_id, users_collection)
    if user is None:
        raise credentials_exception
    return user


def generate_default_avatar(username: str) -> str:
    """Generate a default avatar based on the first initial of username."""
    initial = username[0].upper() if username else "?"
    
    # Create a simple SVG avatar with the initial
    svg_content = f'''<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="bg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#A0522D;stop-opacity:1" />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#bg)" stroke="#654321" stroke-width="3"/>
        <text x="50" y="65" font-family="serif" font-size="36" font-weight="bold" 
              text-anchor="middle" fill="#F4E4BC" stroke="#654321" stroke-width="1">{initial}</text>
    </svg>'''
    
    # Convert SVG to base64
    import base64
    svg_bytes = svg_content.encode('utf-8')
    svg_base64 = base64.b64encode(svg_bytes).decode('utf-8')
    return f"data:image/svg+xml;base64,{svg_base64}"