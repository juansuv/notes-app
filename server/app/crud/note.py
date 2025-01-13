from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.note import Note
from app.schemas.note import NoteCreate

async def create_note(db: AsyncSession, note: NoteCreate, user_id: int):
    db_note = Note(**note.model_dump(), owner_id=user_id)
    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)
    return db_note

async def get_user_notes(db: AsyncSession, user_id: int):
    result = await db.execute(select(Note).where(Note.owner_id == user_id))
    return result.scalars().all()

async def get_note_by_id(db: AsyncSession, note_id: int, user_id: int):
    result = await db.execute(select(Note).where(Note.id == note_id, Note.owner_id == user_id))
    return result.scalar_one_or_none()

async def get_all_notes(db: AsyncSession):
    result = await db.execute(select(Note))
    return result.scalars().all()