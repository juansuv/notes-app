import pytest
from app.test.test_config import (
    init_test_db,
    override_get_db,
    TestSessionLocal,
    test_engine,
)
from app.main import app
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
import asyncio
from uuid import uuid4

# Sobrescribir la dependencia `get_db` con una versión de prueba
app.dependency_overrides["get_db"] = override_get_db


@pytest.fixture(scope="session")
def event_loop():
    """
    Crea un nuevo bucle de eventos para las pruebas.
    Este fixture establece un bucle de eventos a nivel de sesión para permitir
    el uso de operaciones asíncronas durante los tests.
    """
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.run_until_complete(loop.shutdown_asyncgens())
    loop.close()


@pytest.fixture(scope="module", autouse=True)
async def setup_test_database():
    """
    Inicializa la base de datos de prueba antes de ejecutar los tests.
    Este fixture se ejecuta automáticamente antes de cualquier prueba del módulo.
    """
    await init_test_db()


@pytest.fixture
async def client():
    """
    Proporciona un cliente HTTP asíncrono para interactuar con la aplicación FastAPI.
    Este cliente se usa para realizar solicitudes HTTP simuladas en los tests.
    """
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client


@pytest.fixture
async def userFactory(async_session: AsyncSession):
    """
    Crea un usuario en la base de datos de prueba.
    Devuelve el objeto del usuario creado.
    """
    from app.crud.user import create_user
    from app.schemas.user import UserCreate

    user = UserCreate(username=f"Testuser{uuid4().hex}", password="Testpassword123.")
    created_user = await create_user(async_session, user)
    return created_user


@pytest.fixture
async def async_session():
    """
    Proporciona una sesión asíncrona de base de datos para ejecutar transacciones
    en los tests.
    """
    async for session in override_get_db():
        yield session


@pytest.fixture
async def tokenFactory(userFactory):
    """
    Genera un token de acceso para un usuario creado por `userFactory`.
    Retorna un diccionario con el usuario y el token asociado.
    """
    from app.utils.authentication import create_access_token

    user = userFactory
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id})
    return {"user": user, "token": access_token}


@pytest.fixture
async def otherUserFactory(async_session: AsyncSession):
    """
    Crea otro usuario distinto en la base de datos de prueba.
    Devuelve el objeto del usuario creado.
    """
    from app.crud.user import create_user
    from app.schemas.user import UserCreate

    user = UserCreate(username=f"other{uuid4().hex}", password="Testpassword123.")
    created_user = await create_user(async_session, user)
    return created_user


@pytest.fixture
async def otherTokenFactory(otherUserFactory):
    """
    Genera un token de acceso para un usuario creado por `otherUserFactory`.
    Retorna un diccionario con el usuario y el token asociado.
    """
    from app.utils.authentication import create_access_token

    user = otherUserFactory
    access_token = create_access_token(data={"sub": user.username,  "user_id": user.id})
    return {"user": user, "token": access_token}


@pytest.fixture
async def setup_notes_data(async_session: AsyncSession):
    """
    Configura datos de prueba para notas asociadas a un usuario.
    - Crea un usuario y tres notas en la base de datos.
    - Retorna un diccionario con el usuario y las notas creadas.

    Este fixture puede ser usado para validar operaciones CRUD relacionadas con notas.
    """
    from app.crud.user import create_user
    from app.crud.note import create_note
    from app.schemas.user import UserCreate
    from app.schemas.note import NoteCreate

    # Crear un usuario
    user = UserCreate(username=f"user{uuid4().hex}", password="Password123!")
    created_user = await create_user(async_session, user)

    # Crear notas asociadas al usuario
    notes = []
    for i in range(3):  # Crear 3 notas de ejemplo
        note_data = NoteCreate(
            title=f"Note {i+1}",
            content=f"Content of note {i+1}",
            shared_with=[],
            tags=["tag1", "tag2"],
        )
        note = await create_note(async_session, note_data, user_id=created_user.id)
        notes.append(note)

    # Retornar el usuario y las notas creadas
    return {"user": created_user, "notes": notes}


@pytest.fixture
async def isolated_client():
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        yield client

@pytest.fixture
async def cookieFactory(client: AsyncClient, userFactory):
    """
    Realiza el login para un usuario creado por `userFactory` y retorna las cookies.
    """
    login_payload = {"username": userFactory.username, "password": "Testpassword123."}
    response = await client.post("/api/auth/login_cookie", json=login_payload)
    assert response.status_code == 200
    cookies = response.cookies
    return {"user": userFactory, "cookies": cookies}


@pytest.fixture
async def otherCookieFactory(isolated_client: AsyncClient, otherUserFactory):
    """
    Realiza el login para otro usuario creado por `otherUserFactory` y retorna las cookies.
    """
    
    login_payload = {"username": otherUserFactory.username, "password": "Testpassword123."}
    response = await isolated_client.post("/api/auth/login_cookie", json=login_payload)
    assert response.status_code == 200
    cookies = response.cookies
    return {"user": otherUserFactory, "cookies": cookies}


@pytest.fixture
async def clean_client(client: AsyncClient):
    client.cookies.clear()  # Limpia las cookies del cliente antes de usarlo
    yield client
    
