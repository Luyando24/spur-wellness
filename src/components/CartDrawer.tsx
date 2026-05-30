"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { useCurrency } from "./CurrencyContext";
import { useStoreSettings } from "./StoreSettingsContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();
  const { formatPrice } = useCurrency();
  const { settings } = useStoreSettings();

  const globalWholesaleMoq = Number(settings?.global_wholesale_moq ?? 500.00);
  const hasWholesaleItems = cartItems.some(item => item.isWholesale);
  const totalWholesaleSubtotal = cartItems
    .filter(item => item.isWholesale)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const isWholesaleMoqValid = !hasWholesaleItems || totalWholesaleSubtotal >= globalWholesaleMoq;
  
  const drawerRef = useRef<HTMLDivElement>(null);

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Click outside to close drawer
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        isCartOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer container */}
        <div 
          ref={drawerRef}
          className="w-screen max-w-md shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l bg-white border-neutral-200"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b flex items-center justify-between border-neutral-200 bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-black" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-black" style={{ fontFamily: "var(--font-display)" }}>
                YOUR CART ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-neutral-100 text-neutral-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-neutral-50 border border-neutral-200 text-black">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold uppercase mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-neutral-400 font-light max-w-xs leading-relaxed">
                    Explore our collection of pro-grade kettlebells, mats, and turf rolls to start your training journey.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Shop Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="flex items-start space-x-4 pb-6 border-b border-neutral-150 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0 border border-neutral-100 bg-neutral-50 flex items-center justify-center p-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold truncate pr-2 flex items-center gap-1.5 text-black font-display">
                        {item.name}
                        {item.isWholesale && (
                          <span className="bg-neutral-100 text-black text-[7px] font-bold px-1.5 py-0.5 rounded border border-black uppercase tracking-wider">
                            Wholesale
                          </span>
                        )}
                      </h4>
                      <p className="text-sm font-extrabold text-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    
                    <p className="text-xs mt-1 flex flex-wrap gap-2 text-neutral-400 font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                      <span>Option: <span className="text-black uppercase">{item.length}</span></span>
                      {item.isWholesale && (
                        <span className="text-neutral-500 font-bold">
                          (MOQ: {item.moqQuantity || 10})
                        </span>
                      )}
                    </p>

                    {/* Quantity Controls & Delete */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1.5 rounded-l-lg hover:bg-neutral-100 transition-colors text-neutral-500"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1.5 rounded-r-lg hover:bg-neutral-100 transition-colors text-neutral-500"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer summary */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-neutral-200 bg-white space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-black" style={{ fontFamily: "var(--font-display)" }}>
                <span>Subtotal</span>
                <span className="text-base font-extrabold">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Shipping and taxes calculated at checkout.
              </p>

              {!isWholesaleMoqValid && (
                <p className="text-[10px] text-neutral-700 bg-neutral-50 border border-black p-3 rounded font-bold uppercase tracking-wider leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                  ⚠️ Wholesale MOQ Not Met: You must purchase a minimum of {formatPrice(globalWholesaleMoq)} in wholesale products to check out. Your current wholesale subtotal is {formatPrice(totalWholesaleSubtotal)}.
                </p>
              )}
 
              <div className="grid grid-cols-1 gap-2 pt-2">
                {isWholesaleMoqValid ? (
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest text-center bg-black text-white hover:bg-neutral-800 transition-colors block"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-neutral-100 text-neutral-400 py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest text-center cursor-not-allowed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Proceed to Checkout
                  </button>
                )}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest text-center border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
