"use client";

import { useState, useEffect } from "react";
import { X, Mail, Sparkles, CheckCircle, Loader2, ArrowRight, Dumbbell } from "lucide-react";

const DISMISSED_KEY = "ae_newsletter_dismissed";
const SUBSCRIBED_KEY = "ae_newsletter_subscribed";
const DELAY_MS = 6000; // show after 6 seconds

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

  useEffect(() => {
    // Don't show if already dismissed or subscribed
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    const subscribed = localStorage.getItem(SUBSCRIBED_KEY);
    if (dismissed || subscribed) return;

    const timer = setTimeout(() => {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(DISMISSED_KEY, "1");
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      localStorage.setItem(SUBSCRIBED_KEY, "1");
    }, 1000);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity duration-350"
        style={{ opacity: animateIn ? 1 : 0 }}
      />

      {/* Modal */}
      <div
        className="fixed z-[100] inset-0 flex items-end sm:items-center justify-center px-4 sm:px-0 pointer-events-none"
      >
        <div
          className="relative w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-2xl pointer-events-auto transition-all duration-350 border border-neutral-200"
          style={{
            transform: animateIn ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
            opacity: animateIn ? 1 : 0,
          }}
        >
          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 z-10 p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-all"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col sm:flex-row min-h-[340px]">

            {/* Left decorative panel */}
            <div
              className="hidden sm:flex flex-col items-center justify-center w-44 shrink-0 relative overflow-hidden"
              style={{
                backgroundColor: "#000000",
              }}
            >
              <div className="relative flex flex-col items-center gap-3 px-4 text-center text-white">
                <div className="h-12 w-12 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <p className="font-display text-xs font-bold leading-snug uppercase tracking-wider">
                  SPUR PERFORMANCE
                </p>
                <p className="text-neutral-500 text-[10px] leading-relaxed uppercase tracking-wider">
                  Unlock early catalog releases
                </p>
              </div>
            </div>

            {/* Right content */}
            <div className="flex-1 p-7 flex flex-col justify-center bg-white text-black">

              {status === "success" || status === "duplicate" ? (
                /* Success State */
                <div className="flex flex-col items-center text-center gap-4 py-4 animate-in fade-in duration-300">
                  <div className="h-14 w-14 rounded-full bg-neutral-50 border border-black flex items-center justify-center text-black">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold uppercase tracking-wider mb-1">
                      {status === "duplicate" ? "Already subscribed!" : "Welcome to the club!"}
                    </p>
                    <p className="text-neutral-500 text-xs font-light leading-relaxed">
                      {status === "duplicate"
                        ? "You are already on our list. We will keep you updated!"
                        : "You will be the first to know about product restocks, new fitness tools, and exclusive discounts."}
                    </p>
                  </div>
                  <button
                    onClick={dismiss}
                    className="mt-2 px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-neutral-850 transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                /* Subscription Form */
                <>
                  <h2 className="font-display text-2xl font-extrabold text-black mb-2 leading-tight uppercase tracking-tight">
                    JOIN THE CLUB.
                  </h2>
                  <p className="text-neutral-500 text-xs mb-6 leading-relaxed font-light">
                    Join Spur Wellness. Be the first to know about new drops, catalog releases, and fitness tips.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={status === "loading"}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-black placeholder-neutral-400 text-xs font-semibold focus:outline-none focus:border-black transition-all disabled:opacity-50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full py-3 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {status === "loading" ? (
                        <><Loader2 className="h-4 w-4 animate-spin text-white" /> SUBSCRIBING...</>
                      ) : (
                        <>Subscribe Now <ArrowRight className="h-4 w-4 stroke-[2]" /></>
                      )}
                    </button>

                    <p className="text-neutral-400 text-[10px] text-center uppercase tracking-wider mt-2">
                      No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
