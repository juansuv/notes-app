import axios from "axios";

export const registerUser = async (name: string, password: string) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = { username: name, password: password };

  try {
    const apiUrl = import.meta.env.VITE_APP_NOTE_API_URL;
    console.log(apiUrl);
    console.log(name);
    console.log(password);
    const res = await axios.post(`${apiUrl}/api/auth/register`, body, config);

    if (res.status === 200) {
      return { success: true, data: res.data };
    } else {
      return { success: false, data: res.data };
    }
  } catch (error: any) {
    console.log("Register submitted", error);

    if (error.response?.status === 409) {
      return {
        success: false,
        message: "El usuario ya está registrado.",
      };
    }

    return {
      success: false,
      message: error.response?.data || "Error al registrar usuario",
    };
  }
};
