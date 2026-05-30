"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  cartItemId: string; // generated as `productId_length`
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  length: string;
  quantity: number;
  isWholesale?: boolean;
  moqQuantity?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; image: string; category: string; is_wholesale?: boolean; moq_price?: number; moq_quantity?: number }, length: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("spur_wellness_cart");
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to LocalStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("spur_wellness_cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (
    product: { id: string; name: string; price: number; image: string; category: string; is_wholesale?: boolean; moq_price?: number; moq_quantity?: number },
    length: string,
    quantity: number
  ) => {
    setCartItems((prevItems) => {
      const cartItemId = `${product.id}_${length}`;
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      const finalPrice = product.is_wholesale && product.moq_price ? product.moq_price : product.price;

      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            productId: product.id,
            name: product.name,
            price: finalPrice,
            image: product.image,
            category: product.category,
            length,
            quantity,
            isWholesale: product.is_wholesale || false,
            moqQuantity: product.moq_quantity || 10,
          },
        ];
      }
    });
    // Auto open cart drawer when item is added
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.cartItemId === cartItemId);
      if (!item) return prevItems;

      const minQty = item.isWholesale ? (item.moqQuantity || 10) : 1;
      
      if (quantity < minQty) {
        alert(`Minimum order quantity for ${item.name} is ${minQty} units. To remove this wholesale item from your cart, please use the trash icon.`);
        return prevItems; // Don't change quantity
      }

      if (quantity <= 0) {
        return prevItems.filter((i) => i.cartItemId !== cartItemId);
      }

      return prevItems.map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i));
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
