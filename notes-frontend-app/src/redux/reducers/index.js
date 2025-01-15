import { combineReducers } from 'redux';
import authReducer from './userLoginReducer';
import notesReducer from './notes/getNotesReducer';


export default combineReducers({
    auth: authReducer,
    notes: notesReducer,
});  