"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-4 animate-in fade-in duration-300">
        <div className="h-12 w-12 bg-white text-black rounded-full flex items-center justify-center">
          <CheckCircle className="h-6 w-6 stroke-[2.5]" />
        </div>
        <p className="text-black font-display font-extrabold text-lg uppercase tracking-wide">You are in! Welcome to the club.</p>
        <p className="text-neutral-500 text-xs uppercase tracking-wider">Expect early updates and catalog releases in your inbox.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={status === "loading"}
          className="w-full pl-11 pr-4 py-3 rounded-lg bg-white border border-neutral-200 text-black placeholder-neutral-400 focus:outline-none focus:border-black disabled:opacity-60 transition-all text-xs font-semibold"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap transition-colors"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {status === "loading" ? (
          <><Loader2 className="h-4 w-4 animate-spin text-white" /> SUBSCRIBING...</>
        ) : (
          "SUBSCRIBE"
        )}
      </button>
    </form>
  );
}
