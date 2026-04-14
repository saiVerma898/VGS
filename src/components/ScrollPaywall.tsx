"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ScrollPaywall() {
  const { user, loading } = useAuth();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // Don't lock if user is signed in
    if (loading || user) return;

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercent > 30) {
        setLocked(true);
        document.body.style.overflow = "hidden";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "";
    };
  }, [user, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!locked || user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Gradient overlay — fades article to white */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent" />

      {/* Paywall card */}
      <div className="relative w-full max-w-lg mx-4 mb-0 sm:mb-0 bg-white border-2 border-foreground p-6 sm:p-10 shadow-2xl">
        <div className="text-center">
          <Lock className="h-8 w-8 mx-auto mb-4" />
          <h2 className="font-editorial text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Keep Reading
          </h2>
          <p className="text-base text-muted mb-6 max-w-sm mx-auto">
            Create a free account to read full case studies, or subscribe to Pro
            for unlimited access + competitor intelligence.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/signup"
              className="w-full bg-foreground text-white py-3.5 text-base font-semibold text-center hover:bg-foreground/90 transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/#pricing"
              className="w-full border-2 border-foreground py-3.5 text-base font-semibold text-center hover:bg-cream transition-colors"
            >
              Subscribe to Pro
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted hover:text-foreground transition-colors mt-1"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
