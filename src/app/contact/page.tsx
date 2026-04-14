"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Question",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "contact_submissions"), {
        ...form,
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Contact form error:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-24 pb-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Contact
            </span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted">
            Questions, partnerships, or feedback — we&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-2 border-foreground mb-12">
          <div className="p-6 sm:border-r border-b sm:border-b-0 border-foreground">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">
              Email
            </div>
            <a
              href="mailto:hello@viralgrowthstrategy.com"
              className="text-sm font-semibold hover:text-muted transition-colors"
            >
              hello@viralgrowthstrategy.com
            </a>
          </div>
          <div className="p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mb-2">
              Partnerships
            </div>
            <p className="text-sm text-muted">
              Interested in advertising or becoming a partner? Use the form below.
            </p>
          </div>
        </div>

        {/* Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full border border-card-border bg-white px-4 py-3 text-sm placeholder:text-muted/40 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full border border-card-border bg-white px-4 py-3 text-sm placeholder:text-muted/40 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
                Subject
              </label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-card-border bg-white px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              >
                <option>General Question</option>
                <option>Partnership / Advertising</option>
                <option>Pro Subscription Support</option>
                <option>Team Plan Inquiry</option>
                <option>Bug Report / Feedback</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
                Message
              </label>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us what's on your mind..."
                className="w-full border border-card-border bg-white px-4 py-3 text-sm placeholder:text-muted/40 focus:outline-none focus:border-foreground transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Send Message
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="border-2 border-foreground p-8 text-center">
            <CheckCircle className="h-8 w-8 text-success mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-1">Message Sent</h3>
            <p className="text-sm text-muted">
              We typically respond within 24 hours.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
