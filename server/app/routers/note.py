from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.note import create_note, get_user_notes, get_note_by_id, get_all_notes
from app.schemas.note import NoteCreate, NoteResponse
from app.dependencies import get_db, get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/notes", response_model=NoteResponse)
async def create_new_note(note: NoteCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await create_note(db, note, current_user.id)

@router.get("/notes", response_model=list[NoteResponse])
async def list_user_notes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_user_notes(db, current_user.id)

@router.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    note = await get_note_by_id(db, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.get("/all_notes", response_model=list[NoteResponse])
async def list_all_notes(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return await get_all_notes(db)