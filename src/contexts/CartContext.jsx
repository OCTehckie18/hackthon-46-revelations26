import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "../hooks/useLocalStorage";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage("cart", {
    items: [],
    vendorId: null,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item, vendorId) => {
    setCart((prev) => {
      // If adding from different vendor, clear cart
      if (prev.vendorId && prev.vendorId !== vendorId) {
        const confirm = window.confirm(
          "Adding items from a different vendor will clear your current cart. Continue?",
        );
        if (!confirm) return prev;

        const newCart = {
          vendorId,
          items: [{ ...item, quantity: 1 }],
        };
        toast.success(`${item.name} added to cart`);
        return newCart;
      }

      // Check if item already exists
      const existingItemIndex = prev.items.findIndex((i) => i.id === item.id);

      if (existingItemIndex >= 0) {
        // Update quantity
        const updatedItems = [...prev.items];
        updatedItems[existingItemIndex].quantity += 1;
        toast.success(`${item.name} quantity updated`);
        return {
          ...prev,
          items: updatedItems,
        };
      } else {
        // Add new item
        toast.success(`${item.name} added to cart`);
        return {
          vendorId,
          items: [...prev.items, { ...item, quantity: 1 }],
        };
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    }));
  };

  const clearCart = () => {
    setCart({ items: [], vendorId: null });
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
