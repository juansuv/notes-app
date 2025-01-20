from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
import os
from dotenv import load_dotenv
import asyncio

# Cargar las variables de entorno desde el archivo .env 
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Motor para PostgreSQL en pruebas
test_engine = create_async_engine(DATABASE_URL, echo=True, future=True)



TestSessionLocal = sessionmaker(
    bind=test_engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

async def init_test_db():
    """
    Crea las tablas en la base de datos de pruebas.
    """
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

async def override_get_db():
    """
    Sobrescribe `get_db` para usar la base de datos de pruebas.
    """
    async with TestSessionLocal() as session:
        yield session
