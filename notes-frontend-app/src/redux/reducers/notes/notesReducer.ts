// reducers/notesReducer.ts
import {
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
  CREATE_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS,
  UPDATE_NOTE_CONFLICT,
  CLEAR_CONFLICT,
} from "../../actions/notes/types";

interface NotesState {
  loading: boolean;
  notes: any[];
  error: string | null;
  conflict: null; // Almacena las versiones en conflicto
}

const initialState: NotesState = {
  loading: false,
  notes: [],
  error: null,
  conflict: JSON.parse(localStorage.getItem("conflict")) || {}, // Almacena las versiones en conflicto
};

const notesReducer = (state = initialState, action: any): NotesState => {
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
      console.log("conflict save in locale storage", action.payload);
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

    default:
      return state;
  }
};

export default notesReducer;
