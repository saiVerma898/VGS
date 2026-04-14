import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "../lib/firebase-admin";
import { fetchNewTweets } from "../lib/pipeline/fetch-tweets";
import { parseTweet } from "../lib/pipeline/parse-tweet";
import { enrichApp } from "../lib/pipeline/enrich-app";
import { generateArticle } from "../lib/pipeline/generate-article";
import { postTweet } from "../lib/pipeline/post-tweet";
import { appendToCreatorSheet, ensureSheetHeaders } from "../lib/pipeline/google-sheets";
import { createPostizDraft } from "../lib/pipeline/create-draft";

async function runPipeline() {
  const db = getAdminDb();
  const runRef = db.collection("pipelineRuns").doc();
  const errors: string[] = [];
  let tweetsFetched = 0;
  let articlesGenerated = 0;
  let articlesFailed = 0;
  let tweetsPosted = 0;

  await runRef.set({
    startedAt: Timestamp.now(),
    completedAt: null,
    status: "running",
    tweetsFetched: 0,
    articlesGenerated: 0,
    articlesFailed: 0,
    tweetsPosted: 0,
    errors: [],
  });

  try {
    // Ensure Google Sheet has headers
    await ensureSheetHeaders();

    console.log("Fetching tweets from @wesocialgrowth...");
    const tweets = await fetchNewTweets(5);
    tweetsFetched = tweets.length;
    console.log(`Found ${tweets.length} new tweets with metrics`);

    for (const tweet of tweets) {
      try {
        console.log(`\nProcessing tweet: ${tweet.id}`);
        console.log(`Text: ${tweet.text.slice(0, 100)}...`);

        // Parse tweet
        console.log("Parsing tweet...");
        const parsed = await parseTweet(tweet.text);

        if (!parsed.isUsable) {
          console.log("Tweet not usable for article, skipping");
          await db.collection("processedTweets").doc(tweet.id).set({
            tweetId: tweet.id,
            articleSlug: null,
            processedAt: Timestamp.now(),
            status: "failed",
            error: "Tweet not usable for article generation",
          });
          articlesFailed++;
          continue;
        }

        console.log(`App: ${parsed.appName}, Platform: ${parsed.platform}`);

        // Enrich with App Store data + tweet images + TikTok
        console.log("Enriching app data...");
        const data = await enrichApp(parsed, tweet.text, tweet.mediaUrls);
        console.log(`Icon: ${data.appIconUrl ? "yes" : "no"}, Images: ${data.screenshotUrls.length}, TikToks: ${data.tiktokEmbeds.filter(e => e.embedHtml).length}`);

        // Generate article + creator script
        console.log("Generating article with Claude...");
        const result = await generateArticle(data, tweet.id);
        articlesGenerated++;

        // Post article tweet via Postiz (with media)
        if (process.env.POSTIZ_API_KEY) {
          console.log("Posting article tweet...");
          const tiktokThumb = data.tiktokEmbeds.find((e) => e.thumbnailUrl)?.thumbnailUrl ?? "";
          const tweetId = await postTweet({
            slug: result.slug,
            tweetCopy: result.tweetCopy,
            appIconUrl: data.appIconUrl,
            screenshotUrls: data.screenshotUrls,
            tiktokThumbnail: tiktokThumb,
          });
          if (tweetId) tweetsPosted++;
        }

        // Add to Google Sheet (for creator)
        console.log("Adding to creator sheet...");
        await appendToCreatorSheet({
          slug: result.slug,
          title: result.title,
          appName: result.appName,
          creatorScript: result.creatorScript,
          metric: result.metric,
          tag: result.tag,
        });

        // Create Postiz draft (for video post later)
        console.log("Creating Postiz draft...");
        await createPostizDraft({
          slug: result.slug,
          title: result.title,
          metric: result.metric,
          tag: result.tag,
          appName: result.appName,
        });

        // Revalidate site cache
        const siteUrl = process.env.SITE_URL ?? "https://viralgrowthstrategy.com";
        const pipelineSecret = process.env.PIPELINE_SECRET;
        if (pipelineSecret) {
          try {
            await fetch(`${siteUrl}/api/revalidate`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${pipelineSecret}`,
              },
              body: JSON.stringify({ paths: ["/", "/case-studies"] }),
            });
            console.log("Cache revalidated");
          } catch {
            console.log("Cache revalidation failed (non-critical)");
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Failed to process tweet ${tweet.id}: ${msg}`);
        errors.push(`Tweet ${tweet.id}: ${msg}`);
        articlesFailed++;

        await db.collection("processedTweets").doc(tweet.id).set({
          tweetId: tweet.id,
          articleSlug: null,
          processedAt: Timestamp.now(),
          status: "failed",
          error: msg,
        });
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`Pipeline error: ${msg}`);
    errors.push(msg);
  }

  await runRef.update({
    completedAt: Timestamp.now(),
    status: errors.length > 0 && articlesGenerated === 0 ? "failed" : "completed",
    tweetsFetched,
    articlesGenerated,
    articlesFailed,
    tweetsPosted,
    errors,
  });

  console.log(`\nPipeline complete:
  Tweets fetched: ${tweetsFetched}
  Articles generated: ${articlesGenerated}
  Articles failed: ${articlesFailed}
  Tweets posted: ${tweetsPosted}
  Errors: ${errors.length}`);
}

runPipeline()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Fatal pipeline error:", err);
    process.exit(1);
  });
