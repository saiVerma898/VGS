"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/case-studies");
    } catch {
      setError("Invalid email or password. Try again or sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-24 pb-20 bg-white min-h-screen">
      <div className="mx-auto max-w-sm px-4 pt-12">
        <div className="text-center mb-8">
          <h1 className="font-editorial text-3xl font-black tracking-tight mb-2">
            Sign In
          </h1>
          <p className="text-base text-muted">
            Access your VGS account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-card-border px-4 py-3 text-base placeholder:text-muted/40 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full border border-card-border px-4 py-3 text-base placeholder:text-muted/40 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-foreground text-white py-3 text-base font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
