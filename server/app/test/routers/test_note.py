import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_note_endpoint(client: AsyncClient, setup_data):
    response = await client.post(
        "/notes",
        json={"title": "New Note", "content": "This is a new note", "shared_with": []},
        headers={"Authorization": f"Bearer {setup_data.token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Note"

