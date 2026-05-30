"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, Loader2, SlidersHorizontal, Search } from "lucide-react";
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
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") || "All Categories";

  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    // We fall back directly to local products to maintain speed and reliability
    setProducts(fallbackProducts);
    setLoading(false);
  }, []);

  const categories = ["All Categories", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products
    .filter((p) => selectedCategory === "All Categories" || p.category === selectedCategory)
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest") return b.id.localeCompare(a.id);
    if (sortBy === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="bg-white min-h-screen text-black">
      {/* Page Header */}
      <div className="py-20 px-4 text-center border-b border-neutral-150 bg-neutral-50">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
          Professional Catalog
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-3 mb-4 tracking-tight">
          SHOP THE COLLECTION.
        </h1>
        <p className="text-neutral-500 text-sm max-w-md mx-auto font-light">
          Browse our high-performance fitness gear and commercial artificial turf rolls.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Sort Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 p-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
          {/* Left: Search + Category filters */}
          <div className="flex flex-col gap-4 w-full lg:flex-1">
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-lg border border-neutral-200 bg-neutral-50 outline-none transition-all focus:border-black focus:bg-white"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 mr-1">
                <SlidersHorizontal className="h-3.5 w-3.5" /> FILTER:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all duration-200"
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

          {/* Sort */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold uppercase tracking-wider border border-neutral-200 rounded-lg px-3 py-2.5 outline-none bg-neutral-50 cursor-pointer focus:border-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
              <option>Newest</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-xs mb-8 text-neutral-400">
            Showing <strong className="text-black">{sortedProducts.length}</strong> products
            {selectedCategory !== "All Categories" && ` in "${selectedCategory}"`}
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-black" />
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading catalog...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-32 rounded-xl border border-neutral-200 bg-neutral-50">
            <p className="font-display text-lg font-bold mb-2">No products found.</p>
            <p className="text-sm text-neutral-400 font-light">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col">
                <div className="relative aspect-square w-full rounded-xl border border-neutral-100 bg-neutral-50 overflow-hidden flex items-center justify-center p-8 transition-all group-hover:border-neutral-300">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                    {product.category}
                  </div>
                </div>

                <div className="pt-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold mb-1 text-black group-hover:text-neutral-500 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-3 text-xs text-neutral-500">
                      <div className="flex items-center text-black">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="ml-1 font-bold">{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                      </div>
                      <span>•</span>
                      <span>{product.reviews || 0} reviews</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-neutral-100">
                    <span className="font-extrabold text-base text-black">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-black transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-40 space-y-4 min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Loading shop...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
