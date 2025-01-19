import axios from "axios";
import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE } from "./types";
import { startSessionTimer } from "../../../utils/sessionUtils";
import { AppDispatch } from "../../../store";

// Acción para iniciar sesión de usuario
export const loginUser =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    // Configuración de los encabezados para la solicitud
    const config = {
      headers: {
        "Content-Type": "application/json", // Indica que el contenido será JSON
      },
    };

    try {
      // Obtiene la URL de la API desde las variables de entorno
      const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;
      const body = { username, password }; // Cuerpo de la solicitud con las credenciales del usuario

      // Realiza la solicitud POST para iniciar sesión
      const res = await axios.post(`${apiUrl}/api/auth/login`, body, config);

      // Si el login es exitoso (status 200), procesa la respuesta
      if (res.status === 200) {
        const { token, username, token_type, tokenExpiration } = res.data;

        // Almacena el token y otros datos relevantes en el sessionStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("token_type", token_type);

        // Calcula el tiempo de expiración del token
        const expirationTime = new Date().getTime() + tokenExpiration * 60 * 1000; // Convertir minutos a milisegundos
        sessionStorage.setItem("tokenExpiration", expirationTime.toString());

        // Inicia un temporizador para la sesión basado en el tiempo de expiración
        startSessionTimer(expirationTime);

        // Despacha la acción de éxito con los datos del usuario
        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: res.data, // Contiene toda la información retornada por la API
        });
      }
    } catch (error: unknown) {
      console.error("Error en el login:", error);

      // Manejo del error y despacho de acción de fallo
      dispatch({
        type: LOGIN_USER_FAILURE,
        payload: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al iniciar sesión. Usuario o Contraseña incorrectos"
          : "Error desconocido al iniciar sesión",
      });
    }
  };





export const loginUserCookies =
  (username: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;
      const body = { username, password };

      // Configura axios para enviar cookies automáticamente
      const res = await axios.post(`${apiUrl}/api/auth/login_cookie`, body, {
        withCredentials: true,
      });
        localStorage.setItem("access_token", res.data.token);
        localStorage.setItem("username", res.data.username);
        
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: res.data,
      });
    } catch (error: unknown) {
      dispatch({
        type: LOGIN_USER_FAILURE,
        payload: axios.isAxiosError(error)
          ? error.response?.data?.message || "Error al iniciar sesión. Usuario o Contraseña incorrectos"
          : "Error desconocido al iniciar sesión",
      });
    }
  };
