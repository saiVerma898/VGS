import type { TikTokEmbed } from "../types/case-study";

const APIFY_TOKEN = process.env.APIFY_API_KEY ?? "";

interface ApifyTikTokResult {
  webVideoUrl?: string;
  videoUrl?: string;
  text?: string;
  authorMeta?: { name?: string; nickName?: string };
  diggCount?: number;
  playCount?: number;
  shareCount?: number;
  covers?: { default?: string; origin?: string };
}

interface OEmbedResponse {
  html: string;
  thumbnail_url: string;
  author_name: string;
  title: string;
}

/**
 * Get TikTok oEmbed data for a video URL
 */
async function getOEmbed(tiktokUrl: string): Promise<TikTokEmbed | null> {
  try {
    const res = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`,
      { signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as OEmbedResponse;
    if (!data.html) return null;
    return {
      url: tiktokUrl,
      embedHtml: data.html,
      thumbnailUrl: data.thumbnail_url ?? "",
      authorName: data.author_name ?? "",
      title: data.title ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * Search TikTok for an app using Apify's free TikTok scraper.
 * Returns actual video URLs we can embed.
 */
async function searchTikTokViaApify(appName: string): Promise<ApifyTikTokResult[]> {
  if (!APIFY_TOKEN) {
    console.log("Skipping Apify TikTok search — APIFY_API_KEY not set");
    return [];
  }

  try {
    // Run the free TikTok scraper actor synchronously
    const actorId = "clockworks~free-tiktok-scraper";
    const runUrl = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

    const res = await fetch(runUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        excludePinnedPosts: false,
        maxProfilesPerQuery: 1,
        resultsPerPage: 5,
        searchQueries: [`${appName} app`],
        shouldDownloadCovers: false,
        shouldDownloadSlideshowImages: false,
        shouldDownloadSubtitles: false,
        shouldDownloadVideos: false,
      }),
      signal: AbortSignal.timeout(90000), // Apify can take up to 90s
    });

    if (!res.ok) {
      console.log(`Apify error: ${res.status}`);
      return [];
    }

    const results = (await res.json()) as ApifyTikTokResult[];
    console.log(`Apify returned ${results.length} TikTok results for "${appName}"`);
    return results;
  } catch (err) {
    console.log(`Apify TikTok search failed: ${err}`);
    return [];
  }
}

/**
 * Try to resolve t.co short links to see if they point to TikTok
 */
async function resolveShortUrl(shortUrl: string): Promise<string | null> {
  try {
    const res = await fetch(shortUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });
    const location = res.headers.get("location");
    if (location && location.includes("tiktok.com")) return location;
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract TikTok-related URLs from text
 */
function extractUrls(text: string): string[] {
  const urls: string[] = [];
  const tiktokRegex = /https?:\/\/(?:www\.)?tiktok\.com\/[@\w]+\/video\/\d+/gi;
  const matches = text.match(tiktokRegex);
  if (matches) urls.push(...matches);
  const vmRegex = /https?:\/\/vm\.tiktok\.com\/[\w]+/gi;
  const vmMatches = text.match(vmRegex);
  if (vmMatches) urls.push(...vmMatches);
  const tcoRegex = /https?:\/\/t\.co\/[\w]+/gi;
  const tcoMatches = text.match(tcoRegex);
  if (tcoMatches) urls.push(...tcoMatches);
  return urls;
}

/**
 * Fetch TikTok embeds for an app.
 * 1. Check tweet text for TikTok/t.co URLs
 * 2. Search TikTok via Apify for actual viral videos
 * 3. Get oEmbed for each video found
 */
export async function fetchTikTokEmbeds(
  appName: string,
  tweetText: string
): Promise<TikTokEmbed[]> {
  const embeds: TikTokEmbed[] = [];

  // 1. Check tweet text for direct TikTok links
  const urls = extractUrls(tweetText);
  for (const url of urls.slice(0, 3)) {
    let tiktokUrl = url;
    if (url.includes("t.co/")) {
      const resolved = await resolveShortUrl(url);
      if (resolved) tiktokUrl = resolved;
      else continue;
    }
    if (tiktokUrl.includes("tiktok.com")) {
      const embed = await getOEmbed(tiktokUrl);
      if (embed) {
        embeds.push(embed);
        if (embeds.length >= 2) break;
      }
    }
  }

  // 2. If we don't have embeds yet, search TikTok via Apify
  if (embeds.length === 0 && appName !== "unknown") {
    const apifyResults = await searchTikTokViaApify(appName);

    // Sort by play count to get the most viral videos
    const sorted = apifyResults
      .filter((r) => r.webVideoUrl || r.videoUrl)
      .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));

    for (const result of sorted.slice(0, 3)) {
      const videoUrl = result.webVideoUrl ?? "";
      if (!videoUrl) continue;

      // Try to get oEmbed
      const embed = await getOEmbed(videoUrl);
      if (embed) {
        embeds.push(embed);
      } else {
        // Fallback: create a link card with the thumbnail
        embeds.push({
          url: videoUrl,
          embedHtml: "",
          thumbnailUrl: result.covers?.origin ?? result.covers?.default ?? "",
          authorName: result.authorMeta?.nickName ?? result.authorMeta?.name ?? "",
          title: result.text?.slice(0, 100) ?? `${appName} on TikTok`,
        });
      }

      if (embeds.length >= 2) break;
    }
  }

  // 3. Always add a TikTok search link as the last item
  const searchUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(appName + " app")}`;
  embeds.push({
    url: searchUrl,
    embedHtml: "",
    thumbnailUrl: "",
    authorName: "",
    title: `Search "${appName}" on TikTok`,
  });

  const realEmbeds = embeds.filter((e) => e.embedHtml).length;
  console.log(`Found ${realEmbeds} TikTok video embeds + ${embeds.length - realEmbeds} links for ${appName}`);
  return embeds;
}
