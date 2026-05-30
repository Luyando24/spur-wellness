import Image from "next/image";
import Link from "next/link";
import { products as fallbackProducts } from "@/data/products";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import PriceDisplay from "@/components/PriceDisplay";
import NewsletterForm from "@/components/NewsletterForm";
import MarqueeBanner from "@/components/MarqueeBanner";

export default async function Home() {
  const activeProducts = fallbackProducts;
  const retailProducts = activeProducts.filter((p) => !p.is_wholesale);
  const featuredProducts = retailProducts.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      
      {/* ── Hero Section ── */}
      <section className="relative text-white bg-black overflow-hidden flex items-center" style={{ minHeight: "85vh" }}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/brand%20video.mp4" type="video/mp4" />
          </video>
          {/* Dark gradient overlay for typography readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20 w-full">
          <div className="max-w-3xl space-y-8 text-left">
            {/* Headline */}
            <h1 className="font-display font-extrabold leading-tight tracking-tight text-5xl sm:text-6xl lg:text-7xl uppercase">
              DOMINATE YOUR<br />
              <span className="text-neutral-400">LIMITS.</span>
            </h1>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-xs uppercase tracking-widest bg-white text-black rounded-lg transition-all duration-300 hover:bg-neutral-200 hover:scale-[1.02]"
              >
                SHOP EQUIPMENT <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-xs uppercase tracking-widest border border-white/10 text-white rounded-lg transition-all duration-300 hover:bg-white/10 hover:border-white/30 backdrop-blur-sm"
              >
                COMMERCIAL TURF
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-6 border-t border-white/10 max-w-md">
              {[
                { value: "PRO GRADE", label: "Build Quality" },
                { value: "4.9★", label: "Rated by Athletes" },
                { value: "HQ TURF", label: "Specialists" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-lg font-bold font-display text-white">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <MarqueeBanner />

      {/* ── Value Props / Heavy-Duty Products ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
              The Spur Edge
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-3 tracking-tight">
              BUILT FOR ULTIMATE DURABILITY.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fallbackProducts
              .filter((p) => p.id === "1" || p.id === "8" || p.id === "9")
              .map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group flex flex-col rounded-2xl border border-neutral-250 bg-white overflow-hidden transition-all duration-300 hover:border-black hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-neutral-50 flex items-center justify-center p-10 border-b border-neutral-100 transition-colors group-hover:bg-neutral-100/50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={240}
                      height={240}
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Durability Badge */}
                    <div className="absolute top-4 left-4 flex gap-1.5">
                      <span className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                        {product.category}
                      </span>
                      <span className="bg-neutral-200 text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="h-2.5 w-2.5 stroke-[2.5]" /> HEAVY-DUTY
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Rating & Reviews */}
                      <div className="flex items-center gap-1 mb-2 text-xs">
                        <div className="flex items-center text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current stroke-[1.5]" />
                          <span className="ml-1 font-bold text-black">{product.rating}</span>
                        </div>
                        <span className="text-neutral-300">•</span>
                        <span className="text-neutral-500 font-light">{product.reviews} reviews</span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-display text-lg font-bold mb-2 text-black transition-colors group-hover:text-neutral-600 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-neutral-500 font-light leading-relaxed mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Action */}
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-100 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" style={{ fontFamily: "var(--font-display)" }}>
                          Retail Price
                        </span>
                        <PriceDisplay amount={product.price} className="font-extrabold text-lg text-black" />
                      </div>
                      
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 text-white transition-all duration-300 group-hover:bg-black group-hover:scale-110">
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── Category Quick Navigation ── */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">Shop by Category</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {["Kettlebells", "Resistance Bands", "Exercise Balls", "Exercise Mats", "Artificial Turf"].map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${encodeURIComponent(cat)}`}
                className="px-6 py-3 bg-white border border-neutral-200 rounded-lg text-xs font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Collection ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
                Premium Selection
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-2 tracking-tight">
                FEATURED GEAR.
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest pb-1 border-b-2 border-black transition-all hover:gap-3"
            >
              VIEW ALL <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col">
                <div className="relative aspect-square w-full rounded-xl border border-neutral-100 bg-neutral-50 overflow-hidden flex items-center justify-center p-8 transition-all group-hover:border-neutral-300">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={220}
                    height={220}
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge */}
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
                        <span className="ml-1 font-bold">{product.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{product.reviews} reviews</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-neutral-100">
                    <PriceDisplay amount={product.price} className="font-extrabold text-base" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-black transition-colors">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commercial Section ── */}
      <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-400">
                Gyms, Facilities & Landscapes
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight">
                WHOLESALE &<br />
                COMMERCIAL TURF.
              </h2>
              <p className="text-base text-neutral-400 font-light leading-relaxed">
                Spur Wellness delivers heavy-duty gym turf and landscaping rolls to health clubs, commercial properties, and homeowners. Benefit from competitive volume pricing and specialized logistics.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/wholesale"
                  className="inline-flex items-center gap-2 px-8 py-4 font-bold text-xs uppercase tracking-widest bg-white text-black rounded-lg transition-all hover:bg-neutral-200"
                >
                  GET A QUOTE <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 font-bold text-xs uppercase tracking-widest border border-neutral-800 text-white rounded-lg transition-all hover:bg-neutral-900"
                >
                  CONTACT SALES
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Minimum Orders", value: "Turf Rolls" },
                { label: "Polyethylene Turf", value: "High Density" },
                { label: "Volume Discounts", value: "Available" },
                { label: "Shipping Options", value: "Freight" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 text-center"
                >
                  <div className="font-display text-lg font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { title: "PRO-GRADE FINISH", label: "Built to perform" },
              { title: "30-DAY TRIAL", label: "Satisfaction guaranteed" },
              { title: "FAST FREIGHT", label: "For turf & weights" },
              { title: "SUPPORT 24/7", label: "Here to assist you" },
            ].map((badge, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="font-display text-sm font-extrabold text-black uppercase tracking-wider">{badge.title}</h4>
                <p className="text-xs text-neutral-400 uppercase tracking-widest">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-24 bg-neutral-50 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border border-neutral-300 text-neutral-500">
            Exclusive Updates
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-black tracking-tight">
            JOIN THE SPUR CLUB.
          </h2>
          <p className="text-base text-neutral-500 font-light max-w-lg mx-auto leading-relaxed">
            Get early access to equipment restocks, training tips, and landscaping inspiration.
          </p>
          <div className="pt-4 max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
