// reducers/notesReducer.ts
import {
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
  CREATE_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS
} from "../../actions/notes/types";

interface NotesState {
  loading: boolean;
  notes: any[];
  error: string | null;
}

const initialState: NotesState = {
  loading: false,
  notes: [],
  error: null,
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
    default:
      return state;
    
      case UPDATE_NOTE_SUCCESS:
        return {
          ...state,
          notes: state.notes
            .map((note) => (note.id === action.payload.id ? action.payload : note)) // Sustituye la nota
        };
      
      case DELETE_NOTE_SUCCESS:
        return {
          ...state,
          notes: state.notes.filter((note) => note.id !== action.payload),
        };
      
  }
};

export default notesReducer;
