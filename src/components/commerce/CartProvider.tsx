"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface CartContextValue {
  count: number;
  addItem: (quantity?: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const addItem = (quantity = 1) => setCount((current) => current + quantity);

  return <CartContext.Provider value={{ count, addItem }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
