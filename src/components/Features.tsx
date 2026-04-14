import {
  Search,
  BarChart3,
  BookOpen,
  Radar,
  UserCheck,
  Sparkles,
  Database,
  Bell,
  Layers,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "AI-Powered Search",
    description:
      "Search hundreds of viral apps, strategies, and formats instantly with intelligent search.",
  },
  {
    icon: Radar,
    title: "Competitor Intelligence",
    description:
      "Daily-updated competitor strategies, accounts, and viral formats. Know what they're doing before they scale.",
  },
  {
    icon: BookOpen,
    title: "Research Library",
    description:
      "10+ new strategy breakdowns added daily. Deep-dive case studies on what makes apps go viral.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Insights from thousands of videos, hooks, and accounts. Data-driven decisions, not guesswork.",
  },
  {
    icon: Database,
    title: "Account Database",
    description:
      "1,500+ tracked creator accounts across TikTok, Instagram, and YouTube.",
  },
  {
    icon: Sparkles,
    title: "Newcomer Alerts",
    description:
      "Discover emerging apps before they go mainstream. Early intelligence on the next breakout hits.",
  },
  {
    icon: UserCheck,
    title: "Expert Analysis",
    description:
      "From growth engineers who have generated billions of organic views. Battle-tested only.",
  },
  {
    icon: Layers,
    title: "Personal Dashboard",
    description:
      "Your command center. Briefings, saved research, market radar — all in one place.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description:
      "Get notified when viral formats emerge or when competitors launch new campaigns.",
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description:
      "Your intelligence feed on the go. Never miss a trending format or strategy alert.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Platform
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-lg">
            Everything You Need to Win Organically
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-t-2 border-foreground">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`p-5 border-b border-card-border ${
                i % 5 !== 4 ? "lg:border-r" : ""
              } ${i % 2 !== 1 ? "sm:border-r lg:border-r-0" : ""} ${
                i % 5 !== 4 ? "lg:border-r" : ""
              } group hover:bg-cream transition-colors`}
            >
              <feature.icon className="h-5 w-5 text-foreground mb-3" strokeWidth={1.5} />
              <h3 className="text-sm font-bold mb-1.5">{feature.title}</h3>
              <p className="text-[13px] text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
