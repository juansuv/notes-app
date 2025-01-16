import { combineReducers } from 'redux';
import authReducer from './userLoginReducer';
import notesReducer from './notes/notesReducer';


export default combineReducers({
    auth: authReducer,
    notes: notesReducer,
});  