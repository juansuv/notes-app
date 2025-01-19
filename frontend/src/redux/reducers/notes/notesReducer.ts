// Reducer para manejar el estado de las notas
import { NotesState } from "../../../utils/types";
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

// Estado inicial del reducer
const initialState: NotesState = {
  loading: false,
  notes: [],
  error: null,
  conflict: JSON.parse(localStorage.getItem("conflict") || "null"), // Carga el conflicto desde el localStorage si existe
};

// Reducer principal para manejar diferentes acciones
const notesReducer = (state = initialState, action: NotesAction): NotesState => {
  switch (action.type) {
    case FETCH_NOTES_REQUEST:
      // Inicia la carga de notas
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_NOTES_SUCCESS:
      // Carga exitosa de notas
      return {
        ...state,
        loading: false,
        notes: action.payload, // Reemplaza las notas con las recuperadas
      };

    case FETCH_NOTES_FAILURE:
      // Manejo de error al cargar notas
      return {
        ...state,
        loading: false,
        error: action.payload, // Almacena el mensaje de error
      };

    case CREATE_NOTE_SUCCESS:
      // Agrega una nueva nota al estado
      return {
        ...state,
        notes: [...state.notes, action.payload], // Añade la nueva nota al final
      };

    case UPDATE_NOTE_SUCCESS:
      // Actualiza una nota existente
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note // Actualiza la nota correspondiente
        ),
        conflict: null, // Limpia cualquier conflicto existente
      };

    case DELETE_NOTE_SUCCESS:
      // Elimina una nota por su ID
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload), // Filtra las notas que no coinciden con el ID
      };

    case UPDATE_NOTE_CONFLICT:
      // Maneja un conflicto de actualización y lo almacena
      localStorage.setItem("conflict", JSON.stringify(action.payload));
      return {
        ...state,
        conflict: action.payload, // Almacena las versiones en conflicto
      };

    case CLEAR_CONFLICT:
      // Limpia los datos de conflicto
      localStorage.removeItem("conflict");
      return {
        ...state,
        conflict: null, // Resetea el conflicto
      };

    case UPDATE_NOTE_TAGS:
      // Actualiza las etiquetas de una nota
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === parseInt(action.payload.noteId)
            ? { ...note, tags: action.payload.tags } // Actualiza las etiquetas
            : note
        ),
      };

    case UPDATE_NOTE_COLOR:
      // Actualiza el color de una nota
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === parseInt(action.payload.noteId)
            ? { ...note, color: action.payload.color } // Actualiza el color
            : note
        ),
      };

    default:
      // Retorna el estado actual si no coincide ninguna acción
      return state;
  }
};

export default notesReducer;
