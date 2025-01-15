// actions/users/user_logout.ts
import { LOGOUT_USER } from "./types";

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};

