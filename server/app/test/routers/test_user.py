import pytest
from httpx import AsyncClient
from app.main import app  # Asegúrate de que este sea el punto de entrada de tu FastAPI
import asyncio


@pytest.mark.asyncio
async def test_register_user_endpoint(client: AsyncClient):
    response = await client.post(
        "api/auth/register", json={"username": "newuser2", "password": "NewPassword123"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "newuser2"


@pytest.mark.asyncio
async def test_login_user_endpoint(client: AsyncClient, userFactory):
    client.get_io_loop = asyncio.get_running_loop

    response = await client.post(
        "api/auth/login",
        json={"username": userFactory.username, "password": "Testpassword123."},
    )
    assert response.status_code == 200
    assert "token" in response.json()


@pytest.mark.asyncio
async def test_login_with_no_user_endpoint(client: AsyncClient):
    client.get_io_loop = asyncio.get_running_loop

    response = await client.post(
        "api/auth/login", json={"username": "Fakeuser", "password": "TestPassword123."}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_register_duplicate_user(client: AsyncClient):
    # Registrar un usuario
    response1 = await client.post(
        "api/auth/register",
        json={"username": "duplicateuser", "password": "Password123"},
    )
    assert response1.status_code == 200

    # Intentar registrar el mismo usuario
    response2 = await client.post(
        "api/auth/register",
        json={"username": "duplicateuser", "password": "NewPassword123123"},
    )
    assert response2.status_code == 409
    assert response2.json()["detail"] == "Username already registered"


@pytest.mark.asyncio
async def test_login_invalid_credentials(client: AsyncClient):
    # Intentar iniciar sesión con credenciales incorrectas
    response = await client.post(
        "api/auth/login",
        json={"username": "nonexistentuser", "password": "Wrongpassword12"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


@pytest.mark.asyncio
async def test_access_protected_resource_without_token(client: AsyncClient):
    response = await client.get("api/notes")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


@pytest.mark.asyncio
async def test_access_protected_resource_with_invalid_token(client: AsyncClient):
    invalid_token = "invalid.token.here"
    response = await client.get(
        "/api/notes", headers={"Authorization": f"Bearer {invalid_token}"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


@pytest.mark.asyncio
async def test_register_with_weak_password(client: AsyncClient):
    response = await client.post(
        "api/auth/register", json={"username": "weakpassworduser", "password": "123"}
    )
    assert response.status_code == 422

    error_detail = response.json()["errors"][0]["error"]

    assert error_detail == "Value error, contraseña: Debe tener al menos 8 caracteres."


@pytest.mark.asyncio
async def test_register_with_weak_username(client: AsyncClient):
    response = await client.post(
        "api/auth/register", json={"username": "as", "password": "123213412"}
    )
    assert response.status_code == 422
    error_detail = response.json()["errors"][0]["error"]

    assert (
        error_detail
        == "Value error, nombre de usuario: Debe tener al menos 3 caracteres."
    )
