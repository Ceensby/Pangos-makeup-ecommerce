import React, { createContext, useState, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const add = (product) => {
    if (!product || !product.id) {
      console.error("Invalid product", product);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);

      if (existing) {
        return prev.map((it) =>
          it.id === product.id
            ? { ...it, quantity: (it.quantity ?? 1) + 1 }
            : it
        );
      }

      let price = product.price;
      if (typeof price === "string") price = parseFloat(price);
      if (isNaN(price)) price = 0;

      return [...prev, { ...product, price, quantity: 1 }];
    });
  };

  const decrement = (id) => {
    setItems((prev) =>
      prev
        .map((it) =>
          it.id === id
            ? { ...it, quantity: (it.quantity ?? 1) - 1 }
            : it
        )
        .filter((it) => (it.quantity ?? 0) > 0)
    );
  };

  const remove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, decrement, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
