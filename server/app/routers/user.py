from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import create_user, get_user_by_username
from app.schemas.user import UserCreate, UserResponse
from app.utils.authentication import create_access_token, verify_password
from app.config.db import get_db

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return await create_user(db, user)

@router.post("/login")
async def login_user(username: str, password: str, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_username(db, username)
    if not db_user or not verify_password(password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}
