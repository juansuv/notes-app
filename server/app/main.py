from fastapi import FastAPI
from app.config.db import database
import uvicorn
from app.routers import user
from app.routers import note  
from app.routers import note_websocket
app = FastAPI()

app.include_router(user.router, prefix="/api/auth", tags=["Users"])
app.include_router(note.router, prefix="/api/notes", tags=["Notes"])
app.include_router(note_websocket.router, tags=["WebSockets"])


@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/api", tags=["Root"])
async def api_root():
    return {
        "message": "Welcome to the Notes App API!",
        "endpoints": {
            "users": "/api/users",
            "notes": "/api/notes",
        },
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)