import { createContext, useEffect, useReducer } from "react";
import { AuthReducer } from "./AuthReducer";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

const token = Cookies.get("token") || undefined;
const initialState = {
  authStatus: token && token !== "undefined" ? "LoggedIn" : "LoggedOut",
  token,
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    const verifyToken = async (token) => {
      try {
        const response = await axios.post('/api/v1/verify-token', { token });
        return response.data.valid;
      } catch (error) {
        console.log(error)
      }
    }
    verifyToken(state.token).then((valid) => {
      if (!valid) {
        dispatch('LOGOUT_USER')
      }
    })
    
  }, [])
  useEffect(() => {
    Cookies.set("token", state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
