export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.cart.findIndex(
        (item) => item._id === action.payload._id
      );

      if (existingItemIndex !== -1) {
        const updatedCart = state.cart.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
            };
          }
          return item;
        });

        return {
          ...state,
          cart: updatedCart,
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, action.payload],
        };
      }

    case "UPDATE_QUANTITY":
      const { itemId, newQuantity } = action.payload;
      console.log(action.payload);
      const updatedCart = state.cart.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }
        return item;
      });

      return {
        ...state,
        cart: updatedCart,
      };

    case "REMOVE_FROM_CART":
      const itemRemoved = state.cart.filter(
        (item) => item._id !== action.payload.itemId
      );

      return {
        ...state,
        cart: itemRemoved,
      };

    case "EMPTY_CART":
      return { cart: [] };

    default:
      return state;
  }
};
