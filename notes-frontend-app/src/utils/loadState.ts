import { RootState } from "store";

export const loadState = (): Partial<RootState> | undefined => {
  try {
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    const token_type = sessionStorage.getItem("token_type");
    const tokenExpiration = sessionStorage.getItem("tokenExpiration");

    if (token && username) {
      return {
        auth: {
          token,
          token_type: token_type || "bearer", // Valor predeterminado para token_type
          username,
          error: null,
          tokenExpiration: tokenExpiration ? Number(tokenExpiration) : null,
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
