// utils/loadState.ts
export const loadState = () => {
    try {
      const token = sessionStorage.getItem("token");
      const username = sessionStorage.getItem("username");
      const token_type = sessionStorage.getItem("token_type");
      const tokenExpiration = sessionStorage.getItem("tokenExpiration"); // Añadir tokenExpiration
  
      if (token && username ) {
        return {
          auth: {
            token,
            token_type: token_type || "bearer", // Opcional: ajustar según el backend
            username,
            error: null,
            tokenExpiration: tokenExpiration ? Number(tokenExpiration) : null, // Añadir tokenExpiration

          },
        };
      }
      return undefined;
    } catch (error) {
      console.error("Error al cargar el estado:", error);
      return undefined;
    }
  };
  