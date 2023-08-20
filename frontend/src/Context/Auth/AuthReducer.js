import Cookies from "js-cookie";

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return { ...state, token: action.payload, authStatus: "LoggedIn" };

    case "LOGOUT_USER":
      Cookies.set("token", undefined);
      return {
        ...state,
        token: undefined,
        authStatus: undefined,
      };

    case "UPDATE_USER":
      console.log(action.payload);
      return { ...state, token: action.payload };
    default:
      return new Error("Unhandled action type:" + action.type);
  }
};
