from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://notes_user:Notes123.@localhost/notes_app"
engine = create_async_engine(DATABASE_URL)

async def test_connection():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        for row in result:
            print(row)

import asyncio
asyncio.run(test_connection())
