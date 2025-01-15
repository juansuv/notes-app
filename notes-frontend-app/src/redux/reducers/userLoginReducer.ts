import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER } from "../actions/users/types";

interface AuthState {
  access_token: string | null;
  token_type: string | null;
  error: string | null;
  username: string | null;
}

const initialState: AuthState = {
  access_token: null,
  token_type: null,
  error: null,
  username: null,
};

const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        access_token: action.payload.access_token, // Guarda el access_token en el estado
        token_type: action.payload.token_type, // Guarda el access_token en el estado
        error: null,
        username: action.payload.username,
      };

    case LOGIN_USER_FAILURE:
      return {
        ...state,
        access_token: null, // limpiar el access_token en caso de error
        token_type: null,
        username: null,  
        error: action.payload, // Guarda el mensaje de error
      };

    case LOGOUT_USER: // Caso para manejar el logout
      return {
        ...initialState
      };

    default:
      return state;
  }
};

export default authReducer;
