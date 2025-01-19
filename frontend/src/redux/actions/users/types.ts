// Definición de constantes para las acciones relacionadas con usuarios
export const LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS";
export const LOGIN_USER_FAILURE = "LOGIN_USER_FAILURE";
export const LOGOUT_USER = "LOGOUT_USER";

// Definición del tipo de datos de un usuario
export interface UserInterface {
  id: string;
  name: string;
  email: string;
  token?: string; // El token es opcional para manejar autenticación
}

// Definición de los tipos de acciones para usuarios
export type UserAction =
  | { type: "FETCH_USER_REQUEST" }
  | { type: "FETCH_USER_SUCCESS"; payload: UserInterface }
  | { type: "FETCH_USER_FAILURE"; payload: string }
  | { type: "CREATE_USER_SUCCESS"; payload: UserInterface }
  | { type: "UPDATE_USER_SUCCESS"; payload: UserInterface }
  | { type: "DELETE_USER_SUCCESS"; payload: string } // Usamos el ID del usuario
  | {
      type: typeof LOGIN_USER_SUCCESS;
      payload: {
        token: string;
        token_type: string;
        username: string;
        tokenExpiration: number; // O Date si manejas fechas
      };
    }
  | { type: typeof LOGIN_USER_FAILURE; payload: string }
  | { type: typeof LOGOUT_USER };

// Comentarios adicionales:
// - `UserInterface` permite estructurar los datos esperados para un usuario.
// - Las constantes aseguran consistencia en los tipos de acción.
// - Los tipos de acción cubren todas las operaciones necesarias (CRUD y autenticación).
