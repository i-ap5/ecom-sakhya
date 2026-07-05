"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { HttpTypes } from "@medusajs/types";
import {
  getOrCreateCart,
  addLineItem,
  updateLineItemQuantity,
  removeLineItem,
  addPromotionCode,
  removePromotionCode,
} from "@/lib/medusa/cart";

interface CartContextType {
  cart: HttpTypes.StoreCart | null;
  cartItems: HttpTypes.StoreCartLineItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: (code: string) => Promise<void>;
  cartCount: number;
  cartTotal: number;
  currencyCode: string;
  loading: boolean;
  setCart: (cart: HttpTypes.StoreCart) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOrCreateCart()
      .then(setCart)
      .catch((error) => console.error("Failed to load cart", error));
  }, []);

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      setLoading(true);
      try {
        const activeCart = cart ?? (await getOrCreateCart());
        const updated = await addLineItem(activeCart.id, variantId, quantity);
        setCart(updated);
        setCartOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return;
      setLoading(true);
      try {
        if (quantity <= 0) {
          await removeLineItem(cart.id, lineItemId);
          setCart({ ...cart, items: cart.items?.filter((i) => i.id !== lineItemId) });
          return;
        }
        const updated = await updateLineItemQuantity(cart.id, lineItemId, quantity);
        setCart(updated);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!cart) return;
      setLoading(true);
      try {
        await removeLineItem(cart.id, lineItemId);
        setCart({ ...cart, items: cart.items?.filter((i) => i.id !== lineItemId) });
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const applyPromoCode = useCallback(
    async (code: string) => {
      if (!cart) return false;
      setLoading(true);
      try {
        const updated = await addPromotionCode(cart.id, code);
        setCart(updated);
        return (updated.promotions ?? []).some(
          (p) => p.code?.toLowerCase() === code.toLowerCase()
        );
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const removePromoCode = useCallback(
    async (code: string) => {
      if (!cart) return;
      setLoading(true);
      try {
        const updated = await removePromotionCode(cart.id, code);
        setCart(updated);
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  const cartItems = cart?.items ?? [];
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart?.total ?? 0;
  const currencyCode = cart?.currency_code ?? "inr";

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        isCartOpen,
        setCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyPromoCode,
        removePromoCode,
        cartCount,
        cartTotal,
        currencyCode,
        loading,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
