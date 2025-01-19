import { RootState } from "store";

export const loadState = (): Partial<RootState> | undefined => {
  try {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const tokenExpiration = sessionStorage.getItem("tokenExpiration");
    if (token && username) {
      return {
        auth: {
          token,
          username,
          error: null,
          tokenExpiration: tokenExpiration ? Number(tokenExpiration) : null,
          success: true,
          token_type: null
        },
        notes: {
          loading: false,
          notes: [], // Lista vacía como valor predeterminado
          error: null,
          conflict: null,
        },
      };
    }

    // Retorna undefined si no hay datos válidos
    return undefined;
  } catch (error) {
    console.error("Error al cargar el estado:", error);
    return undefined;
  }
};
