// actions/notes/notes.ts
import axios from "axios";

import {
  CREATE_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS,
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
} from "./types";



export const createNoteSuccess = (note) => ({
  type: CREATE_NOTE_SUCCESS,
  payload: note,
});

export const createNote = (note) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.access_token;
  const token_type = state.auth.token_type;
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

  try {
    const response = await axios.post(`${apiUrl}/api/notes`, note, {
      headers: {
        Authorization: `${token_type} ${token}`,
      },
    });
    dispatch(createNoteSuccess(response.data));
  } catch (error) {
    console.error("Error al crear la nota:", error);
  }
};

// actions/notes/notes.ts
export const updateNote = (note) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.access_token;
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

  console.log("note", note);
  try {
    console.log(apiUrl);
    const response = await axios.put(`${apiUrl}/api/notes/${note.id}`, note, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response.data);
    dispatch({
      type: UPDATE_NOTE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    debugger;
    console.error("Error al actualizar la nota:", error);
  }
};

export const deleteNote = (id) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.access_token;
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

  try {
    await axios.delete(`${apiUrl}/api/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: DELETE_NOTE_SUCCESS,
      payload: id,
    });
  } catch (error) {
    console.error("Error al eliminar la nota:", error);
  }
};

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
  const token = state.auth.access_token;
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
