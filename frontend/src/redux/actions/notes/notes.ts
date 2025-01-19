// actions/notes/notes.ts
import axios from "axios";
import { NoteInterface } from "../../../utils/types";
import { AppDispatch, RootState } from "../../../store";
import { apiClient } from "../../../utils/sessionUtils";
import {
  CREATE_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS,
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
  UPDATE_NOTE_CONFLICT,
  CLEAR_CONFLICT,
  UPDATE_NOTE_TAGS,
  UPDATE_NOTE_COLOR,
  NotesAction,
} from "./types";

export const createNoteSuccess = (note: NoteInterface): NotesAction => ({
  type: CREATE_NOTE_SUCCESS,
  payload: note,
});

export const createNote = (note: NoteInterface) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const token = state.auth.token;
  const token_type = state.auth.token_type;
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

  try {
    const response = await apiClient.post(`${apiUrl}/api/notes`, note, {
      headers: {
        Authorization: `${token_type} ${token}`,
      },
    });
    dispatch(createNoteSuccess(response.data));

    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      return { error: error.response.data.errors };
    } else {
      console.error("Error al crear la nota:", error);
      return { success: false };
    }
  }
};

// actions/notes/notes.ts
export const updateNote = (note: NoteInterface) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const token = state.auth.token;
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;
  try {
    const response = await apiClient.put(`${apiUrl}/api/notes/${note.id}`, note, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({
      type: UPDATE_NOTE_SUCCESS,
      payload: response.data,
    });
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      // Si hay un conflicto, despacha la acción de conflicto
      dispatch({
        type: UPDATE_NOTE_CONFLICT,
        payload: {
          serverVersion: error.response.data.detail.server_version,
          clientVersion: error.response.data.detail.client_version,
        },
      });

      return {
        conflict: true,
        note_id: error.response.data.detail.server_version.id,
      };
    } else if (axios.isAxiosError(error) && error.response?.status === 422) {
      return { error: error.response.data.errors };
    } else {
      console.error("Error al actualizaras la nota:", error);
      return { success: false };
    }
  }
};

export const clearConflict = () => ({
  type: CLEAR_CONFLICT,
});

export const deleteNote = (id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const token = state.auth.token;
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

  try {
    await apiClient.delete(`${apiUrl}/api/notes/${id}`, {
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
export const fetchNotesRequest = (): NotesAction => ({
  type: FETCH_NOTES_REQUEST,
  payload: "",
});

// Acción para manejar el éxito de la solicitud
export const fetchNotesSuccess = (notes: NoteInterface[]): NotesAction => ({
  type: FETCH_NOTES_SUCCESS,
  payload: notes,
});

// Acción para manejar errores en la solicitud
export const fetchNotesFailure = (error: string): NotesAction => ({
  type: FETCH_NOTES_FAILURE,
  payload: error,
});

// Acción asíncrona para obtener las notas desde el backend
export const fetchNotes = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const state = getState();
  const token = state.auth.token;
  const token_type = state.auth.token_type;
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

  dispatch(fetchNotesRequest());

  try {
    const response = await apiClient.get(`${apiUrl}/api/notes`, {
      headers: {
        Authorization: `${token_type} ${token}`,
      },
    });
    dispatch(fetchNotesSuccess(response.data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(
        fetchNotesFailure(error.message || "Error al obtener las notas")
      );
    } else {
      dispatch(fetchNotesFailure("Error al obtener las notas"));
    }
  }
};

export const updateNoteTags = (noteId: number, tags: string[]) => ({
  type: UPDATE_NOTE_TAGS,
  payload: { noteId, tags },
});

// Acción para actualizar color
export const updateNoteColor = (noteId: number, color: string) => ({
  type: UPDATE_NOTE_COLOR,
  payload: { noteId, color },
});
