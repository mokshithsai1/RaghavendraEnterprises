import {jsx as _jsx} from "react/jsx-runtime";import { createContext, useContext, useState, useEffect } from "react";



















const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.product_id === newItem.product_id);
      if (existing) {
        return prev.map(i =>
          i.product_id === newItem.product_id
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (product_id) => {
    setItems(prev => prev.filter(i => i.product_id !== product_id));
  };

  const updateQuantity = (product_id, quantity) => {
    if (quantity <= 0) {
      removeItem(product_id);
      return;
    }
    setItems(prev =>
      prev.map(i => i.product_id === product_id ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    _jsx(CartContext.Provider, { value: { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }, children: 
      children
    })
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
