import { parseTweet } from "../lib/pipeline/parse-tweet";
import { enrichApp } from "../lib/pipeline/enrich-app";
import { generateArticle } from "../lib/pipeline/generate-article";
import { postTweet } from "../lib/pipeline/post-tweet";
import { createPostizDraft } from "../lib/pipeline/create-draft";

const testTweet = {
  id: "test-apify-embed-" + Date.now(),
  text: `Duolingo hit 50M views on TikTok with their unhinged owl memes. 3 posts a day, all trending sounds, zero paid ads. Their TikTok account alone drives millions of downloads.`,
  mediaUrls: [] as string[],
};

async function test() {
  console.log("=== Full Pipeline Test With Apify TikTok Embeds ===\n");

  console.log("1. Parsing...");
  const parsed = await parseTweet(testTweet.text);
  console.log(`   App: ${parsed.appName}, Usable: ${parsed.isUsable}\n`);
  if (!parsed.isUsable) { console.log("Not usable"); return; }

  console.log("2. Enriching (Apify TikTok search)...");
  const data = await enrichApp(parsed, testTweet.text, testTweet.mediaUrls);
  console.log(`   Icon: ${data.appIconUrl ? "YES" : "no"}`);
  console.log(`   Screenshots: ${data.screenshotUrls.length}`);
  console.log(`   TikTok EMBEDS: ${data.tiktokEmbeds.filter(e => e.embedHtml).length}`);
  console.log(`   TikTok total: ${data.tiktokEmbeds.length}\n`);

  console.log("3. Generating article...");
  const result = await generateArticle(data, testTweet.id);
  console.log(`   Title: ${result.title}`);
  console.log(`   Creator: ${result.creatorScript.slice(0, 80)}...\n`);

  console.log("4. Posting tweet...");
  const tiktokThumb = data.tiktokEmbeds.find(e => e.thumbnailUrl)?.thumbnailUrl ?? "";
  await postTweet({
    slug: result.slug,
    tweetCopy: result.tweetCopy,
    appIconUrl: data.appIconUrl,
    screenshotUrls: data.screenshotUrls,
    tiktokThumbnail: tiktokThumb,
  });

  console.log("5. Creating draft...");
  await createPostizDraft({
    slug: result.slug,
    title: result.title,
    metric: result.metric,
    tag: result.tag,
    appName: result.appName,
  });

  console.log(`\n=== DONE ===`);
  console.log(`Article: https://viralgrowthstrategy.com/case-studies/${result.slug}`);
  console.log(`This article has ${data.tiktokEmbeds.filter(e => e.embedHtml).length} REAL TikTok video embeds`);
}

test().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
