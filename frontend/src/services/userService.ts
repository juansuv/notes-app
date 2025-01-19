import axios from "axios";

/**
 * Registra un nuevo usuario en la API.
 * @param name - Nombre de usuario para el registro.
 * @param password - Contraseña del usuario.
 * @returns Un objeto con el resultado de la operación (`success` y `data` o `message` en caso de error).
 */
export const registerUser = async (name: string, password: string) => {
  // Configuración de los encabezados para la solicitud HTTP.
  const config = {
    headers: {
      "Content-Type": "application/json", // Especifico que el cuerpo de la solicitud será JSON.
    },
  };

  // Cuerpo de la solicitud con los datos del usuario.
  const body = { username: name, password: password };

  try {
    // Obtengo la URL base de la API desde las variables de entorno.
    const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;

    // Envío una solicitud POST a la API para registrar al usuario.
    const res = await axios.post(`${apiUrl}/api/auth/register`, body, config);

    // Verifico el estado de la respuesta.
    if (res.status === 200) {
      // Registro exitoso.
      return { success: true, data: res.data };
    } else {
      // En caso de un estado distinto a 200, considero que falló.
      return { success: false, data: res.data };
    }
  } catch (error: unknown) {
    // Manejo de errores.

    // Caso: el usuario ya está registrado (error 409).
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return {
        success: false,
        message: "El usuario ya está registrado.", // Devuelvo un mensaje claro al cliente.
      };
    }

    // Caso: error de validación (error 422).
    else if (axios.isAxiosError(error) && error.response?.status === 422) {
      return {
        success: false,
        // Extraigo el mensaje del error y lo formateo.
        message: `${error.response.data.errors[0].error.replace(/^Value error, /, "")}`,
      };
    }

    // Caso general: otros errores no controlados.
    return {
      success: false,
      // Devuelvo el mensaje del error si está disponible o un mensaje genérico.
      message:
        (axios.isAxiosError(error) && error.response?.data) || "Error al registrar usuario",
    };
  }
};
