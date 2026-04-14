import { NextRequest, NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { fetchNewTweets } from "@/lib/pipeline/fetch-tweets";
import { parseTweet } from "@/lib/pipeline/parse-tweet";
import { enrichApp } from "@/lib/pipeline/enrich-app";
import { generateArticle } from "@/lib/pipeline/generate-article";
import { postTweet } from "@/lib/pipeline/post-tweet";
import { appendToCreatorSheet } from "@/lib/pipeline/google-sheets";
import { createPostizDraft } from "@/lib/pipeline/create-draft";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const expected = `Bearer ${process.env.PIPELINE_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getAdminDb();
  const errors: string[] = [];
  let articlesGenerated = 0;
  let tweetsPosted = 0;

  try {
    const tweets = await fetchNewTweets(3);

    for (const tweet of tweets) {
      try {
        const parsed = await parseTweet(tweet.text);
        if (!parsed.isUsable) {
          await db.collection("processedTweets").doc(tweet.id).set({
            tweetId: tweet.id,
            articleSlug: null,
            processedAt: Timestamp.now(),
            status: "failed",
            error: "Not usable",
          });
          continue;
        }

        const data = await enrichApp(parsed, tweet.text, tweet.mediaUrls);
        const result = await generateArticle(data, tweet.id);
        articlesGenerated++;

        // Post article tweet with media
        const tiktokThumb = data.tiktokEmbeds.find((e) => e.thumbnailUrl)?.thumbnailUrl ?? "";
        const tweetId = await postTweet({
          slug: result.slug,
          tweetCopy: result.tweetCopy,
          appIconUrl: data.appIconUrl,
          screenshotUrls: data.screenshotUrls,
          tiktokThumbnail: tiktokThumb,
        });
        if (tweetId) tweetsPosted++;

        // Add to creator sheet
        await appendToCreatorSheet({
          slug: result.slug,
          title: result.title,
          appName: result.appName,
          creatorScript: result.creatorScript,
          metric: result.metric,
          tag: result.tag,
        });

        // Create Postiz draft for video post
        await createPostizDraft({
          slug: result.slug,
          title: result.title,
          metric: result.metric,
          tag: result.tag,
          appName: result.appName,
        });
      } catch (err) {
        errors.push(`Tweet ${tweet.id}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return NextResponse.json({
      success: true,
      tweetsFetched: tweets.length,
      articlesGenerated,
      tweetsPosted,
      errors,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
