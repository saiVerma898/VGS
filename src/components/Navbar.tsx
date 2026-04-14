"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/case-studies", label: "Case Studies" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm">
      {/* Top thin accent line */}
      <div className="h-[3px] bg-foreground" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-editorial text-2xl font-black tracking-tight">
              VGS
            </span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-muted font-medium border-l border-card-border pl-2 ml-1">
              Viral Growth Strategy
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors link-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://x.com/viralgrowths"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @viralgrowths
            </a>
            <Link
              href="/#newsletter"
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Newsletter
            </Link>
            <Link
              href="/#pricing"
              className="bg-foreground text-white px-5 py-2 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="border-b border-card-border" />

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-card-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-base text-muted hover:text-foreground py-2.5 border-b border-card-border"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://x.com/viralgrowths"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-base text-muted hover:text-foreground py-2.5 border-b border-card-border"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @viralgrowths
            </a>
            <div className="pt-3 flex gap-3">
              <Link
                href="/#newsletter"
                onClick={() => setOpen(false)}
                className="text-base text-muted hover:text-foreground py-2"
              >
                Newsletter
              </Link>
              <Link
                href="/#pricing"
                onClick={() => setOpen(false)}
                className="bg-foreground text-white px-5 py-2 text-base font-semibold"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
