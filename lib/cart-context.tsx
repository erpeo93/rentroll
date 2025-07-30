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
  adjusted?: boolean;
  unavailable?: boolean;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number, flags?: Partial<Pick<CartItem, 'adjusted' | 'unavailable'>>) => void;
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

const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
  const quantity = newItem.quantity ?? 1;  // default to 1

  setItems((prev) => {
    const existingItem = prev.find((item) => item.id === newItem.id);

    if (existingItem) {
      return prev.map((item) =>
        item.id === newItem.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              adjusted: newItem.adjusted ?? item.adjusted,
              unavailable: newItem.unavailable ?? item.unavailable,
            }
          : item
      );
    }

    // Add quantity to new item explicitly
    return [...prev, { ...newItem, quantity }];
  });
};


  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

const updateQuantity = (
  id: string,
  quantity: number,
  flags?: Partial<Pick<CartItem, 'adjusted' | 'unavailable'>>
) => {
  setItems((prev) =>
    prev
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              ...(flags ?? {}),
            }
          : item
      )
      .filter((item) => item.quantity > 0)
  );
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