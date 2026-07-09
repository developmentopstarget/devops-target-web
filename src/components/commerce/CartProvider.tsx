"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { Product, StockStatus } from "@/data/products";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand?: string;
  spec: string;
  unitPrice: number;
  compareAt?: number;
  image?: string;
  quantity: number;
  maxStock: number;
  stock: StockStatus;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CART_STORAGE_KEY = "devops-target:cart";

export function maxQuantityForStock(stock: StockStatus): number {
  if (stock === "out-of-stock") return 0;
  if (stock === "low-stock") return 5;
  return 10;
}

function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CartItem).productId === "string" &&
    typeof (value as CartItem).quantity === "number"
  );
}

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage can fail (quota exceeded, private browsing) — cart still works for the session.
  }
}

// Module-level external store: shared across every CartProvider instance
// (there's only ever one, mounted in the root layout), read via
// useSyncExternalStore so localStorage hydration never causes a mismatch
// between the server-rendered (always-empty) cart and the client's first paint.
let cartState: CartItem[] = [];
let hasHydrated = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function setCartState(updater: (current: CartItem[]) => CartItem[]) {
  cartState = updater(cartState);
  writeToStorage(cartState);
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  if (!hasHydrated && typeof window !== "undefined") {
    hasHydrated = true;
    cartState = readFromStorage();
  }
  return cartState;
}

function getServerSnapshot(): CartItem[] {
  return [];
}

function addItem(product: Product, quantity = 1) {
  setCartState((current) => {
    const max = maxQuantityForStock(product.stock);
    const existingIndex = current.findIndex((item) => item.productId === product.id);

    if (existingIndex !== -1) {
      return current.map((item, i) =>
        i === existingIndex
          ? { ...item, quantity: Math.min(item.quantity + quantity, Math.max(max, 1)), maxStock: max, stock: product.stock }
          : item,
      );
    }

    const newItem: CartItem = {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      spec: product.spec,
      unitPrice: product.price,
      compareAt: product.compareAtPrice,
      quantity: Math.min(Math.max(quantity, 1), Math.max(max, 1)),
      maxStock: max,
      stock: product.stock,
    };
    return [...current, newItem];
  });
}

function updateQty(productId: string, quantity: number) {
  setCartState((current) =>
    current.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, Math.min(quantity, Math.max(item.maxStock, 1))) }
        : item,
    ),
  );
}

function removeItem(productId: string) {
  setCartState((current) => current.filter((item) => item.productId !== productId));
}

function clear() {
  setCartState(() => []);
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, addItem, updateQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
