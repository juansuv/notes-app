import pytest
from httpx import AsyncClient

from app.crud.user import create_user

@pytest.mark.asyncio
async def test_create_note_endpoint(client: AsyncClient, tokenFactory):
    response = await client.post(
        "api/notes",
        json={"title": "New Note", "content": "This is a new note", "shared_with": []},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Note"


@pytest.mark.asyncio
async def test_create_note_unauthenticated(client: AsyncClient):
    response = await client.post(
        "api/notes",
        json={"title": "Note without Auth", "content": "This should fail"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"
    

@pytest.mark.asyncio
async def test_list_notes_endpoint(client: AsyncClient, tokenFactory):
    # Crear notas para el usuario
    await client.post(
        "api/notes",
        json={"title": "Note 1", "content": "This is a new note", "shared_with": []},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    await client.post(
        "api/notes",
        json={"title": "Note 2", "content": "This is a new note 2", "shared_with": []},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    # Listar las notas
    response = await client.get(
        "api/notes",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    assert response.status_code == 200
    notes = response.json()
    assert len(notes) == 2
    assert notes[0]["title"] == "Note 1"
    assert notes[1]["title"] == "Note 2"
    assert notes[0]["content"] == "This is a new note"
    assert notes[1]["content"] == "This is a new note 2"


@pytest.mark.asyncio
async def test_get_note_endpoint(client: AsyncClient, tokenFactory):
    # Crear una nota
    response = await client.post(
        "api/notes",
        json={"title": "Specific Note", "content": "Content for specific note"},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    note_id = response.json()["id"]
    print("note_id",response.json())
    # Obtener la nota creada
    response = await client.get(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    print("laims",response.json())
    assert response.status_code == 200
    assert response.json()["title"] == "Specific Note"
    
@pytest.mark.asyncio
async def test_update_note_endpoint(client: AsyncClient, tokenFactory):
    # Crear una nota
    response = await client.post(
        "api/notes",
        json={"title": "Note to Update", "content": "Original Content for note 1"},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    note_id = response.json()["id"]

    # Actualizar la nota
    response = await client.put(
        f"api/notes/{note_id}",
        json={"title": "Updated Note", "content": "Updated Content for note 1", "version": 1},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    print(response.json())
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Note"
    assert response.json()["content"] == "Updated Content for note 1"
    
    
@pytest.mark.asyncio
async def test_delete_note_endpoint(client: AsyncClient, tokenFactory):
    # Crear una nota
    response = await client.post(
        "api/notes",
        json={"title": "Note to Delete", "content": "Content to Delete note"},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    note_id = response.json()["id"]

    # Eliminar la nota
    response = await client.delete(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    assert response.status_code == 204

    # Verificar que la nota ya no exista
    response = await client.get(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"


@pytest.mark.asyncio
async def test_access_note_of_another_user(client: AsyncClient, tokenFactory, otherTokenFactory):
    # Crear una nota con un usuario
    response = await client.post(
        "api/notes",
        json={"title": "Private Note", "content": "This should be private"},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"}
    )
    note_id = response.json()["id"]

    # Intentar acceder a la nota con otro usuario
    response = await client.get(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {otherTokenFactory['token']}"}
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Permission denied"

