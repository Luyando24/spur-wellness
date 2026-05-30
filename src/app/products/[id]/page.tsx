"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, Share2, Loader2, MessageSquare, Plus, Minus, Check, Info } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useCurrency } from "@/components/CurrencyContext";
import { products as fallbackProducts } from "@/data/products";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  category: string;
  rating: number;
  reviews_count?: number;
  stock_quantity?: number;
  is_wholesale?: boolean;
  moq_price?: number;
  moq_quantity?: number;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Interface State
  const [selectedOption, setSelectedOption] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    function loadProductData() {
      try {
        setLoading(true);
        // Find product in local dataset
        const foundFallback = fallbackProducts.find((p) => p.id === id);
        if (foundFallback) {
          const currentProduct: Product = {
            ...foundFallback,
            price: Number(foundFallback.price),
            rating: Number(foundFallback.rating),
            stock_quantity: 25 // Default mock stock for interactive usage
          };
          setProduct(currentProduct);
          setSelectedImage(currentProduct.image);

          // Set default option based on category
          if (currentProduct.category === "Kettlebells") {
            setSelectedOption("25 lbs");
          } else if (currentProduct.category === "Resistance Bands") {
            setSelectedOption("Medium");
          } else if (currentProduct.category === "Artificial Turf") {
            setSelectedOption("15ft x 30ft");
          } else if (currentProduct.category === "Exercise Mats") {
            setSelectedOption("6mm");
          } else {
            setSelectedOption("Standard");
          }

          if (currentProduct.is_wholesale && currentProduct.moq_quantity) {
            setQuantity(currentProduct.moq_quantity);
          }

          // Mock reviews loading
          setReviews([
            {
              id: "rev1",
              name: "Marcus K.",
              rating: 5,
              comment: "Excellent build quality. The grip is perfect, doesn't slip even when training gets intense.",
              created_at: new Date(Date.now() - 86400000 * 3).toISOString()
            },
            {
              id: "rev2",
              name: "Sarah L.",
              rating: 5,
              comment: "Super durable materials. Highly recommend this for both home workouts and professional gyms.",
              created_at: new Date(Date.now() - 86400000 * 7).toISOString()
            }
          ]);

          // Related products
          const related = fallbackProducts
            .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 4)
            .map((p) => ({
              ...p,
              price: Number(p.price),
              rating: Number(p.rating)
            }));
          setRelatedProducts(related);
        } else {
          router.push("/404");
        }
      } catch (err) {
        console.error("Failed to retrieve product details:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [id, router]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    setTimeout(() => {
      const newReview: Review = {
        id: "newrev_" + Date.now(),
        name: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        created_at: new Date().toISOString()
      };
      setReviews((prev) => [newReview, ...prev]);
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
      setReviewMessage("Thank you for your valuable feedback!");
      setSubmittingReview(false);
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4 min-h-screen bg-white">
        <Loader2 className="h-12 w-12 text-black animate-spin" />
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
      </div>
    );
  }

  if (!product) return null;

  const displayRating = product.rating || 5.0;
  const displayReviewsCount = reviews.length;

  // Options configuration based on category
  let optionLabel = "Size";
  let options = ["Standard", "Pro"];

  if (product.category === "Kettlebells") {
    optionLabel = "Weight";
    options = ["15 lbs", "25 lbs", "35 lbs", "45 lbs"];
  } else if (product.category === "Resistance Bands") {
    optionLabel = "Resistance";
    options = ["Light", "Medium", "Heavy", "X-Heavy"];
  } else if (product.category === "Artificial Turf") {
    optionLabel = "Dimensions";
    options = ["10ft x 15ft", "15ft x 30ft", "15ft x 50ft"];
  } else if (product.category === "Exercise Mats") {
    optionLabel = "Thickness";
    options = ["4mm", "6mm", "8mm", "10mm"];
  }

  return (
    <div className="min-h-screen py-12 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-neutral-500 hover:text-black transition-colors font-bold uppercase tracking-wider text-xs" style={{ fontFamily: "var(--font-display)" }}>
            <ArrowLeft className="h-4 w-4 mr-2 stroke-[2.5]" /> Back to Catalog
          </Link>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Image Display */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 flex items-center justify-center p-12">
              <Image
                src={selectedImage || product.image}
                alt={product.name}
                width={450}
                height={450}
                className="object-contain"
                priority
              />
            </div>
            {/* Thumbnails fallback */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(product.image)}
                  className={`aspect-square relative rounded-lg overflow-hidden bg-neutral-50 cursor-pointer border flex items-center justify-center p-3 ${i === 0 ? 'border-black ring-1 ring-black' : 'border-neutral-200 hover:border-neutral-400'}`}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} view ${i + 1}`}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Specifications */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0 flex flex-col">
            <span className="text-neutral-400 font-bold tracking-[0.25em] uppercase text-[10px] mb-1" style={{ fontFamily: "var(--font-display)" }}>{product.category}</span>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight mb-2">
              {product.name}
            </h1>
            
            <div className="mt-4 flex items-center justify-between border-b border-neutral-200 pb-4">
              <div>
                {product.is_wholesale ? (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold tracking-tight">
                        {formatPrice(product.moq_price || product.price)}
                      </span>
                      <span className="text-[9px] bg-neutral-100 text-black border border-black font-extrabold px-2 py-0.5 rounded uppercase tracking-widest">
                        Volume Deal
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Single Unit Price: {formatPrice(product.price)} (Save {(100 - (((product.moq_price || product.price) / product.price) * 100)).toFixed(0)}%)
                    </p>
                  </div>
                ) : (
                  <p className="text-3xl font-extrabold tracking-tight">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                 <button className="text-neutral-400 hover:text-red-500 transition-colors p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-full border border-neutral-200">
                   <Heart className="h-4.5 w-4.5" />
                 </button>
                 <button 
                   onClick={handleShare}
                   className="text-neutral-400 hover:text-black transition-colors p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded-full border border-neutral-200 relative"
                 >
                   {isCopied ? <Check className="h-4.5 w-4.5 text-green-600" /> : <Share2 className="h-4.5 w-4.5" />}
                 </button>
              </div>
            </div>

            {/* Star ratings */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-black">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-4.5 w-4.5 flex-shrink-0 ${
                      displayRating > rating ? 'fill-current' : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <a href="#reviews" className="ml-3 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black border-b border-neutral-300 pb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                {displayReviewsCount} Verified Reviews
              </a>
            </div>

            {/* Inventory level */}
            <div className="mt-4">
              {(product.stock_quantity ?? 0) > 0 ? (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-150">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 inline-block"></span>
                  In Stock (Ready to dispatch)
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-150 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 inline-block"></span>
                  Sold Out
                </span>
              )}
            </div>

            <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-500 font-light">
              <p>{product.description}</p>
              <p>
                Experience the professional engineering of Spur Wellness. Built to support heavy loads, maintain excellent friction, and withstand intense athletic workouts.
              </p>
            </div>

            <div className="mt-8 border-t border-neutral-200 pt-8">
               {/* Option selector based on category */}
               <div className="mb-6">
                 <h4 className="text-xs font-bold text-black uppercase mb-3 tracking-widest" style={{ fontFamily: "var(--font-display)" }}>{optionLabel}</h4>
                 <div className="flex flex-wrap gap-2">
                   {options.map((opt) => (
                     <button
                       key={opt}
                       onClick={() => setSelectedOption(opt)}
                       className="px-4 py-2.5 border rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                       style={{
                         backgroundColor: selectedOption === opt ? "#000000" : "#FFFFFF",
                         color: selectedOption === opt ? "#FFFFFF" : "#707070",
                         borderColor: selectedOption === opt ? "#000000" : "#E5E5E7",
                         fontFamily: "var(--font-display)",
                       }}
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               </div>

                {product.is_wholesale && (
                  <p className="text-xs text-neutral-600 font-bold mb-4 flex items-center gap-1.5 bg-neutral-50 p-3 rounded border border-neutral-200">
                    <Info className="h-4.5 w-4.5 shrink-0 text-neutral-500" />
                    <span>Commercial Item: Minimum Order Quantity (MOQ) of {product.moq_quantity || 10} units is required.</span>
                  </p>
                )}

                {/* Add to Cart Actions */}
                <div className="flex items-center space-x-4 mb-8">
                  {(product.stock_quantity ?? 0) > 0 ? (
                    <>
                      <div className="flex items-center border border-neutral-250 rounded-lg bg-neutral-50">
                        <button 
                          onClick={() => setQuantity((q) => Math.max(product.is_wholesale ? (product.moq_quantity || 10) : 1, q - 1))}
                          className="px-4 py-3 text-neutral-500 hover:text-black font-bold transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 py-2 text-black font-bold text-sm w-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
                          {quantity}
                        </span>
                        <button 
                          onClick={() => setQuantity((q) => Math.min(product.stock_quantity ?? 99, q + 1))}
                          className="px-4 py-3 text-neutral-500 hover:text-black font-bold transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => addToCart(product, selectedOption, quantity)}
                        className="flex-1 py-3.5 px-8 flex items-center justify-center text-xs font-bold uppercase tracking-widest rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Add to Cart
                      </button>
                    </>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-neutral-100 text-neutral-400 border border-neutral-200 rounded-lg py-3.5 px-8 flex items-center justify-center text-xs font-bold uppercase tracking-widest cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  )}
                </div>
            </div>

            {/* Core Trust Points */}
            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-400 uppercase tracking-widest border-t border-neutral-150 pt-6 mt-auto" style={{ fontFamily: "var(--font-display)" }}>
              <div className="flex items-center">
                <Truck className="h-4.5 w-4.5 mr-2 text-black" />
                <span>Fast Dispatched Freight</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-4.5 w-4.5 mr-2 text-black" />
                <span>30-Day Product Trial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section id="reviews" className="mt-24 border-t border-neutral-200 pt-16 scroll-mt-24">
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
            
            {/* Reviews Summary */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-display font-extrabold text-black mb-2 uppercase tracking-wide">
                  ATHLETE FEEDBACK.
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4.5 w-4.5 ${displayRating > i ? 'fill-current' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-black font-extrabold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                    {displayRating} / 5.0
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">Based on {displayReviewsCount} verified reviews</p>
              </div>

              {/* Form */}
              <div className="p-6 rounded-xl border border-neutral-200 bg-white">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider mb-4">
                  Write a Review
                </h3>
                <form onSubmit={handleAddReview} className="space-y-4">
                  {reviewMessage && (
                    <div className="p-3 bg-neutral-100 border border-black text-black text-xs font-bold uppercase tracking-wider rounded text-center">
                      {reviewMessage}
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-black hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`h-5 w-5 ${reviewRating >= star ? 'fill-current' : 'text-neutral-200'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. John D."
                      className="w-full text-xs font-semibold rounded border border-neutral-200 bg-neutral-50 p-3 outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      Comments
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share details about the balance, material feel, and durability..."
                      className="w-full text-xs font-semibold rounded border border-neutral-200 bg-neutral-50 p-3 outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {submittingReview ? <Loader2 className="h-4 w-4 animate-spin text-white mx-auto" /> : <span>SUBMIT REVIEW</span>}
                  </button>
                </form>
              </div>
            </div>

            {/* Feed */}
            <div className="lg:col-span-2 mt-12 lg:mt-0 space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-16 bg-neutral-50 border border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center space-y-3">
                  <MessageSquare className="h-8 w-8 text-neutral-300" />
                  <div>
                    <h4 className="font-bold text-neutral-800">No reviews yet</h4>
                    <p className="text-sm text-neutral-400 max-w-xs mt-1">Be the first to review this product!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id} 
                      className="rounded-xl border border-neutral-200 p-5 flex flex-col space-y-2 bg-neutral-50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-black">{rev.name}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-display)" }}>
                          {new Date(rev.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex text-black">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${rev.rating > i ? 'fill-current' : 'text-neutral-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-neutral-600 font-light leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-neutral-200 pt-16">
            <h2 className="text-2xl font-display font-extrabold text-black mb-8 uppercase tracking-wide">
              YOU MAY ALSO LIKE.
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link href={`/products/${p.id}`} key={p.id} className="group">
                  <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white hover:border-black transition-all">
                    <div className="aspect-square relative overflow-hidden bg-neutral-50 flex items-center justify-center p-6">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={150}
                        height={150}
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 border-t border-neutral-100">
                      <h3 className="font-display text-sm font-bold text-black mb-1 truncate">
                        {p.name}
                      </h3>
                      <p className="font-extrabold text-sm text-black">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
