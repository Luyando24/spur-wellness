"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Package, MapPin, Phone, Mail, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCurrency } from "@/components/CurrencyContext";

interface Order {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image: string;
    category: string;
  } | null;
}

function SuccessReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { formatPrice } = useCurrency();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("No order reference provided.");
      setLoading(false);
      return;
    }

    async function loadReceipt() {
      try {
        setLoading(true);
        // Fetch Order details
        const { data: orderData, error: orderErr } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (orderErr || !orderData) {
          throw new Error(orderErr?.message || "Order not found.");
        }

        setOrder(orderData);

        // Fetch Order items
        const { data: itemsData, error: itemsErr } = await supabase
          .from("order_items")
          .select(`
            id,
            quantity,
            price,
            products (
              name,
              image,
              category
            )
          `)
          .eq("order_id", orderId);

        if (itemsErr) {
          console.error("Failed to load order items:", itemsErr);
        } else if (itemsData) {
          setItems(itemsData as any);
        }

      } catch (err: any) {
        console.error("Receipt loading failed:", err);
        setError(err.message || "Failed to load order information.");
      } finally {
        setLoading(false);
      }
    }

    loadReceipt();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white min-h-screen">
        <Loader2 className="h-12 w-12 text-black animate-spin" />
        <p className="text-neutral-500 font-bold uppercase tracking-wider text-xs">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-neutral-50 min-h-screen py-24 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-neutral-200 rounded-lg p-8 shadow-sm text-center space-y-6 text-black">
          <div className="w-16 h-16 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center text-black mx-auto">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold mb-2 uppercase tracking-tight">
              Order Not Found
            </h1>
            <p className="text-neutral-450 text-sm font-light leading-relaxed">
              We couldn't retrieve the details for order reference: {orderId || "Missing"}
            </p>
          </div>
          <Link
            href="/shop"
            className="block w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-16 text-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Card */}
        <div className="bg-white border border-neutral-200 rounded-t-xl p-8 shadow-sm text-center border-b-0 space-y-4">
          <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center text-black mx-auto">
            <CheckCircle className="h-10 w-10 text-black fill-current bg-white rounded-full" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-black border border-black uppercase tracking-widest bg-neutral-50 px-3 py-1 rounded-full" style={{ fontFamily: "var(--font-display)" }}>
              Payment Confirmed
            </span>
            <h1 className="text-3xl font-display font-extrabold text-black mt-4 uppercase tracking-tight">
              Thank you, {order.first_name}!
            </h1>
            <p className="text-neutral-500 text-sm mt-2 max-w-md mx-auto font-light leading-relaxed">
              Your gear is in good hands. We have received your order and are already preparing your premium fitness equipment packages!
            </p>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-neutral-400 font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
            <span>Order ID: <span className="text-black select-all">{order.id}</span></span>
            <span className="hidden sm:inline text-neutral-200">•</span>
            <span>Placed: <span className="text-black">{new Date(order.created_at).toLocaleString()}</span></span>
          </div>
        </div>

        {/* Invoice Receipt Body */}
        <div className="bg-white border border-neutral-200 p-8 shadow-sm border-t border-dashed space-y-8">
          
          {/* Shipping Address Details */}
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4 flex items-center" style={{ fontFamily: "var(--font-display)" }}>
              <MapPin className="h-4.5 w-4.5 mr-2 text-black" /> Delivery Information
            </h3>
            
            <div className="bg-neutral-50 rounded-lg p-5 border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-neutral-600 uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              <div className="space-y-2">
                <p className="font-extrabold text-black text-sm">
                  {order.first_name} {order.last_name}
                </p>
                <p className="leading-relaxed">
                  {order.address}<br />
                  {order.city}, {order.postal_code}
                </p>
              </div>
              <div className="space-y-2 flex flex-col justify-center border-t md:border-t-0 pt-4 md:pt-0 border-neutral-200">
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-neutral-400" /> {order.phone}
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-neutral-400" /> {order.email}
                </p>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4 flex items-center" style={{ fontFamily: "var(--font-display)" }}>
              <Package className="h-4.5 w-4.5 mr-2 text-black" /> Ordered Items
            </h3>

            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-neutral-200">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {item.products?.image && (
                        <div className="w-12 h-12 relative rounded border border-neutral-200 overflow-hidden bg-neutral-50 flex items-center justify-center p-2">
                          <Image
                            src={item.products.image}
                            alt={item.products.name}
                            width={36}
                            height={36}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-black font-display">
                          {item.products?.name || "Premium Gear"}
                        </h4>
                        <p className="text-[10px] font-bold text-neutral-400 mt-0.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                          Category: {item.products?.category || "Equipment"} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-black">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Total */}
          <div className="border-t border-neutral-200 pt-6 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>Status</span>
              <p className="text-xs font-bold text-green-600 flex items-center mt-0.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 inline-block"></span>
                Processing Shipment
              </p>
            </div>
            
            <div className="text-right space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>Total Paid</span>
              <p className="text-2xl font-extrabold text-black">
                {formatPrice(Number(order.total_amount))}
              </p>
            </div>
          </div>
        </div>

        {/* Success Footer Navigation Card */}
        <div className="bg-white border border-neutral-200 border-t-0 rounded-b-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm text-center sm:text-left font-light">
            Have questions about shipping or tracking your package? Feel free to contact our customer support team at support@spurwellness.com.
          </p>
          <Link
            href="/shop"
            className="bg-black text-white px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4 stroke-[2]" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-40 space-y-4 bg-white min-h-screen">
          <Loader2 className="h-12 w-12 text-black animate-spin" />
          <p className="text-neutral-500 font-bold uppercase tracking-wider text-xs">Loading order details...</p>
        </div>
      }
    >
      <SuccessReceiptContent />
    </Suspense>
  );
}
