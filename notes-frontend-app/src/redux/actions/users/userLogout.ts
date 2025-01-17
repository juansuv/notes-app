// actions/users/user_logout.ts
import { LOGOUT_USER } from "./types";

export const logoutUser = () => {
  
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");
  return {
    type: LOGOUT_USER,
  };
};

