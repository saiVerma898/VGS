import Anthropic from "@anthropic-ai/sdk";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "../firebase-admin";
import type { GatheredData, CaseStudyDoc, ExternalLink } from "../types/case-study";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/-$/, "");
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface GeneratedArticle {
  slug: string;
  title: string;
  metric: string;
  tag: string;
  appName: string;
  creatorScript: string;
  appStoreUrl: string;
  tweetCopy: string;
}

export async function generateArticle(
  data: GatheredData,
  sourceTweetId: string
): Promise<GeneratedArticle> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const externalLinks: ExternalLink[] = [];
  if (data.appStoreUrl) {
    externalLinks.push({ label: "App Store", url: data.appStoreUrl });
  }
  const tiktokSearchUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(data.appName)}`;
  externalLinks.push({ label: "TikTok", url: tiktokSearchUrl });

  const tiktokContext = data.tiktokEmbeds
    .filter((e) => e.title || e.authorName)
    .map((e) => `- "${e.title}" by @${e.authorName} (${e.url})`)
    .join("\n");

  const prompt = `You are a senior content writer for Viral Growth Strategy (viralgrowthstrategy.com). Write in a Bloomberg/NYT editorial style for the ARTICLE, but gen-z casual for the TWEET.

Write THREE things:
1. An original case study article
2. A 15-30 second creator video script
3. A casual Twitter/X post in a specific tone

APP DATA:
- App Name: ${data.appName}
- Category: ${data.category}
- Developer: ${data.developer}
- App Description: ${data.appDescription || "Not available"}
- App Store URL: ${data.appStoreUrl || "Not available"}
- Has App Icon: ${data.appIconUrl ? "Yes" : "No"}
- Screenshots: ${data.screenshotUrls.length}

GROWTH METRICS:
- Downloads: ${data.estimatedDownloads}
- Revenue: ${data.estimatedRevenue}
- TikTok/Social Metrics: ${data.tiktokMetrics}

STRATEGY:
${data.tiktokStrategy}

TIKTOK VIDEOS FOUND:
${tiktokContext || "Search TikTok for this app to find examples"}

SOURCE:
${data.rawTweetText}

=== ARTICLE REQUIREMENTS ===
1. Write 6-9 detailed paragraphs
2. Focus on the organic growth strategy and WHY it worked
3. Include specific numbers
4. Reference TikTok videos/content
5. Mention readers can find videos by searching the app on TikTok
6. Include 2-3 actionable takeaways at the end
7. Do NOT make up fake quotes

=== CREATOR SCRIPT REQUIREMENTS ===
Write this as if YOU are a female content creator talking to camera in FIRST PERSON. Make it viral-worthy — the kind of thing that makes someone stop scrolling.

1. 15-30 seconds when read aloud (40-75 words)
2. FIRST PERSON throughout — "I found this app...", "I couldn't believe...", "so I looked into it..."
3. Open with a scroll-stopping hook: a wild stat, a bold claim, or a "wait what" moment
4. Tell the story like you personally discovered it — "so I was scrolling and found this app that..."
5. Show genuine excitement/disbelief — "ok this app is doing $90K a month with ZERO ads"
6. End with: "full breakdown on viralgrowthstrategy.com — link in bio"
7. Casual, energetic, like you're telling your best friend something crazy you just found
8. Use "girl", "literally", "insane", "wild", "obsessed" naturally — NOT forced
9. NEVER say "bro" or "guys" — say "girl", "ok wait", "no because", "like"

=== TWEET REQUIREMENTS ===
Write a tweet in this EXACT casual, storytelling style. Use emojis. Be relatable and specific. Example tone:

"40M views w the job market trend [skull emoji][crying emoji]
This app gets 60k+ downloads/mo spamming this format
everyone knows the job market is cooked
so thats literally their hook
"how do i explain to my family that i am applying to jobs"
This is also one of the most organic ways to market your app
it feel relatable, and thats what makes people take action
check out the account break down:"

Rules for the tweet:
- Start with the big metric + emoji
- Tell the STORY of what they did in 2-3 short lines
- Explain WHY it works in 1-2 lines
- End with "check out the full breakdown:" and the link will be added after
- Use lowercase, casual grammar, emojis
- Max 250 chars (link added separately)
- DO NOT use hashtags

OUTPUT FORMAT (respond with valid JSON only, no markdown):
{
  "title": "Compelling headline under 80 chars with a specific metric",
  "tag": "One of: TikTok, Instagram, YouTube, Strategy, Format Breakdown",
  "metric": "Key metric e.g. '+340% downloads' or '$90K MRR' or '106M views'",
  "description": "1-2 sentence summary under 200 chars",
  "readTime": "Estimated read time e.g. '5 min'",
  "content": ["paragraph 1", "paragraph 2", "...up to 9 paragraphs"],
  "metaDescription": "SEO meta description under 160 chars",
  "premium": false,
  "creatorScript": "The 15-30 second video script",
  "tweetCopy": "The casual storytelling tweet text (no link, max 250 chars)"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3500,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude did not return valid JSON");
  }

  const article = JSON.parse(jsonMatch[0]);
  let slug = slugify(article.title);

  const db = getAdminDb();
  const existing = await db.collection("caseStudies").doc(slug).get();
  if (existing.exists) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const doc: CaseStudyDoc = {
    slug,
    title: article.title,
    tag: article.tag,
    metric: article.metric,
    description: article.description,
    readTime: article.readTime,
    date: formatDate(),
    premium: article.premium ?? false,
    content: article.content,
    status: "published",
    createdAt: Timestamp.now(),
    publishedAt: Timestamp.now(),
    sourceApp: data.appName,
    sourceTweetId,
    gatheredData: data,
    tweetId: null,
    tweetedAt: null,
    metaDescription: article.metaDescription,
    appIconUrl: data.appIconUrl,
    appStoreUrl: data.appStoreUrl,
    screenshotUrls: data.screenshotUrls,
    externalLinks,
    creatorScript: article.creatorScript ?? "",
    tiktokEmbeds: data.tiktokEmbeds,
  };

  await db.collection("caseStudies").doc(slug).set(doc);

  await db.collection("processedTweets").doc(sourceTweetId).set({
    tweetId: sourceTweetId,
    articleSlug: slug,
    processedAt: Timestamp.now(),
    status: "success",
    error: null,
  });

  console.log(`Article published: ${slug}`);

  return {
    slug,
    title: article.title,
    metric: article.metric,
    tag: article.tag,
    appName: data.appName,
    creatorScript: article.creatorScript ?? "",
    appStoreUrl: data.appStoreUrl,
    tweetCopy: article.tweetCopy ?? "",
  };
}
