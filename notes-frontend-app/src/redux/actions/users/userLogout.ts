// actions/users/user_logout.ts
import { LOGOUT_USER } from "./types";

export const logoutUser = () => {
  
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");
  return {
    type: LOGOUT_USER,
  };
};

