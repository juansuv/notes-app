import pytest
from app.test.test_config import init_test_db, override_get_db, TestSessionLocal, test_engine
from app.main import app
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

import asyncio


from uuid import uuid4

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
async def setup_test_database():
    """
    Inicializa la base de datos de prueba antes de ejecutar los tests.
    """
    await init_test_db()


@pytest.fixture
async def client():
    """
    Fixture para proporcionar un cliente HTTP asíncrono para FastAPI.
    """
    print("app", app)
    async with AsyncClient(app=app, base_url="http://test") as client:
        
        yield client
        
        
        
@pytest.fixture
async def userFactory(async_session: AsyncSession):
    from app.crud.user import create_user
    from app.schemas.user import UserCreate
    print("Creating user")
    user = UserCreate(username=f"testuser_{uuid4().hex}", password="testpassword")
    created_user = await create_user(async_session, user)
    return created_user


@pytest.fixture
async def async_session():
    async for session in override_get_db():
        yield session
       



@pytest.fixture
async def tokenFactory(userFactory):
    from app.utils.authentication import create_access_token

    """
    Usa la fixture setup_data para obtener el usuario y genera un token.
    """
    # El usuario creado por setup_data
    user = userFactory

    # Generar un token de acceso para el usuario
    access_token = create_access_token(data={"sub": user.username})

    # Devolver el usuario y su token
    return {"user": user, "token": access_token}



@pytest.fixture
async def otherUserFactory(async_session: AsyncSession):
    from app.crud.user import create_user
    from app.schemas.user import UserCreate
    print("Creating user")
    user = UserCreate(username=f"other_{uuid4().hex}", password="testpassword")
    created_user = await create_user(async_session, user)
    return created_user

@pytest.fixture
async def otherTokenFactory(otherUserFactory):
    from app.utils.authentication import create_access_token

    """
    Usa la fixture setup_data para obtener el usuario y genera un token.
    """
    # El usuario creado por setup_data
    user = otherUserFactory

    # Generar un token de acceso para el usuario
    access_token = create_access_token(data={"sub": user.username})

    # Devolver el usuario y su token
    return {"user": user, "token": access_token}