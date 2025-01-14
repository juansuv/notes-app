import pytest
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.main import app

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.base import Base
from uuid import uuid4
# Motor de base de datos de pruebas (SQLite en memoria)
SQLALCHEMY_TEST_DATABASE_URL = "postgresql+asyncpg://notes_test_user:Notes123.@localhost/notes_test_app"



# Crear el motor de pruebas
engine_test = create_async_engine(SQLALCHEMY_TEST_DATABASE_URL, future=True, echo=False)

# Crear una fábrica de sesiones
TestSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine_test, class_=AsyncSession
)


# Crear las tablas en la base de datos de pruebas
async def init_test_db():
    print(f"Creating tables test dabatabse {SQLALCHEMY_TEST_DATABASE_URL}" )
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
# Dependency override para pruebas
async def override_get_db():
    async with TestSessionLocal() as session:
        yield session



app.dependency_overrides["get_db"] = override_get_db


@pytest.fixture(scope="session")
def event_loop():
    """Crear un nuevo bucle de eventos para las pruebas."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.run_until_complete(loop.shutdown_asyncgens())

    loop.close()

@pytest.fixture(scope="module", autouse=True)
async def setup_test_db():
    # Inicializar la base de datos de pruebas antes de correr las pruebas
    await init_test_db()
    yield
    await engine_test.dispose()


@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def async_session():
    async for session in override_get_db():
        try:
            yield session
        finally:
            await session.close()  # Asegura que la conexión se cierre
            await session.rollback()  # Devuelve la conexión a un estado limpio
        
@pytest.fixture
async def setup_data(async_session: AsyncSession):
    from app.crud.user import create_user
    from app.schemas.user import UserCreate
    print("Creating user")
    user = UserCreate(username=f"testuser_{uuid4().hex}", password="testpassword")
    created_user = await create_user(async_session, user)
    return created_user
