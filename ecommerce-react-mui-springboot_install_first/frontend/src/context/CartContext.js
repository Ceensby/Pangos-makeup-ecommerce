import React, { createContext, useState, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Add or increment quantity
  const add = (product) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id
            ? { ...it, quantity: (it.quantity || 1) + 1 }
            : it
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Decrease quantity by 1 (if quantity becomes 0, remove)
  const decrement = (id) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, quantity: (it.quantity || 1) - 1 } : it
        )
        .filter((it) => (it.quantity || 1) > 0)
    );
  };

  // Remove all of a product
  const remove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clear = () => setItems([]);

  const value = { items, add, decrement, remove, clear };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Optional convenience hook
export const useCart = () => useContext(CartContext);
