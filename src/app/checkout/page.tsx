"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Shield, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/components/CurrencyContext";
import { useStoreSettings } from "@/components/StoreSettingsContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { settings } = useStoreSettings();

  const globalWholesaleMoq = Number(settings?.global_wholesale_moq ?? 500.00);
  
  const hasWholesaleItems = cartItems.some(item => item.isWholesale);
  const totalWholesaleSubtotal = cartItems
    .filter(item => item.isWholesale)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const isWholesaleMoqValid = !hasWholesaleItems || totalWholesaleSubtotal >= globalWholesaleMoq;

  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Auto pre-fill details for logged-in users
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Order summary calculations
  const shippingThreshold = 200;
  const shippingCost = cartTotal >= shippingThreshold || cartTotal === 0 ? 0 : 15.0;
  const taxRate = 0.08; // 8% sales tax
  const taxCost = cartTotal * taxRate;
  const totalAmount = cartTotal + shippingCost + taxCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add some products before checking out.");
      return;
    }

    if (!isWholesaleMoqValid) {
      setErrorMessage(`Wholesale MOQ Not Met: You must purchase a minimum of ${formatPrice(globalWholesaleMoq)} in wholesale products to check out. Your current wholesale subtotal is ${formatPrice(totalWholesaleSubtotal)}.`);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      // Create order record
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          address: address.trim(),
          city: city.trim(),
          postal_code: postalCode.trim(),
          phone: phone.trim(),
          total_amount: Number(totalAmount.toFixed(2)),
          status: "Pending",
          user_id: user?.id || null,
        })
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to create order.");
      }

      const createdOrderId = orderData.id;

      // Map cart items to line items
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: createdOrderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: Number(item.price.toFixed(2)),
      }));

      // Insert order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) {
        throw new Error(itemsError.message || "Failed to save order items.");
      }

      // Clear client cart
      clearCart();

      // Redirect to checkout success page
      router.push(`/checkout/success?orderId=${createdOrderId}`);

    } catch (err: any) {
      console.error("Checkout order placement failed:", err);
      setErrorMessage(err.message || "There was a problem placing your order. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-white text-black">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-lg p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center text-black mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-2 uppercase tracking-tight">
              Your cart is empty
            </h1>
            <p className="text-neutral-450 text-sm font-light">
              We cannot checkout with an empty shopping bag. Head over to our catalog to select your favorite products.
            </p>
          </div>
          <Link
            href="/shop"
            className="block w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shop Equipment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-neutral-500 hover:text-black transition-colors text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
            <ArrowLeft className="h-4 w-4 mr-2 stroke-[2]" /> Return to Catalog
          </Link>
        </div>

        <h1 className="text-3xl font-display font-extrabold text-black mb-10 uppercase tracking-tight">CHECKOUT.</h1>

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider rounded-lg">
            {errorMessage}
          </div>
        )}

        {!isWholesaleMoqValid && (
          <div className="mb-8 p-4 bg-neutral-50 border border-black text-black text-xs font-bold uppercase tracking-wider rounded-lg">
            <span>⚠️ Wholesale Requirement: Your cart must contain a minimum of {formatPrice(globalWholesaleMoq)} in wholesale products to place a wholesale order. Your current wholesale subtotal is {formatPrice(totalWholesaleSubtotal)}. Please add more wholesale items or increase their quantities to check out.</span>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          
          {/* Shipping Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-neutral-200 p-6 md:p-8 rounded-lg shadow-sm">
            <h2 className="text-sm font-bold text-black mb-6 border-b border-neutral-200 pb-3 uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
              Shipping & Contact Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contact Email */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full text-xs font-semibold border border-neutral-200 bg-neutral-50 rounded-lg p-3 outline-none focus:border-black text-black"
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Alex"
                    className="w-full text-xs font-semibold border border-neutral-200 bg-neutral-50 rounded-lg p-3 outline-none focus:border-black text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Smith"
                    className="w-full text-xs font-semibold border border-neutral-200 bg-neutral-50 rounded-lg p-3 outline-none focus:border-black text-black"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Prospect Avenue"
                  className="w-full text-xs font-semibold border border-neutral-200 bg-neutral-50 rounded-lg p-3 outline-none focus:border-black text-black"
                />
              </div>

              {/* City and Post Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Yorba Linda"
                    className="w-full text-xs font-semibold border border-neutral-200 bg-neutral-50 rounded-lg p-3 outline-none focus:border-black text-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Postal Code / Zip
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="92886"
                    className="w-full text-xs font-semibold border border-neutral-200 bg-neutral-50 rounded-lg p-3 outline-none focus:border-black text-black"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (714) 983-7351"
                  className="w-full text-xs font-semibold border border-neutral-200 bg-neutral-50 rounded-lg p-3 outline-none focus:border-black text-black"
                />
              </div>

              {/* Payment (Mockup Details) */}
              <div className="border border-neutral-200 bg-neutral-50 rounded-lg p-5 mt-8 space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
                  <span className="font-bold text-xs text-black flex items-center uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                    <CreditCard className="h-4 w-4 mr-2 text-black" /> simulated Payment Gateway
                  </span>
                  <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>GUEST MODE</span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                  Your transaction is fully simulated. Placing the order will clear your cart and complete checkout. No actual credit card charge will be made.
                </p>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting || !isWholesaleMoqValid}
                className="w-full bg-black text-white py-4 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-neutral-850 hover:shadow-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>Place Your Order ({formatPrice(totalAmount)})</span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 mt-8 lg:mt-0 flex flex-col space-y-6">
            <div className="bg-white border border-neutral-200 p-6 rounded-lg shadow-sm">
              <h2 className="text-sm font-bold text-black mb-6 border-b border-neutral-200 pb-3 uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex items-center space-x-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="w-12 h-12 relative rounded border border-neutral-250 bg-neutral-50 overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={36}
                        height={36}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wide mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                        Qty: {item.quantity} | {item.length}
                      </p>
                    </div>
                    <p className="text-xs font-bold text-black">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Calculation Summary */}
              <div className="space-y-3.5 border-t border-neutral-150 pt-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>
                  <span>Subtotal</span>
                  <span className="text-black font-extrabold">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>
                  <span>Shipping</span>
                  <span className="text-black font-extrabold">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>
                  <span>Est. Sales Tax (8%)</span>
                  <span className="text-black font-extrabold">{formatPrice(taxCost)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-black border-t border-neutral-150 pt-4" style={{ fontFamily: "var(--font-display)" }}>
                  <span>Total Due</span>
                  <span className="text-sm font-extrabold">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 flex items-start space-x-3.5">
              <Shield className="h-6 w-6 text-black flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-black uppercase mb-1 tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
                  Secure Checkout Guaranteed
                </h4>
                <p className="text-[10px] uppercase tracking-wider text-neutral-450 font-bold leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>
                  Your credentials and data are protected. Spur Wellness utilizes the highest security standards to secure checkout data and connection sockets.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
