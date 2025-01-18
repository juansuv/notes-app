// reducers/notesReducer.ts
import { NoteInterface } from "../../../utils/types";
import { NotesAction } from "../../actions/notes/types";

import {
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
  CREATE_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS,
  UPDATE_NOTE_CONFLICT,
  CLEAR_CONFLICT,
  UPDATE_NOTE_TAGS,
  UPDATE_NOTE_COLOR,
} from "../../actions/notes/types";

interface NotesState {
  loading: boolean;
  notes: NoteInterface[];
  error: string | null;
  conflict: { serverVersion: NoteInterface; clientVersion: NoteInterface } | null; // Almacena las versiones en conflicto
}

const initialState: NotesState = {
  loading: false,
  notes: [],
  error: null,
  conflict: JSON.parse(localStorage.getItem("conflict") || '{}'), // Almacena las versiones en conflicto
};


const notesReducer = (state = initialState, action: NotesAction): NotesState => {
  switch (action.type) {
    case FETCH_NOTES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_NOTES_SUCCESS:
      return {
        ...state,
        loading: false,
        notes: action.payload,
      };

    case FETCH_NOTES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_NOTE_SUCCESS:
      return {
        ...state,
        notes: [...state.notes, action.payload], // Agrega la nueva nota al array
      };

    case UPDATE_NOTE_SUCCESS:
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
        conflict: null, // Sustituye la nota
      };

    case DELETE_NOTE_SUCCESS:
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    case UPDATE_NOTE_CONFLICT:
      localStorage.setItem("conflict", JSON.stringify(action.payload));
      return {
        ...state,
        conflict: action.payload, // Guarda las versiones en conflicto
      };
    case CLEAR_CONFLICT:
      localStorage.removeItem("conflict");
      return {
        ...state,
        conflict: null, // Limpiamos el conflicto manualmente
      };

    case UPDATE_NOTE_TAGS:
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === parseInt(action.payload.noteId)
            ? { ...note, tags: action.payload.tags }
            : note
        ),
      };
    case UPDATE_NOTE_COLOR:
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === parseInt(action.payload.noteId)
            ? { ...note, color: action.payload.color }
            : note
        ),
      };

    default:
      return state;
  }
};

export default notesReducer;
