from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.config.db import database
import uvicorn
from app.routers import user
from app.routers import note  
from app.routers import note_websocket

#cors
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

app.include_router(user.router, prefix="/api/auth", tags=["Users"])
app.include_router(note.router, prefix="/api/notes", tags=["Notes"])
app.include_router(note_websocket.router, tags=["WebSockets"])


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Manejador personalizado para errores de validación.
    """
    errors = []
    for error in exc.errors():
        # Extrae la ubicación y el mensaje del error
        loc = " -> ".join(str(e) for e in error["loc"])  # Ubicación del campo
        msg = error["msg"]  # Mensaje de error
        errors.append({"field": loc, "error": msg})
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": errors},
    )


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