const testimonials = [
  {
    name: "Alex Rivera",
    role: "Head of Growth, FitSync",
    quote:
      "VGS paid for itself in the first week. We found a viral format that got us 2M views and 40K downloads in 3 days.",
  },
  {
    name: "Sarah Kim",
    role: "Indie App Founder",
    quote:
      "I used to spend 4 hours a day scrolling TikTok for research. Now I spend 15 minutes on VGS and get 10x better insights.",
  },
  {
    name: "James Okonkwo",
    role: "Growth Lead, SnapLearn",
    quote:
      "The competitor intelligence alone is worth the subscription. We spotted a strategy shift 2 weeks before anyone else.",
  },
  {
    name: "Maria Chen",
    role: "Marketing Director, Palette AI",
    quote:
      "Every morning I check my VGS dashboard before anything else. The newcomer alerts keep us ahead of market trends.",
  },
  {
    name: "David Park",
    role: "CEO, WalkQuest",
    quote:
      "We went from 500 to 50,000 daily downloads using strategies from VGS. The case studies are incredibly actionable.",
  },
  {
    name: "Priya Sharma",
    role: "UA Manager, ToneUp",
    quote:
      "Our organic installs now outperform paid by 3x. VGS is the reason we cut ad spend by 60%.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Testimonials
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            What Our Readers Say
          </h2>
        </div>

        {/* Grid — newspaper column style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t-2 border-foreground">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`p-6 border-b border-card-border ${
                i % 3 !== 2 ? "lg:border-r" : ""
              } ${i % 2 !== 1 ? "md:border-r lg:border-r-0" : ""} ${
                i % 3 !== 2 ? "lg:border-r" : ""
              } border-card-border`}
            >
              <p className="text-[15px] text-foreground leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-card-border pt-4">
                <p className="text-sm font-bold">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
