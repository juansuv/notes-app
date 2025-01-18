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
  const tokenExpiration = sessionStorage.getItem("tokenExpiration"); // Recupero el tiempo de expiración del token almacenado en sessionStorage.
  const expirationTime = tokenExpiration ? parseInt(tokenExpiration, 10) : 0; // Convierto el tiempo de expiración a un número.
  if (!expirationTime || new Date().getTime() > expirationTime) {
    logout(); // Si no hay token o ya expiró, cierro la sesión.
  } else {
    const timeRemaining = expirationTime - new Date().getTime(); // Calculo el tiempo restante.
    startSessionTimer(timeRemaining); // Configuro el temporizador para cerrar la sesión cuando corresponda.
  }
};
