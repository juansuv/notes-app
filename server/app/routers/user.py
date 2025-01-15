from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import create_user, get_user_by_username
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.utils.authentication import create_access_token, verify_password
from app.config.db import get_db

router = APIRouter()


@router.post(
    "/register",
    summary="Registrar un nuevo usuario",
    description="Crea una nueva cuenta de usuario proporcionando un nombre de usuario único y una contraseña.",
    response_description="El usuario registrado con su ID y nombre de usuario.",
    response_model=UserResponse,
)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=409, detail="Username already registered")
    return await create_user(db, user)


@router.post(
    "/login",
    summary="Iniciar sesión",
    description="Inicia sesión con un nombre de usuario y contraseña válidos para obtener un token JWT.",
    response_description="El token JWT y su tipo (bearer).",
)
async def login_user(userLogin: UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_username(db, userLogin.username)
    if not db_user or not verify_password(userLogin.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer", "username": db_user.username}
