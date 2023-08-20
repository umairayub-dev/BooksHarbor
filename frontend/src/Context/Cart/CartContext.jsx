import { createContext, useEffect, useReducer } from "react";
import { cartReducer } from "./CartReducer";

export const CartContext = createContext();

const cartLocalStorage = localStorage.getItem("cart");
const initialState = {
  cart: JSON.parse(cartLocalStorage) || [],
};

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
