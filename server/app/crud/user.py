from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.user import UserCreate
from passlib.hash import bcrypt

async def create_user(db: AsyncSession, user: UserCreate):
    #encriptamos el password para mayor seguridad
    hashed_password = bcrypt.hash(user.password)
    db_user = User(username=user.username, password=hashed_password)
    #agregamos el usuario a la base de datos
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()

async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()
