/**
 * Limpia la sesión del usuario y redirige al login si no estamos ya en esa ruta.
 */
export const logout = () => {
  sessionStorage.clear(); // Limpio todos los datos almacenados en sessionStorage.
  const currentPath = window.location.pathname; // Obtengo la ruta actual.
  if (currentPath !== "/login") {
    window.location.href = "/login"; // Si no estoy en la página de login, redirijo allí.
  }
};


import axios from "axios";

export const logout_cookies = async () => {
  const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

  try {
    await axios.post(`${apiUrl}/api/auth/logout_cookie`, {}, { withCredentials: true });
    window.location.href = "/login";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};


/**
 * Configura un temporizador que cerrará la sesión del usuario cuando el token expire.
 * @param expirationTime - Tiempo de expiración en milisegundos (timestamp).
 */
export const startSessionTimer = (expirationTime: number) => {
  const timeRemaining = expirationTime - new Date().getTime(); // Calculo cuánto tiempo queda antes de que el token expire.
  if (timeRemaining > 0) {
    setTimeout(() => {
      logout(); // Cuando el tiempo se agote, cierro la sesión automáticamente.
    }, timeRemaining);
  } else {
    logout(); // Si el tiempo ya expiró, cierro la sesión inmediatamente.
  }
};

/**
 * Verifica si la sesión del usuario es válida al iniciar la aplicación.
 * Si el token ha expirado o no existe, cierra la sesión.
 * Si el token es válido, configura un temporizador para cerrarla cuando expire.
 */
export const checkSessionValidity = () => {
  //const tokenExpiration = sessionStorage.getItem("tokenExpiration"); // Recupero el tiempo de expiración del token almacenado en sessionStorage.
  //const expirationTime = tokenExpiration ? parseInt(tokenExpiration, 10) : 0; // Convierto el tiempo de expiración a un número.
  //if (!expirationTime || new Date().getTime() > expirationTime) {
  //  logout(); // Si no hay token o ya expiró, cierro la sesión.
  //} else {
  //  const timeRemaining = expirationTime - new Date().getTime(); // Calculo el tiempo restante.
  //  startSessionTimer(timeRemaining); // Configuro el temporizador para cerrar la sesión cuando corresponda.
  //}
  console.log("validacion de session por cookies");
};



import  {jwtDecode, JwtPayload } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convertir a segundos
    return decoded.exp ? decoded.exp < currentTime : true;
}


// Configuración base para Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_NOTE_API_URL, // URL base de la API
  withCredentials: true, // Habilita envío de cookies automáticamente
});


apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access_token");

  if (token && isTokenExpired(token)) {
      try {
          const response = await axios.post("/auth/refresh", {}, { withCredentials: true });
          const newToken = response.data.access_token;
          localStorage.setItem("access_token", newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          console.log("Token refreshed successfully");
      } catch (error) {
          console.error("Error refreshing token:", error);
          // Opcional: redirigir al usuario al login
      }
  }

  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
