import React, { createContext, useState, useContext } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Add product to cart or increment quantity if already exists
  const add = (product) => {
    if (!product || !product.id) {
      console.error("Invalid product", product);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);

      // If product already in cart, increase quantity
      if (existing) {
        return prev.map((it) =>
          it.id === product.id
            ? { ...it, quantity: (it.quantity ?? 1) + 1 }
            : it
        );
      }

      // Ensure price is a valid number
      let price = product.price;
      if (typeof price === "string") price = parseFloat(price);
      if (isNaN(price)) price = 0;

      // Add new product with quantity 1
      return [...prev, { ...product, price, quantity: 1 }];
    });
  };

  // Decrease quantity by 1, remove if quantity becomes 0
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

  // Remove product from cart completely
  const remove = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Clear all items from cart
  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, decrement, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to access cart in any component
export const useCart = () => useContext(CartContext);
