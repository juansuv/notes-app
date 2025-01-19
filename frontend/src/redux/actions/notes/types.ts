// actions/notes/types.ts
export const FETCH_NOTES_REQUEST = "FETCH_NOTES_REQUEST";
export const FETCH_NOTES_SUCCESS = "FETCH_NOTES_SUCCESS";
export const FETCH_NOTES_FAILURE = "FETCH_NOTES_FAILURE";
export const CREATE_NOTE_SUCCESS = "CREATE_NOTE_SUCCESS";
export const UPDATE_NOTE_SUCCESS = "UPDATE_NOTE_SUCCESS";
export const DELETE_NOTE_SUCCESS = "DELETE_NOTE_SUCCESS";
export const UPDATE_NOTE_CONFLICT = "UPDATE_NOTE_CONFLICT";
export const CLEAR_CONFLICT = "CLEAR_CONFLICT";
export const UPDATE_NOTE_TAGS = "UPDATE_NOTE_TAGS";
export const UPDATE_NOTE_COLOR = "UPDATE_NOTE_COLOR";

import { NoteInterface } from "../../../utils/types";

export type NotesAction =
  | { type: typeof FETCH_NOTES_REQUEST; payload: string }
  | { type: typeof FETCH_NOTES_SUCCESS; payload: NoteInterface[] }
  | { type: typeof FETCH_NOTES_FAILURE; payload: string }
  | { type: typeof CREATE_NOTE_SUCCESS; payload: NoteInterface }
  | { type: typeof UPDATE_NOTE_SUCCESS; payload: NoteInterface }
  | { type: typeof DELETE_NOTE_SUCCESS; payload: number }
  | { type: typeof UPDATE_NOTE_CONFLICT; payload: { serverVersion: NoteInterface; clientVersion: NoteInterface } }
  | { type: typeof CLEAR_CONFLICT }
  | { type: typeof UPDATE_NOTE_TAGS; payload: { noteId: string; tags: string[] } }
  | { type: typeof UPDATE_NOTE_COLOR; payload: { noteId: string; color: string } };