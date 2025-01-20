// actions/users/user_logout.ts
import { logout_cookies } from "../../../utils/sessionUtils";
import { LOGOUT_USER } from "./types";

export const logoutUser = () => {
  logout_cookies();
  //sessionStorage.removeItem("token");
  //sessionStorage.removeItem("username");
  localStorage.removeItem("access_token");

  return {
    type: LOGOUT_USER,
  };
};

