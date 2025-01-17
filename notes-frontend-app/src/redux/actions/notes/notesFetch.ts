// actions/notes/notes.ts
import {
    FETCH_NOTES_REQUEST,
    FETCH_NOTES_SUCCESS,
    FETCH_NOTES_FAILURE,
  } from "./types";
  import axios from "axios";
  
  // Acción para iniciar la solicitud
  export const fetchNotesRequest = () => ({
    type: FETCH_NOTES_REQUEST,
  });
  
  // Acción para manejar el éxito de la solicitud
  export const fetchNotesSuccess = (notes: any[]) => ({
    type: FETCH_NOTES_SUCCESS,
    payload: notes,
  });
  
  // Acción para manejar errores en la solicitud
  export const fetchNotesFailure = (error: string) => ({
    type: FETCH_NOTES_FAILURE,
    payload: error,
  });
  
  // Acción asíncrona para obtener las notas desde el backend
  export const fetchNotes = () => async (dispatch: any, getState: any) => {
    const state = getState();
    const token = state.auth.token;
    const token_type = state.auth.token_type;
    const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

    dispatch(fetchNotesRequest());
  
    try {
        
      const response = await axios.get(`${apiUrl}/api/notes`, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      dispatch(fetchNotesSuccess(response.data));
    } catch (error: any) {
      dispatch(fetchNotesFailure(error.message || "Error al obtener las notas"));
    }
  };
  