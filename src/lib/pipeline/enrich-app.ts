import type { GatheredData } from "../types/case-study";
import type { ParsedTweet } from "./parse-tweet";
import { fetchTikTokEmbeds } from "./fetch-tiktoks";

interface ITunesResult {
  trackName: string;
  description: string;
  primaryGenreName: string;
  artistName: string;
  trackViewUrl: string;
  artworkUrl512: string;
  artworkUrl100: string;
  screenshotUrls: string[];
  ipadScreenshotUrls: string[];
  averageUserRating: number;
  userRatingCount: number;
}

async function searchITunes(appName: string): Promise<ITunesResult | null> {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      appName
    )}&entity=software&limit=5`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;

    const results = data.results as ITunesResult[];
    const exact = results.find(
      (r) => r.trackName.toLowerCase() === appName.toLowerCase()
    );
    return exact ?? results[0];
  } catch {
    return null;
  }
}

export async function enrichApp(
  parsed: ParsedTweet,
  rawTweetText: string,
  tweetMediaUrls: string[] = []
): Promise<GatheredData> {
  // Fetch app store data and TikTok embeds in parallel
  const [itunes, tiktokEmbeds] = await Promise.all([
    searchITunes(parsed.appName),
    fetchTikTokEmbeds(parsed.appName, rawTweetText),
  ]);

  const metricParts: string[] = [];
  if (parsed.metrics.views) metricParts.push(parsed.metrics.views);
  if (parsed.metrics.downloads) metricParts.push(parsed.metrics.downloads);
  if (parsed.metrics.revenue) metricParts.push(parsed.metrics.revenue);
  if (parsed.metrics.mrr) metricParts.push(parsed.metrics.mrr);
  if (parsed.metrics.other) metricParts.push(parsed.metrics.other);

  // Get screenshots — take first 4, try both iPhone and iPad
  let screenshots = itunes?.screenshotUrls ?? [];
  if (screenshots.length === 0) {
    screenshots = itunes?.ipadScreenshotUrls ?? [];
  }
  const topScreenshots = screenshots.slice(0, 4);

  const iconUrl = itunes?.artworkUrl512 ?? itunes?.artworkUrl100 ?? "";

  // Add tweet media images (screenshots from @wesocialgrowth posts)
  // These are often TikTok screenshots showing the viral format
  for (const mediaUrl of tweetMediaUrls) {
    if (topScreenshots.length < 6) {
      topScreenshots.push(mediaUrl);
    }
  }

  // If still no screenshots, use the high-res icon as hero image
  if (topScreenshots.length === 0 && iconUrl) {
    topScreenshots.push(iconUrl);
  }

  // Also grab TikTok thumbnails as fallback images
  for (const embed of tiktokEmbeds) {
    if (embed.thumbnailUrl && topScreenshots.length < 6) {
      topScreenshots.push(embed.thumbnailUrl);
    }
  }

  return {
    appName: itunes?.trackName ?? parsed.appName,
    appDescription: itunes?.description?.slice(0, 500) ?? "",
    category: itunes?.primaryGenreName ?? "Apps",
    developer: itunes?.artistName ?? "Unknown",
    appStoreUrl: itunes?.trackViewUrl ?? "",
    appIconUrl: iconUrl,
    screenshotUrls: topScreenshots,
    estimatedDownloads: parsed.metrics.downloads ?? "N/A",
    estimatedRevenue: parsed.metrics.revenue ?? parsed.metrics.mrr ?? "N/A",
    tiktokStrategy: parsed.strategy,
    tiktokMetrics: metricParts.join(", "),
    rawTweetText,
    tiktokEmbeds,
  };
}
