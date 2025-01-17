export const logout = () => {
  sessionStorage.clear(); // Limpia el sessionStorage
  const currentPath = window.location.pathname;
  if (currentPath !== "/login") {
    window.location.href = "/login"; // Redirige al login
  }
};
export const startSessionTimer = (expirationTime: number) => {
  const timeRemaining = expirationTime - new Date().getTime(); // Diferencia en milisegundos
  debugger;
  if (timeRemaining > 0) {
    setTimeout(() => {
      logout(); // Cierra sesión cuando el token expire
    }, timeRemaining);
  } else {
    logout(); // Si ya expiró, cierra sesión inmediatamente
  }
};

// Verificar validez de la sesión al iniciar la app
export const checkSessionValidity = () => {
  debugger;
  const tokenExpiration = sessionStorage.getItem("tokenExpiration");
  const expirationTime = tokenExpiration ? parseInt(tokenExpiration, 10) : 0;
  if (!expirationTime || new Date().getTime() > expirationTime) {
    logout(); // Si no hay token o ya expiró
  } else {
    const timeRemaining = expirationTime - new Date().getTime();
    startSessionTimer(timeRemaining); // Configura el temporizador
  }
};
