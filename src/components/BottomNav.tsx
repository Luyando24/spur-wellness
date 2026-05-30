"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Briefcase, BookOpen, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen } = useCart();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) {
    return null;
  }

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/wholesale", label: "Wholesale", icon: Briefcase },
    { href: "/about", label: "Our Story", icon: BookOpen },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/80 backdrop-blur-lg border-t border-neutral-100 shadow-2xl safe-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 py-1 text-center transition-all duration-200 active:scale-90"
            >
              <Icon
                className="h-5 w-5 transition-transform duration-200"
                style={{
                  color: active ? "#000000" : "#A0A0A0",
                  strokeWidth: active ? 2.5 : 2,
                }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-wider mt-1 transition-colors duration-200"
                style={{
                  color: active ? "#000000" : "#A0A0A0",
                  fontFamily: "var(--font-display)",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* Cart Tab (Opens Cart Drawer instead of navigating) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-center transition-all duration-200 active:scale-90 relative"
          aria-label="Open cart"
        >
          <div className="relative">
            <ShoppingCart
              className="h-5 w-5"
              style={{
                color: "#A0A0A0",
                strokeWidth: 2,
              }}
            />
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2 text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center text-white scale-90 border border-white"
                style={{ backgroundColor: "#000000" }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <span
            className="text-[9px] font-bold uppercase tracking-wider mt-1"
            style={{
              color: "#A0A0A0",
              fontFamily: "var(--font-display)",
            }}
          >
            Cart
          </span>
        </button>
      </div>
    </div>
  );
}
