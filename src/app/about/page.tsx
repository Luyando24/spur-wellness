import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Target, Eye } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-black">
      
      {/* Hero */}
      <section className="relative py-28 overflow-hidden bg-black text-white">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 bg-white"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Our Story
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white mb-6">
            ENGINEERED FOR WELLNESS.
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-neutral-400 font-light">
            Founded with a passion for designing sleek, durable, and professional-grade fitness equipment that inspires health and fits seamlessly into modern spaces.
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Visual element */}
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-xl overflow-hidden border border-neutral-250 bg-neutral-50 flex items-center justify-center p-12">
                <Image
                  src="/products/kettlebell.png"
                  alt="Spur Wellness Kettlebell Design"
                  width={380}
                  height={380}
                  className="object-contain"
                />
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-6 -right-6 w-36 h-36 rounded-xl border border-black bg-white z-10 shadow-lg"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="font-display text-3xl font-extrabold text-black">PRO</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>Grade</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
                  Who We Are
                </span>
                <h2 className="font-display text-4xl font-extrabold mt-3 mb-6 tracking-tight">
                  THE SPUR WELLNESS MISSION.
                </h2>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-neutral-500 font-light">
                Spur Wellness was born out of a desire for premium, authentic fitness equipment that doesn't compromise on build quality or aesthetic values. We noticed a gap in the market for functional fitness tools that look clean, feel professional, and are built to withstand high-volume usage.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-500 font-light">
                Our mission is simple: to spur your wellness journey. We believe that professional design and premium materials shouldn't just be for high-end commercial athletic facilities. By engineering equipment that meets professional athletic criteria, we supply home gym builders and club owners alike with commercial-grade solutions.
              </p>

              <div className="space-y-4 pt-4">
                <h3 className="font-display text-lg font-bold uppercase tracking-wider">Quality Standards</h3>
                {[
                  "Industrial-grade cast iron and powder coat finishes",
                  "Anti-burst PVC stability balls rated to 2,000 lbs",
                  "UV-stabilized, high-density polyethylene turf fibers",
                  "Eco-friendly, double-sided non-slip TPE mats",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 text-black"
                    >
                      <CheckCircle className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
            Our Foundation
          </span>
          <h2 className="font-display text-4xl font-extrabold mt-3 mb-16 tracking-tight">
            CORE PHILOSOPHY.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-6 w-6" />,
                title: "Precision Engineering",
                desc: "We stay focused on functional design, balancing weights to international competition standards, and ensuring maximum grip efficiency.",
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Durable Integrity",
                desc: "We never compromise on build quality. Our products are made using durable compounds to withstand high impact, sweat, and heavy wear.",
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: "Minimalist Aesthetics",
                desc: "We design clean, high-contrast aesthetics that blend perfectly into modern interiors. Minimal noise, maximum workout focus.",
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl border border-neutral-200 bg-white hover:border-black transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6 bg-black text-white group-hover:scale-110 transition-transform"
                >
                  {val.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-4">
                  {val.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500 font-light">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-2xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-display text-4xl font-extrabold tracking-tight">
            SPUR YOUR PROGRESS.
          </h2>
          <p className="text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
            Discover our collection and select the premium gear built to support your training limits.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-xs uppercase tracking-widest bg-white text-black rounded-lg transition-all hover:bg-neutral-200"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SHOP CATALOG
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
