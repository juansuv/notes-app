
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user_endpoint(client: AsyncClient):
    response = await client.post(
        "/register",
        json={"username": "newuser2", "password": "newpassword"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "newuser2"

@pytest.mark.asyncio
async def test_login_user_endpoint(client: AsyncClient, setup_data):
    response = await client.post(
        "/login",
        json={"username": setup_data.username, "password": "testpassword"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
