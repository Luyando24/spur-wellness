"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User as UserIcon } from "lucide-react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300 border-b"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: scrolled ? "#E5E5E7" : "#F5F5F7",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.03)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18" style={{ height: "72px" }}>
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <div className="relative h-9 w-44 sm:w-48 flex items-center">
                <Image
                  src="/spur-logo.png"
                  alt="Spur Wellness Logo"
                  width={180}
                  height={36}
                  priority
                  className="object-contain object-left"
                  style={{ filter: "brightness(0)" }}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-semibold tracking-wide uppercase transition-all duration-200 group"
                style={{
                  color: isActive(link.href) ? "#000000" : "#707070",
                  fontFamily: "var(--font-display)",
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: "#000000",
                    width: isActive(link.href) ? "60%" : "0%",
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">


            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-neutral-100"
              style={{ color: "#000000" }}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 stroke-[2]" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center text-white"
                  style={{ backgroundColor: "#000000" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2 border-l pl-4" style={{ borderColor: "#E5E5E7" }}>
                <span className="text-xs font-semibold max-w-[100px] truncate text-neutral-600" style={{ fontFamily: "var(--font-display)" }}>
                  {user.email?.split("@")[0]}
                </span>
                <button
                  onClick={signOut}
                  className="text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 border border-red-200 text-red-500 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-black transition-all duration-200 hover:bg-black hover:text-white ml-1"
                style={{ color: "#000000", fontFamily: "var(--font-display)" }}
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="md:hidden flex items-center space-x-3">


            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all hover:bg-neutral-100"
              style={{ color: "#000000" }}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center text-white"
                  style={{ backgroundColor: "#000000" }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:bg-neutral-100"
              style={{ color: "#000000" }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 border-t"
        style={{
          maxHeight: isOpen ? "400px" : "0",
          borderColor: "#E5E5E7",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-200"
              style={{
                color: isActive(link.href) ? "#000000" : "#707070",
                backgroundColor: isActive(link.href)
                  ? "rgba(0,0,0,0.03)"
                  : "transparent",
                fontFamily: "var(--font-display)",
              }}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-black"
                />
              )}
            </Link>
          ))}

          <div className="pt-3 mt-3 border-t" style={{ borderColor: "#E5E5E7" }}>
            {user ? (
              <div className="space-y-2">
                <p className="text-xs px-4 text-neutral-500">
                  Signed in as{" "}
                  <span className="text-black font-semibold">{user.email}</span>
                </p>
                <button
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="flex items-center px-4 py-3 w-full text-sm font-bold rounded-lg transition-all text-red-500"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider text-black"
                style={{ fontFamily: "var(--font-display)" }}
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="h-4 w-4" />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
