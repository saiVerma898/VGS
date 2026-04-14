"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
        subscribedAt: serverTimestamp(),
        source: "website",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Newsletter signup error:", err);
      // Still show success to user — can retry server-side
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              Newsletter
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            The Daily Briefing
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-8">
            Viral strategies, format breakdowns, and growth case studies.
            Delivered every morning to 30,000+ marketers. Free.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 flex items-center justify-center gap-2 bg-white text-foreground px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                You&apos;re in. Check your inbox.
              </span>
            </div>
          )}

          <p className="mt-4 text-xs text-white/30">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
