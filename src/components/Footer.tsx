import Link from "next/link";

const footerLinks = {
  Platform: [
    { href: "/case-studies", label: "Case Studies" },
    { href: "/#pricing", label: "Subscribe" },
    { href: "/#features", label: "Features" },
    { href: "/#newsletter", label: "Newsletter" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t-2 border-foreground bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-editorial text-2xl font-black tracking-tight">
                VGS
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              The intelligence platform for organic social growth. Read by
              30,000+ marketers at the world&apos;s top companies.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground hover:text-muted transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Viral Growth Strategy. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter / X", "TikTok", "LinkedIn"].map((name) => (
              <span
                key={name}
                className="text-xs text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
