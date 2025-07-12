from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
import re


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    username: str
    password_hash: str
    display_name: str
    profile_picture: Optional[str] = None  # Base64 encoded image or URL
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not re.match("^[a-zA-Z0-9_]{3,20}$", v):
            raise ValueError('Username must be 3-20 characters, alphanumeric and underscores only')
        return v


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    profile_picture: Optional[str] = None
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not re.match("^[a-zA-Z0-9_]{3,20}$", v):
            raise ValueError('Username must be 3-20 characters, alphanumeric and underscores only')
        return v


class UserLogin(BaseModel):
    email_or_username: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    display_name: str
    profile_picture: Optional[str] = None
    created_at: datetime
    is_active: bool


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    profile_picture: Optional[str] = None
    
    @validator('display_name')
    def display_name_length(cls, v):
        if v is not None:
            if len(v.strip()) < 2:
                raise ValueError('Display name must be at least 2 characters long')
            if len(v.strip()) > 50:
                raise ValueError('Display name must be less than 50 characters')
            return v.strip()
        return v


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None


# Quest-related models that will be user-specific
class QuestData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    quest_data: Dict[str, Any]  # Store the entire quest context state
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class QuestDataCreate(BaseModel):
    quest_data: Dict[str, Any]


class QuestDataUpdate(BaseModel):
    quest_data: Dict[str, Any]