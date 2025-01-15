import axios from "axios";
import { LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE } from "./types";

export const loginUser =
  (username: string, password: string) => async (dispatch: any) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };


    try {
      const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;
      const body = { username: username, password: password };

      const res = await axios.post(
        `${apiUrl}/api/auth/login`,
        body,
        config
      );

      // Si el login es exitoso, despacha la acción de éxito con el token
      if (res.status === 200) {


        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("token_type", res.data.token_type);

        dispatch({
          type: LOGIN_USER_SUCCESS,
          payload: res.data, // Asegúrate de que tu API retorne el token en esta propiedad
        });
      }
    } catch (error: any) {
      console.error("Error en el login:", error);

      // Manejo del error y despacho de acción de fallo
      dispatch({
        type: LOGIN_USER_FAILURE,
        payload: error.response?.data?.message || "Error al iniciar sesión. Usuario o Contraseña incorrectos",
      });
    }
  };
