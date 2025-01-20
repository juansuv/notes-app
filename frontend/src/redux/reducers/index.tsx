import { combineReducers } from "redux";
import authReducer from "./userLoginReducer";
import notesReducer from "./notes/notesReducer";

// Combino todos los reducers para formar el rootReducer
const rootReducer = combineReducers({
  auth: authReducer, // Reducer para la parte de autenticación del estado
  notes: notesReducer, // Reducer para la parte de las notas del estado
});

export default rootReducer;
