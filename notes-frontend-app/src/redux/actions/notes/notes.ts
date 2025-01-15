// actions/notes/notes.ts
import axios from "axios";

export const CREATE_NOTE_SUCCESS = "CREATE_NOTE_SUCCESS";

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
