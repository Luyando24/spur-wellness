"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer style={{ backgroundColor: "#000000", color: "#FFFFFF" }} className="border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center">
              <div className="relative h-9 w-44">
                <Image
                  src="/spur-logo.png"
                  alt="Spur Wellness Logo"
                  width={180}
                  height={36}
                  className="object-contain object-left"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Sleek, modern, and high-performance fitness gear and training turf. Built for athletes, engineered for wellness.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-800 text-neutral-400 transition-all duration-200 hover:border-white hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-neutral-800 text-neutral-400 transition-all duration-200 hover:border-white hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
              Explore
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/wholesale", label: "Wholesale & Commercial" },
                { href: "/about", label: "Our Story" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center text-sm text-neutral-400 group transition-colors duration-200"
                  >
                    <ArrowRight
                      className="h-3 w-3 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-white"
                    />
                    <span className="group-hover:text-white transition-colors">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
              Spur HQ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-white" />
                <span className="text-sm text-neutral-400">
                  3920 Prospect Ave, Unit B<br />Yorba Linda, CA 92886, USA
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-white" />
                <span className="text-sm text-neutral-400">
                  714-983-7351
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-white" />
                <span className="text-sm text-neutral-400">
                  info@spurwellness.com
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-white" style={{ fontFamily: "var(--font-display)" }}>
              Performance News
            </h4>
            <p className="text-sm mb-4 text-neutral-400">
              Subscribe to get notified about new equipment releases, restocks, and gym design tutorials.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 text-sm rounded-lg outline-none transition-all bg-neutral-900 border border-neutral-800 text-white focus:border-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-bold rounded-lg transition-all duration-200 bg-white text-black hover:bg-neutral-200"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-neutral-900"
        >
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Spur Wellness. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
