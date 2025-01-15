// utils/loadState.ts
export const loadState = () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const username = localStorage.getItem("username");
      const token_type = localStorage.getItem("token_type");
  
      if (access_token && username ) {
        return {
          auth: {
            access_token,
            token_type: token_type || "bearer", // Opcional: ajustar según el backend
            username,
            error: null,
          },
        };
      }
      return undefined;
    } catch (error) {
      console.error("Error al cargar el estado:", error);
      return undefined;
    }
  };
  