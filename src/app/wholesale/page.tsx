"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2, SlidersHorizontal, Info } from "lucide-react";
import { products as fallbackProducts } from "@/data/products";
import { useCurrency } from "@/components/CurrencyContext";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews?: number;
  is_wholesale?: boolean;
  moq_price?: number;
  moq_quantity?: number;
}

export default function WholesalePage() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Featured");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    // Only load products marked for wholesale
    const wholesaleItems = fallbackProducts.filter((p) => p.is_wholesale);
    setProducts(wholesaleItems);
    setLoading(false);
  }, []);

  const categories = ["All Categories", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter(
    (product) => selectedCategory === "All Categories" || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aPrice = a.moq_price || a.price;
    const bPrice = b.moq_price || b.price;
    if (sortBy === "Price: Low to High") {
      return aPrice - bPrice;
    }
    if (sortBy === "Price: High to Low") {
      return bPrice - aPrice;
    }
    if (sortBy === "Newest") {
      return b.id.localeCompare(a.id);
    }
    return 0;
  });

  return (
    <div className="bg-white min-h-screen text-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Wholesale Header Banner */}
        <div className="rounded-xl p-8 md:p-12 mb-12 border border-neutral-200 bg-neutral-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-100 rounded-full blur-3xl -z-10" />
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center text-xs font-bold text-black border border-black px-3 py-1 rounded-full uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
              Commercial Division
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-black tracking-tight uppercase">
              WHOLESALE & PARTNERS.
            </h1>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light">
              Outfitting a wellness space or sourcing for a landscaping project? Spur Wellness provides volume discounts on premium gym turf rolls, high-density equipment mats, and weight sets. Standard order processing and checkout is integrated directly below.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}><Info className="h-4 w-4 text-black" /> Volume-based MOQ wholesale pricing per item</span>
            </div>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-neutral-50 p-4 rounded-lg border border-neutral-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-0 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
              <SlidersHorizontal className="h-4 w-4 text-black" /> Filter:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors"
                  style={{
                    backgroundColor: selectedCategory === cat ? "#000000" : "#FFFFFF",
                    color: selectedCategory === cat ? "#FFFFFF" : "#707070",
                    borderColor: selectedCategory === cat ? "#000000" : "#E5E5E7",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold uppercase tracking-wider border border-neutral-200 rounded-lg bg-white p-2.5 outline-none focus:border-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 text-black animate-spin" />
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Loading Catalog...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-200">
            <p className="text-neutral-500 text-lg font-display font-extrabold uppercase">No products available</p>
            <p className="text-neutral-400 text-xs mt-2 font-light">Please contact support or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const wholesalePrice = product.moq_price || product.price;
              const hasDiscount = product.moq_price && product.moq_price < product.price;
              
              return (
                <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col">
                  <div className="rounded-xl border border-neutral-200 bg-white hover:border-black transition-all flex flex-col h-full">
                    <div className="aspect-square relative overflow-hidden bg-neutral-50 flex items-center justify-center p-8 border-b border-neutral-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Wholesale Badge Overlay */}
                      <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-extrabold px-2.5 py-1 rounded uppercase tracking-wider">
                        MOQ: {product.moq_quantity || 10} Units
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-display)" }}>
                          {product.category}
                        </p>
                        <h3 className="font-display text-base font-bold text-black group-hover:text-neutral-500 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </div>
                      
                      <div className="mt-6 pt-3 border-t border-neutral-100 space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-neutral-450 text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>MOQ Price:</span>
                          <span className="text-black font-extrabold text-base">
                            {formatPrice(wholesalePrice)}
                          </span>
                        </div>
                        {hasDiscount && (
                          <div className="flex justify-between items-center text-[10px] text-neutral-400">
                            <span style={{ fontFamily: "var(--font-display)" }}>RETAIL VALUE:</span>
                            <span className="line-through">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-[10px] text-neutral-400">
                          <span style={{ fontFamily: "var(--font-display)" }}>MIN ORDER:</span>
                          <span className="font-bold text-black uppercase">
                            {product.moq_quantity || 10} units
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
