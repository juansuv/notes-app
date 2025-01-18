import pytest
from httpx import AsyncClient

from app.crud.user import create_user


@pytest.mark.asyncio
async def test_create_note_endpoint(client: AsyncClient, tokenFactory):
    response = await client.post(
        "api/notes",
        json={"title": "New Note", "content": "This is a new note", "shared_with": []},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "New Note"


@pytest.mark.asyncio
async def test_create_note_unauthenticated(client: AsyncClient):
    response = await client.post(
        "api/notes", json={"title": "Note without Auth", "content": "This should fail"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


@pytest.mark.asyncio
async def test_list_notes_endpoint(client: AsyncClient, tokenFactory):
    # Crear notas para el usuario
    await client.post(
        "api/notes",
        json={"title": "Note 1", "content": "This is a new note", "shared_with": []},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    await client.post(
        "api/notes",
        json={"title": "Note 2", "content": "This is a new note 2", "shared_with": []},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    # Listar las notas
    response = await client.get(
        "api/notes", headers={"Authorization": f"Bearer {tokenFactory['token']}"}
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
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    note_id = response.json()["id"]
    print("note_id", response.json())
    # Obtener la nota creada
    response = await client.get(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    print("laims", response.json())
    assert response.status_code == 200
    assert response.json()["title"] == "Specific Note"


@pytest.mark.asyncio
async def test_update_note_endpoint(client: AsyncClient, tokenFactory):
    # Crear una nota
    response = await client.post(
        "api/notes",
        json={"title": "Note to Update", "content": "Original Content for note 1"},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    note_id = response.json()["id"]

    # Actualizar la nota
    response = await client.put(
        f"api/notes/{note_id}",
        json={
            "title": "Updated Note",
            "content": "Updated Content for note 1",
            "version": 1,
        },
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
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
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    note_id = response.json()["id"]

    # Eliminar la nota
    response = await client.delete(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    assert response.status_code == 204

    # Verificar que la nota ya no exista
    response = await client.get(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Note not found"


@pytest.mark.asyncio
async def test_access_note_of_another_user(
    client: AsyncClient, tokenFactory, otherTokenFactory
):
    # Crear una nota con un usuario
    response = await client.post(
        "api/notes",
        json={"title": "Private Note", "content": "This should be private"},
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    note_id = response.json()["id"]

    # Intentar acceder a la nota con otro usuario
    response = await client.get(
        f"api/notes/{note_id}",
        headers={"Authorization": f"Bearer {otherTokenFactory['token']}"},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Permission denied"


# test de concurrencia


@pytest.mark.asyncio
async def test_note_version_concurrency(client: AsyncClient, tokenFactory):
    """
    Este test verifica que el sistema maneje correctamente los conflictos de concurrencia
    al actualizar una nota mediante un mecanismo de bloqueo optimista.

    Bloqueo optimista:
    ------------------
    El bloqueo optimista es una técnica utilizada para manejar actualizaciones concurrentes
    de recursos en bases de datos. En lugar de bloquear directamente un recurso mientras
    se trabaja en él, cada operación de actualización incluye un "versión" o "timestamp"
    que indica el estado actual del recurso.

    Flujo:
    ------
    1. Cuando un cliente lee un recurso (en este caso, una nota), obtiene su versión actual.
    2. El cliente incluye esta versión en su solicitud de actualización.
    3. Si durante la actualización la versión no coincide con la actual en la base de datos,
       significa que otro cliente ya actualizó el recurso, y se rechaza la operación con un
       error de conflicto (HTTP 409).

    Propósito del test:
    -------------------
    Este test simula dos clientes que intentan actualizar la misma nota al mismo tiempo usando
    la misma versión inicial. Verifica que:
    - Solo una de las actualizaciones sea exitosa.
    - La otra actualización sea rechazada debido a un conflicto de versión.
    - El contenido final de la nota refleje la actualización exitosa.
    """
    # Crear una nota inicial
    response = await client.post(
        "/api/notes",
        json={
            "title": "Concurrent Note",
            "content": "Initial content",
            "shared_with": [],
        },
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    assert response.status_code == 200
    note = response.json()
    note_id = note["id"]

    # Obtener la versión inicial de la nota
    original_version = note["version"]

    # Simular dos clientes que intentan actualizar la nota al mismo tiempo
    update_payload_client1 = {
        "title": "Concurrent Note - Client 1",
        "content": "Updated content by client 1",
        "version": original_version,
    }

    update_payload_client2 = {
        "title": "Concurrent Note - Client 2",
        "content": "Updated content by client 2",
        "version": original_version,
    }

    # Ejecutar ambas actualizaciones en paralelo
    response_client1 = await client.put(
        f"/api/notes/{note_id}",
        json=update_payload_client1,
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )

    response_client2 = await client.put(
        f"/api/notes/{note_id}",
        json=update_payload_client2,
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )

    # Verificar que una de las actualizaciones se aplique correctamente
    assert response_client1.status_code in [200, 409]
    assert response_client2.status_code in [200, 409]

    if response_client1.status_code == 200:
        # Si el cliente 1 tuvo éxito, el cliente 2 debería fallar por conflicto de versión
        assert response_client2.status_code == 409
        assert (
            response_client2.json()["detail"]["error"]
            == "Conflict detected. The note was modified by another user."
        )
    else:
        # Si el cliente 2 tuvo éxito, el cliente 1 debería fallar por conflicto de versión
        assert response_client1.status_code == 409
        assert (
            response_client1.json()["detail"]["error"]
            == "Conflict detected. The note was modified by another user."
        )

    # Verificar que el contenido final de la nota corresponde al último cliente exitoso
    response = await client.get(
        f"/api/notes/{note_id}",
        headers={"Authorization": f"Bearer {tokenFactory['token']}"},
    )
    assert response.status_code == 200
    final_note = response.json()

    if response_client1.status_code == 200:
        assert final_note["title"] == "Concurrent Note - Client 1"
        assert final_note["content"] == "Updated content by client 1"
    else:
        assert final_note["title"] == "Concurrent Note - Client 2"
        assert final_note["content"] == "Updated content by client 2"
