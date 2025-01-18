from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

# Diccionario global para almacenar conexiones WebSocket activas
# Las claves son los IDs de las notas y los valores son listas de conexiones WebSocket asociadas
connections: Dict[int, List[WebSocket]] = {}


@router.websocket("/ws/notes/{note_id}")
async def websocket_endpoint(websocket: WebSocket, note_id: int, user_id: int):
    """
    Endpoint WebSocket para manejar la colaboración en tiempo real en notas.

    Parámetros:
    - `websocket`: La conexión WebSocket establecida con el cliente.
    - `note_id`: ID de la nota para la cual se establece la conexión.
    - `user_id`: ID del usuario que inicia la conexión.

    Funcionalidad:
    1. Acepta la conexión WebSocket.
    2. Agrega la conexión al grupo correspondiente basado en el `note_id`.
    3. Maneja acciones como "start_edit" y "end_edit", notificando a otros usuarios conectados.
    4. Elimina la conexión en caso de desconexión del cliente.
    """
    # Acepta la conexión WebSocket
    await websocket.accept()

    # Si no hay conexiones para la nota actual, inicializa una lista vacía
    if note_id not in connections:
        connections[note_id] = []

    # Agrega la conexión actual al grupo de conexiones para la nota
    connections[note_id].append(websocket)

    try:
        # Ciclo principal para recibir y manejar mensajes del cliente
        while True:
            # Espera y recibe datos en formato JSON desde el cliente
            data = await websocket.receive_json()
            action = data.get("action")  # Determina la acción enviada por el cliente

            if action == "start_edit":
                # Notifica a otros usuarios conectados que el usuario comenzó a editar la nota
                for connection in connections[note_id]:
                    if (
                        connection != websocket
                    ):  # Evita enviar el mensaje al mismo cliente
                        await connection.send_json(
                            {"type": "editing", "user_id": user_id}
                        )
            elif action == "end_edit":
                # Notifica a otros usuarios conectados que el usuario dejó de editar la nota
                for connection in connections[note_id]:
                    if connection != websocket:
                        await connection.send_json(
                            {"type": "stopped_editing", "user_id": user_id}
                        )
    except WebSocketDisconnect:
        # Maneja la desconexión del cliente
        connections[note_id].remove(websocket)  # Elimina la conexión del grupo

        # Si no quedan conexiones para la nota, elimina la entrada del diccionario
        if not connections[note_id]:
            del connections[note_id]
