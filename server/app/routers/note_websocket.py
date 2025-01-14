from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List

router = APIRouter()

connections: Dict[int, List[WebSocket]] = {}

@router.websocket("/ws/notes/{note_id}")
async def websocket_endpoint(websocket: WebSocket, note_id: int, user_id: int):
    await websocket.accept()

    if note_id not in connections:
        connections[note_id] = []

    connections[note_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")

            if action == "start_edit":
                # Notifica a otros usuarios
                for connection in connections[note_id]:
                    if connection != websocket:
                        await connection.send_json({"type": "editing", "user_id": user_id})
            elif action == "end_edit":
                # Notifica que se dejó de editar
                for connection in connections[note_id]:
                    if connection != websocket:
                        await connection.send_json({"type": "stopped_editing", "user_id": user_id})
    except WebSocketDisconnect:
        connections[note_id].remove(websocket)
        if not connections[note_id]:
            del connections[note_id]
