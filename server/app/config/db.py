from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from databases import Database
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Configuración del engine asíncrono
engine = create_async_engine(DATABASE_URL, echo=True)

# Configuración de sesiones
async_session = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)

# Configuración para consultas directas (opcional)
database = Database(DATABASE_URL)

async def get_db():
    async with async_session() as session:
        yield session
