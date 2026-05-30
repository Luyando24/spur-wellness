const fallbackItems = [
  { label: "FREE SHIPPING ON ORDERS OVER $99", icon: "✦" },
  { label: "ENGINEERED FOR ELITE ATHLETES", icon: "✦" },
  { label: "PRO-GRADE CAST IRON", icon: "✦" },
  { label: "30-DAY SATISFACTION GUARANTEED", icon: "✦" },
  { label: "SPUR YOUR PERFORMANCE", icon: "✦" },
  { label: "ANTI-SLIP TEXTURE MATS", icon: "✦" },
  { label: "EASY DRAIN GYM TURF", icon: "✦" },
  { label: "CORE POSTURE STABILITY", icon: "✦" },
];

export default async function MarqueeBanner() {
  const items = fallbackItems;
  const doubled = [...items, ...items];

  return (
    <div
      className="relative py-3.5 overflow-hidden border-y border-neutral-200"
      style={{
        backgroundColor: "#000000",
      }}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #000000, transparent)" }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #000000, transparent)" }}
      />

      <div
        className="flex gap-0 whitespace-nowrap"
        style={{
          animation: "marquee 35s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6">
            <span className="text-[10px]" style={{ color: "#FFFFFF" }}>{item.icon}</span>
            <span
              className="text-xs font-bold tracking-[0.15em] uppercase"
              style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-display)" }}
            >
              {item.label}
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
