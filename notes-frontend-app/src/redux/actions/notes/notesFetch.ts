// actions/notes/notes.ts

import { NoteInterface } from "../../../utils/types";
import { AppDispatch, RootState } from "../../../store";
import {
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
  NotesAction,
} from "./types";
import axios from "axios";

// Acción para iniciar la solicitud
export const fetchNotesRequest = () : NotesAction => ({
  type: FETCH_NOTES_REQUEST,
  payload: "", // Add an empty payload to match the expected type
});

// Acción para manejar el éxito de la solicitud
export const fetchNotesSuccess = (notes: NoteInterface[]): NotesAction=> ({
  type: FETCH_NOTES_SUCCESS,
  payload: notes,
});

// Acción para manejar errores en la solicitud
export const fetchNotesFailure = (error: string): NotesAction => ({
  type: FETCH_NOTES_FAILURE,
  payload: error,
});



export const fetchNotes = () => async (dispatch: AppDispatch, getState: () => RootState) => {
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(fetchNotesFailure(error.message || "Error al obtener las notas"));
    } else {
      dispatch(fetchNotesFailure("Error al obtener las notas"));
    }
  }
};
