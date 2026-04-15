"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ScrollPaywall() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Unlock when user signs in
  useEffect(() => {
    if (user && locked) {
      setLocked(false);
      document.body.style.overflow = "";
    }
  }, [user, locked]);

  if (!locked || user) return null;

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent" />

      <div className="relative w-full max-w-lg mx-4 mb-0 bg-white border-2 border-foreground p-6 sm:p-10 shadow-2xl">
        <div className="text-center">
          <Lock className="h-8 w-8 mx-auto mb-4" />
          <h2 className="font-editorial text-2xl sm:text-3xl font-black tracking-tight mb-2">
            Keep Reading
          </h2>
          <p className="text-base text-muted mb-6 max-w-sm mx-auto">
            Sign in with Google to read full case studies for free,
            or subscribe to Pro for unlimited access.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-foreground text-white py-3.5 text-base font-semibold hover:bg-foreground/90 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff" fillOpacity="0.8" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" fillOpacity="0.6" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" fillOpacity="0.7" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" fillOpacity="0.9" />
              </svg>
              Continue with Google
            </button>
            <Link
              href="/#pricing"
              className="w-full border-2 border-foreground py-3.5 text-base font-semibold text-center hover:bg-cream transition-colors"
            >
              Subscribe to Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
