'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

export type CartItem = {
  id: string;
  name: string;
  variant?: string;
  image?: string;
  description?: string;
  quantity: number;
  price : number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
 getTotalPrice: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const COOKIE_KEY = 'rentroll_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from cookie on mount
  useEffect(() => {
    const saved = Cookies.get(COOKIE_KEY);
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        setItems(parsed);
      } catch (err) {
        console.error('Failed to parse cart from cookie', err);
      }
    }
  }, []);

  // Sync cart to cookie whenever it changes
  useEffect(() => {
    Cookies.set(COOKIE_KEY, JSON.stringify(items), { expires: 7 }); // 7 days expiry
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

const getTotalPrice = () => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

  const clearCart = () => setItems([]);

  const isInCart = (id: string) => items.some((item) => item.id === id);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, isInCart, getTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};