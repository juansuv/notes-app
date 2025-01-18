from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from databases import Database
import os
from dotenv import load_dotenv

# Carga las variables de entorno desde el archivo .env
load_dotenv()

# URL de la base de datos desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# Configuración del engine asíncrono
# Este engine permite realizar operaciones con SQLAlchemy en un entorno asíncrono.
engine = create_async_engine(
    DATABASE_URL,  # URL de conexión a la base de datos
    echo=True      # Activa el modo verbose para ver las consultas en la consola
)

# Configuración de la sesión asíncrona
# Se utiliza `sessionmaker` para crear sesiones de base de datos asíncronas.
async_session = sessionmaker(
    engine,               # Engine asíncrono configurado previamente
    expire_on_commit=False,  # Evita que los objetos expiren después de hacer commit
    class_=AsyncSession   # Especifica que las sesiones son del tipo asíncrono
)

# Configuración para consultas directas (opcional)
# Esto es útil si prefieres interactuar directamente con la base de datos sin usar ORM.
database = Database(DATABASE_URL)

# Generador de sesiones para FastAPI
# Este generador permite inyectar sesiones de base de datos en las dependencias de FastAPI.
async def get_db():
    """
    Generador de sesiones de base de datos.
    Proporciona una sesión asíncrona para cada operación.
    Después de completar el uso, cierra automáticamente la sesión.

    Uso:
    - Dependencia en endpoints de FastAPI para acceder a la base de datos.
    """
    async with async_session() as session:
        yield session  # Proporciona la sesión al contexto que la necesite
