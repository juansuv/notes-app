import { arch } from "os";
import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER, UserAction } from "../actions/users/types";

interface AuthState {
  token: string | null;
  token_type: string | null;
  error: string | null;
  username: string | null;
  tokenExpiration: number | null;
  success: boolean;
}

const initialState: AuthState = {
  token: null,
  token_type: null,
  error: null,
  username: null,
  tokenExpiration: null,
  success: false,
};

const authReducer = (state = initialState, action: UserAction): AuthState => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        token: null, // Guarda el token en el estado
        token_type: null, // Guarda el token en el estado
        error: null,
        username: action.payload.username,
        tokenExpiration: action.payload.tokenExpiration,
        success: true,
      };

    case LOGIN_USER_FAILURE:
      return {
        ...state,
        token: null, // limpiar el token en caso de error
        token_type: null,
        username: null,
        tokenExpiration: null,  
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
