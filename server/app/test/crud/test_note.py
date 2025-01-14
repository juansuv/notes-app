import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.note import create_note, get_user_notes, update_note, delete_note
from app.schemas.note import NoteCreate, NoteUpdate



@pytest.mark.asyncio
async def test_create_note_crud(async_session: AsyncSession, setup_notes_data):
    note = NoteCreate(title="New Note", content="This is a test note", shared_with=[])
    created_note = await create_note(async_session, note, setup_notes_data.id)
    assert created_note.title == "New Note"
    assert created_note.content == "This is a test note"

@pytest.mark.asyncio
async def test_get_user_notes_crud(async_session: AsyncSession, setup_notes_data):
    notes = await get_user_notes(async_session, setup_notes_data.id)
    assert len(notes) > 0
    assert notes[0].owner_id == setup_notes_data.id

