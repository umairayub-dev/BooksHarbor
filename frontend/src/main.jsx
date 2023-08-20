import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContextProvider } from "./Context/Toast/ToastContext.jsx";
import { AuthContextProvider } from "./Context/Auth/AuthContext.jsx";
import { CartContextProvider } from "./Context/Cart/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <CartContextProvider>
        <ToastContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastContextProvider>
      </CartContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
