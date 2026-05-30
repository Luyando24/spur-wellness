"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/shop";

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setLoading(true);
      setMessage("");
      setIsSuccess(false);

      if (isRegistering) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          }
        });

        if (error) throw error;

        if (data?.user && data.session === null) {
          setIsSuccess(true);
          setMessage("Account created! Please check your email to verify your account.");
        } else if (data?.user) {
          setIsSuccess(true);
          setMessage("Welcome! Your account has been created successfully.");
          const finalRedirect = email.trim().toLowerCase().includes('admin') ? '/admin' : redirectTo;
          setTimeout(() => router.push(finalRedirect), 1500);
        }

      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data?.user) {
          setIsSuccess(true);
          setMessage("Signed in successfully! Welcome back.");
          const finalRedirect = email.trim().toLowerCase().includes('admin') ? '/admin' : redirectTo;
          setTimeout(() => router.push(finalRedirect), 1500);
        }
      }
    } catch (err: any) {
      console.error("Auth action failed:", err);
      setMessage(err.message || "An authentication error occurred. Please try again.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F9F9F9", minHeight: "100vh" }} className="py-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full rounded-2xl border shadow-sm overflow-hidden relative bg-white border-zinc-200">
        
        {/* Sleek black top accent bar */}
        <div className="h-[4px] w-full bg-black" />
        
        <div className="p-8 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/spur-logo.png" 
                alt="Spur Wellness Logo" 
                className="h-7 object-contain"
                style={{ filter: "brightness(0)" }} 
              />
            </div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-medium">
              {isRegistering 
                ? "Join the club of premium fitness gear" 
                : "Welcome Back"}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-100">
            <button
              onClick={() => {
                setIsRegistering(false);
                setMessage("");
              }}
              className={`py-2 text-xs font-bold rounded-md transition-all duration-300 ${
                !isRegistering
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsRegistering(true);
                setMessage("");
              }}
              className={`py-2 text-xs font-bold rounded-md transition-all duration-300 ${
                isRegistering
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-500 hover:text-black"
              }`}
            >
              Register
            </button>
          </div>

          {message && (
            <div 
              className={`p-3 border text-xs font-semibold rounded text-center leading-relaxed ${
                isSuccess 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm rounded-lg p-3 pl-10 outline-none transition-all border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-black"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm rounded-lg p-3 pl-10 outline-none transition-all border border-zinc-200 bg-zinc-50 focus:bg-white focus:border-black"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isRegistering ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Continue as Guest Divider */}
          <div className="border-t border-zinc-100 pt-6 mt-6 flex flex-col items-center">
            <span className="text-[11px] text-zinc-400 mb-3 uppercase tracking-wider font-medium">Or continue as guest</span>
            <Link
              href={redirectTo}
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline inline-flex items-center"
            >
              Shop Without Login <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback = {
        <div className="flex flex-col items-center justify-center py-40 bg-zinc-50 min-h-screen" >
          <Loader2 className="h-12 w-12 text-black animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
