// reducers/notesReducer.ts
import {
    FETCH_NOTES_REQUEST,
    FETCH_NOTES_SUCCESS,
    FETCH_NOTES_FAILURE,
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
  
      default:
        return state;
    }
  };
  
  export default notesReducer;
  