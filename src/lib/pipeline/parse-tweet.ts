import Anthropic from "@anthropic-ai/sdk";

export interface ParsedTweet {
  appName: string;
  metrics: {
    views: string | null;
    downloads: string | null;
    revenue: string | null;
    mrr: string | null;
    other: string | null;
  };
  platform: string;
  strategy: string;
  isUsable: boolean;
}

export async function parseTweet(tweetText: string): Promise<ParsedTweet> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Extract structured data from this tweet about an app's viral growth. Return ONLY valid JSON.

Tweet: "${tweetText}"

Return this JSON structure:
{
  "appName": "name of the app mentioned (or 'unknown' if not clear)",
  "metrics": {
    "views": "view count if mentioned, e.g. '106M views' or null",
    "downloads": "download count if mentioned, e.g. '50K downloads' or null",
    "revenue": "revenue if mentioned, e.g. '$30K' or null",
    "mrr": "MRR if mentioned, e.g. '$90K MRR' or null",
    "other": "any other notable metric or null"
  },
  "platform": "primary platform mentioned: TikTok, Instagram, YouTube, or General",
  "strategy": "brief 1-2 sentence description of the growth strategy mentioned",
  "isUsable": true if this tweet has ANY useful growth marketing data — even if the app name is vague, as long as there's a strategy or metric worth writing about. Be GENEROUS — set true if there's at least one metric AND any hint of an app or strategy. Only set false if it's purely a link with no context.
}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      appName: "unknown",
      metrics: {
        views: null,
        downloads: null,
        revenue: null,
        mrr: null,
        other: null,
      },
      platform: "General",
      strategy: "",
      isUsable: false,
    };
  }

  return JSON.parse(jsonMatch[0]) as ParsedTweet;
}
