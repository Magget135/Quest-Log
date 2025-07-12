from fastapi import FastAPI, APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime, timedelta

# Import authentication modules
from models import (
    User, UserCreate, UserLogin, UserResponse, UserUpdate, 
    Token, QuestData, QuestDataCreate, QuestDataUpdate
)
from auth import (
    get_password_hash, authenticate_user, create_access_token,
    get_current_user, generate_default_avatar, security
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
users_collection = db.users
quest_data_collection = db.quest_data

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# Authentication endpoints
@api_router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_email = await users_collection.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    existing_username = await users_collection.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Generate default avatar if none provided
    profile_picture = user_data.profile_picture
    if not profile_picture:
        profile_picture = generate_default_avatar(user_data.username)
    
    # Create user (use username as display_name)
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        username=user_data.username,
        password_hash=hashed_password,
        display_name=user_data.username,  # Use username as display name
        profile_picture=profile_picture
    )
    
    # Insert user into database
    await users_collection.insert_one(user.dict())
    
    # Create access token
    access_token_expires = timedelta(minutes=30 * 24 * 60)  # 30 days
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    # Return token and user info
    user_response = UserResponse(**user.dict())
    return Token(access_token=access_token, user=user_response)


@api_router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    user = await authenticate_user(
        user_credentials.email_or_username, 
        user_credentials.password, 
        users_collection
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=30 * 24 * 60)  # 30 days
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    # Return token and user info
    user_response = UserResponse(**user.dict())
    return Token(access_token=access_token, user=user_response)


@api_router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = await get_current_user(credentials, users_collection)
    return UserResponse(**user.dict())


@api_router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    current_user = await get_current_user(credentials, users_collection)
    
    # Update user data
    update_data = {}
    if user_update.display_name is not None:
        update_data["display_name"] = user_update.display_name
    if user_update.profile_picture is not None:
        update_data["profile_picture"] = user_update.profile_picture
    
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        await users_collection.update_one(
            {"id": current_user.id}, 
            {"$set": update_data}
        )
        
        # Get updated user
        updated_user_data = await users_collection.find_one({"id": current_user.id})
        return UserResponse(**updated_user_data)
    
    return UserResponse(**current_user.dict())


# Quest data endpoints (user-specific)
@api_router.post("/quest-data", response_model=dict)
async def save_quest_data(
    quest_data: QuestDataCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    current_user = await get_current_user(credentials, users_collection)
    
    # Check if user already has quest data
    existing_data = await quest_data_collection.find_one({"user_id": current_user.id})
    
    if existing_data:
        # Update existing data
        await quest_data_collection.update_one(
            {"user_id": current_user.id},
            {
                "$set": {
                    "quest_data": quest_data.quest_data,
                    "updated_at": datetime.utcnow()
                }
            }
        )
    else:
        # Create new quest data
        quest_data_obj = QuestData(
            user_id=current_user.id,
            quest_data=quest_data.quest_data
        )
        await quest_data_collection.insert_one(quest_data_obj.dict())
    
    return {"message": "Quest data saved successfully"}


@api_router.get("/quest-data", response_model=dict)
async def get_quest_data(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    current_user = await get_current_user(credentials, users_collection)
    
    # Get user's quest data
    quest_data = await quest_data_collection.find_one({"user_id": current_user.id})
    
    if quest_data:
        return {"quest_data": quest_data["quest_data"]}
    else:
        # Return empty data structure for new users
        return {"quest_data": None}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
