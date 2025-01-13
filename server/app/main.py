from fastapi import FastAPI
from app.config.db import database
import uvicorn
from app.routers import user  

app = FastAPI()

app.include_router(user.router, prefix="/users", tags=["Users"])

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def read_root():
    return {"message": "Database connected!"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)