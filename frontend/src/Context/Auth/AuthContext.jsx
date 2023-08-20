import { createContext, useEffect, useReducer } from "react";
import { AuthReducer } from "./AuthReducer";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const token = Cookies.get("token") || undefined;
const initialState = {
  authStatus: token && token !== "undefined" ? "LoggedIn" : "LoggedOut",
  token,
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    Cookies.set("token", state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
