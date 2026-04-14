import { getAdminDb } from "../firebase-admin";

export interface RawTweet {
  id: string;
  text: string;
  createdAt: string;
  mediaUrls: string[];  // images from the tweet (pbs.twimg.com)
}

// Patterns that indicate a tweet has actionable app metrics
const METRIC_PATTERNS = [
  /\$\d+[kK]/i,
  /\d+[kK]\s*(MRR|mrr)/i,
  /\d+[mM]\s*views/i,
  /\d+[kK]\s*downloads/i,
  /\d+[kK]\s*users/i,
  /\d+[kK]\s*installs/i,
  /\d+[kK]\s*revenue/i,
  /\d+M\b/,             // standalone "303M", "1.6M"
  /\$\d+/,              // any dollar amount
  /\d+K\b/i,            // standalone "50K"
];

function hasMetrics(text: string): boolean {
  return METRIC_PATTERNS.some((p) => p.test(text));
}

interface SyndicationMedia {
  media_url_https?: string;
  type?: string;
}

interface SyndicationTweet {
  id_str: string;
  text: string;
  created_at?: string;
  entities?: {
    media?: SyndicationMedia[];
    urls?: { expanded_url?: string }[];
  };
  extended_entities?: {
    media?: SyndicationMedia[];
  };
}

interface SyndicationEntry {
  type: string;
  content?: {
    tweet?: SyndicationTweet;
  };
}

export async function fetchNewTweets(maxCount = 5): Promise<RawTweet[]> {
  const response = await fetch(
    "https://syndication.twitter.com/srv/timeline-profile/screen-name/wesocialgrowth",
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch tweets: ${response.status}`);
  }

  const html = await response.text();

  // Extract __NEXT_DATA__ JSON from the HTML
  const nextDataMatch = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/
  );

  if (!nextDataMatch) {
    throw new Error("Could not find __NEXT_DATA__ in syndication response");
  }

  const nextData = JSON.parse(nextDataMatch[1]);
  const entries: SyndicationEntry[] =
    nextData?.props?.pageProps?.timeline?.entries ?? [];

  // Extract tweets from entries
  const allTweets: RawTweet[] = [];
  for (const entry of entries) {
    if (entry.type === "tweet" && entry.content?.tweet) {
      const t = entry.content.tweet;
      // Decode HTML entities
      const text = t.text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');

      // Extract media images from the tweet
      const mediaItems = t.extended_entities?.media ?? t.entities?.media ?? [];
      const mediaUrls = mediaItems
        .filter((m) => m.media_url_https)
        .map((m) => m.media_url_https!);

      allTweets.push({
        id: t.id_str,
        text,
        createdAt: t.created_at ?? new Date().toISOString(),
        mediaUrls,
      });
    }
  }

  console.log(`Parsed ${allTweets.length} total tweets from syndication`);

  // Filter for tweets with metrics
  const metricTweets = allTweets.filter((t) => hasMetrics(t.text));
  console.log(`${metricTweets.length} tweets have metrics`);

  // Deduplicate against Firestore
  const db = getAdminDb();
  const unprocessed: RawTweet[] = [];

  for (const tweet of metricTweets) {
    if (unprocessed.length >= maxCount) break;

    const existing = await db
      .collection("processedTweets")
      .doc(tweet.id)
      .get();

    if (!existing.exists) {
      unprocessed.push(tweet);
    }
  }

  return unprocessed;
}
