from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.note import Note
from app.schemas.note import NoteCreate
from sqlalchemy.sql.expression import any_



async def create_note(db: AsyncSession, note: NoteCreate, user_id: int):
    print(note.shared_with)
    db_note = Note(
        **note.model_dump(),
        owner_id=user_id,
        version=1,
        last_edited_by=user_id
    )
    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)
    return db_note


async def get_user_notes(db: AsyncSession, user_id: int):
    result = await db.execute(select(Note).where(Note.owner_id == user_id))
    return result.scalars().all()


async def get_note_by_id(db: AsyncSession, note_id: int, user_id: int):

    result = await db.execute(
        select(Note).where(
            (Note.id == note_id)
            & ((Note.owner_id == user_id) | (user_id == any_(Note.shared_with)))
        )
    )
    return result.scalar_one_or_none()


async def get_all_notes(db: AsyncSession):
    result = await db.execute(select(Note))
    return result.scalars().all()


async def update_note(db: AsyncSession, note_id: int, user_id: int, updated_note: NoteCreate, version: int):
    # Verifica si la nota existe y si el usuario tiene permisos
    result = await db.execute(
        select(Note).where(
            (Note.id == note_id) & ((Note.owner_id == user_id) | (user_id == any_(Note.shared_with)))
        )
    )
    note = result.scalar_one_or_none()
    if not note:
        return {"error": "Note not found or unauthorized"}

    # Verifica si la versión coincide
    if note.version != version:
        return {"error": "Conflict detected. The note was modified by another user."}


    # Actualiza los campos de la nota
    note.title = updated_note.title
    note.content = updated_note.content
    note.version += 1  # Incrementa la versión
    note.last_edited_by = user_id
    await db.commit()
    await db.refresh(note)
    return {"note": note}  # Retorna la nota en un diccionario


async def delete_note(db: AsyncSession, note_id: int, user_id: int):
    # Verifica si la nota existe y pertenece al usuario
    result = await db.execute(
        select(Note).where(Note.id == note_id, Note.owner_id == user_id)
    )
    note = result.scalar_one_or_none()
    if not note:
        return False  # Devuelve False si la nota no existe o no pertenece al usuario

    # Elimina la nota
    await db.delete(note)
    await db.commit()
    return True


async def share_note(db: AsyncSession, note_id: int, user_id: int, shared_with: list[int]):
    result = await db.execute(select(Note).where(Note.id == note_id, Note.owner_id == user_id))
    note = result.scalar_one_or_none()
    if not note:
        return None  # Nota no encontrada o no autorizada

    # Agregar usuarios al campo shared_with
    note.shared_with.extend(shared_with)
    note.shared_with = list(set(note.shared_with))  # Evita duplicados
    await db.commit()
    await db.refresh(note)
    return note