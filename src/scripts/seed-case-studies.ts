import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "../lib/firebase-admin";

const seedData = [
  {
    slug: "fitcheck-ai-2m-views-tiktok-slideshow",
    title: "FitCheck AI Hits 2M Views With a Single Slideshow Format",
    tag: "TikTok",
    metric: "+340% downloads",
    description: "How a fitness app used the POV slideshow hook to drive 40K installs in 72 hours with zero ad spend.",
    readTime: "4 min",
    date: "Apr 12, 2026",
    premium: false,
    content: [
      "FitCheck AI, a fitness outfit recommendation app, was sitting at roughly 200 daily downloads for months. The team had tried traditional marketing — paid ads, influencer partnerships, App Store optimization — but nothing moved the needle significantly.",
      "Then they discovered the POV slideshow format on TikTok. Instead of creating polished demo videos, they started posting simple photo slideshows with the hook: \"POV: You let AI pick your outfit for a week.\"",
      "The format was dead simple: 5-7 photos showing before/after outfit transformations, set to a trending audio. No fancy editing. No voiceover. Just photos and text overlays.",
      "The first slideshow got 47K views. Not bad. They posted another the next day with a slight variation: \"POV: Your friend downloads FitCheck AI and you can't recognize them.\" This one hit 340K views.",
      "By the third day, they had found their winning formula. The third slideshow — \"POV: AI styled me better than my stylist\" — exploded to 2.1 million views. Within 72 hours of that post going live, they'd driven over 40,000 app installs with zero ad spend.",
      "The key insight? The POV hook created curiosity and relatability simultaneously. Viewers wanted to see the transformation AND imagined themselves in the scenario. Combined with the inherently shareable slideshow format (which TikTok's algorithm was heavily favoring at the time), it was the perfect storm.",
      "Downloads jumped 340% week-over-week. More importantly, the format was repeatable — they went on to post 50+ variations over the next month, with an average of 200K+ views per post.",
    ],
    metaDescription: "How FitCheck AI drove 40K installs in 72 hours using a simple TikTok slideshow format with zero ad spend.",
  },
  {
    slug: "walkquest-waitlist-to-number-one",
    title: "WalkQuest: From Waitlist to #1 on the App Store in 12 Days",
    tag: "Strategy",
    metric: "136M views",
    description: "The step-by-step waitlist launch playbook that generated 136 million organic views and a #1 ranking.",
    readTime: "6 min",
    date: "Apr 11, 2026",
    premium: true,
    content: [
      "WalkQuest, a gamified walking app, went from zero to #1 on the App Store in just 12 days using a methodical waitlist-to-launch strategy that generated 136 million organic views across TikTok and Instagram.",
      "This is a Pro-exclusive deep dive. Subscribe to VGS Pro to read the full strategy breakdown, including the exact timeline, posting schedule, hook formulas, and waitlist mechanics that made this launch one of the most successful organic app launches of 2026.",
    ],
    metaDescription: "How WalkQuest went from zero to #1 on the App Store in 12 days with 136M organic views.",
  },
  {
    slug: "palette-ai-ugc-creator-network",
    title: "Palette AI Built a 200-Creator Network for $0",
    tag: "Instagram",
    metric: "$70K MRR",
    description: "How this design app reached $70K MRR by building an organic UGC creator network instead of paying influencers.",
    readTime: "5 min",
    date: "Apr 10, 2026",
    premium: true,
    content: [
      "Palette AI, a design and color palette generation app, reached $70K MRR entirely through organic growth by building a network of 200 UGC creators — without paying a single one of them.",
      "This is a Pro-exclusive case study. Upgrade to VGS Pro to learn how they structured their creator program, what incentives they used instead of cash, and how the network effect compounded their growth.",
    ],
    metaDescription: "How Palette AI reached $70K MRR with a 200-creator organic UGC network — zero paid influencers.",
  },
  {
    slug: "snaplearn-725-slideshows-700k-users",
    title: "700K Users From 725 TikTok Slideshows",
    tag: "TikTok",
    metric: "+700K users",
    description: "SnapLearn's methodical approach to slideshows: how quantity and format testing drove massive organic growth.",
    readTime: "7 min",
    date: "Apr 9, 2026",
    premium: false,
    content: [
      "SnapLearn, an educational flashcard app, took a methodical approach to TikTok that most marketers would find boring. No viral stunts. No celebrity partnerships. Just consistent, format-tested slideshows — 725 of them over 8 months.",
      "The results? 700,000 new users, with a CAC of effectively $0.",
      "Their strategy was built on three pillars: volume, testing, and iteration. They posted 3-4 slideshows per day, every day, testing different hooks, formats, and topics. Each week, they'd analyze their top performers and double down on what worked.",
      "The team categorized their slideshows into \"format families\" — groups of posts that shared a similar structure. Their top-performing family was the \"Did You Know\" hook, which averaged 85K views per post. Their worst-performing family (\"Study Tips\") averaged only 8K views — so they killed it and reallocated the effort.",
      "What made SnapLearn's approach unique was their spreadsheet discipline. Every single post was tracked: hook type, audio choice, post time, thumbnail style, and resulting metrics. Over 725 posts, they built a dataset that gave them a statistical edge no competitor could match.",
      "The compounding effect was real. Months 1-3 averaged 15K views per post. Months 4-6 averaged 45K. Months 7-8 averaged 120K — because they'd systematically eliminated underperformers and refined their winning formats.",
      "Key takeaway: Organic growth on TikTok rewards consistency and data-driven iteration more than any single viral moment. SnapLearn's 725 \"boring\" slideshows outperformed competitors who were chasing one-off viral hits.",
    ],
    metaDescription: "How SnapLearn got 700K users from 725 TikTok slideshows using data-driven format testing.",
  },
  {
    slug: "detective-app-200k-downloads",
    title: "Detective App Jumps to 200K Downloads, $70K MRR",
    tag: "TikTok",
    metric: "$70K MRR",
    description: "A mystery game app cracked the code on TikTok engagement loops using cliffhanger hooks.",
    readTime: "5 min",
    date: "Apr 8, 2026",
    premium: true,
    content: ["A mystery game app cracked the code on TikTok engagement loops using cliffhanger hooks. This is a Pro-exclusive case study."],
    metaDescription: "How a detective app hit 200K downloads and $70K MRR with TikTok cliffhanger hooks.",
  },
  {
    slug: "crochet-app-organic-empire",
    title: "This Crochet App Is Making $70K MRR — All Organic",
    tag: "Instagram",
    metric: "$70K MRR",
    description: "How a niche crochet pattern app built a loyal community who market the app for free.",
    readTime: "4 min",
    date: "Apr 7, 2026",
    premium: false,
    content: ["A niche crochet pattern app built a loyal community who market the app for free, reaching $70K MRR with zero paid marketing."],
    metaDescription: "How a crochet app reached $70K MRR entirely through organic community-driven growth.",
  },
  {
    slug: "hook-that-nailed-5m-views",
    title: "The Hook That Nailed It: 5.2M Views on a Single Video",
    tag: "Format Breakdown",
    metric: "5.2M views",
    description: "The exact 3-second hook formula that turned a simple app demo into a viral hit.",
    readTime: "3 min",
    date: "Apr 6, 2026",
    premium: false,
    content: ["We break down the exact 3-second hook formula that turned a simple app demo into a 5.2M view viral hit on TikTok."],
    metaDescription: "Breakdown of the 3-second hook formula behind a 5.2M view TikTok app demo.",
  },
  {
    slug: "meditation-app-youtube-shorts",
    title: "From 0 to 100K Subscribers: A Meditation App's YouTube Strategy",
    tag: "YouTube",
    metric: "100K subs",
    description: "How ZenFlow used YouTube Shorts to build a subscriber base that converts at 12% to installs.",
    readTime: "6 min",
    date: "Apr 5, 2026",
    premium: true,
    content: ["ZenFlow used YouTube Shorts to build 100K subscribers converting at 12% to app installs. This is a Pro-exclusive case study."],
    metaDescription: "How ZenFlow built 100K YouTube subscribers that convert at 12% to app installs.",
  },
  {
    slug: "42-million-views-42-days",
    title: "42 Million Views in 42 Days: The Compound Content Method",
    tag: "Strategy",
    metric: "42M views",
    description: "A deep-dive into the compound content strategy that turns consistent posting into exponential growth.",
    readTime: "8 min",
    date: "Apr 4, 2026",
    premium: true,
    content: ["The compound content strategy turns consistent posting into exponential growth. 42 million views in 42 days. This is a Pro-exclusive deep dive."],
    metaDescription: "The compound content method: how consistent posting generated 42M views in 42 days.",
  },
];

async function seed() {
  const db = getAdminDb();
  const batch = db.batch();

  for (const study of seedData) {
    const ref = db.collection("caseStudies").doc(study.slug);
    batch.set(ref, {
      ...study,
      status: "published",
      createdAt: Timestamp.now(),
      publishedAt: Timestamp.now(),
      sourceApp: "",
      sourceTweetId: null,
      gatheredData: null,
      tweetId: null,
      tweetedAt: null,
    });
  }

  await batch.commit();
  console.log(`Seeded ${seedData.length} case studies to Firestore`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
