import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "../firebase-admin";

const POSTIZ_API_URL = "https://api.postiz.com/public/v1";
const SITE_URL = "https://viralgrowthstrategy.com";

interface PostMedia {
  id: string;
  path: string;
}

/**
 * Upload an image URL to Postiz and return the media object
 */
async function uploadImageToPostiz(
  imageUrl: string,
  apiKey: string
): Promise<PostMedia | null> {
  try {
    // Download the image
    const imgRes = await fetch(imageUrl, {
      signal: AbortSignal.timeout(10000),
    });
    if (!imgRes.ok) return null;

    const blob = await imgRes.blob();
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    const uploadRes = await fetch(`${POSTIZ_API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: apiKey },
      body: formData,
    });

    if (!uploadRes.ok) {
      console.log(`Postiz upload failed: ${uploadRes.status}`);
      return null;
    }

    const data = await uploadRes.json();
    return {
      id: data.id ?? "img",
      path: data.path ?? data.url ?? "",
    };
  } catch (err) {
    console.log(`Image upload failed: ${err}`);
    return null;
  }
}

export async function postTweet(data: {
  slug: string;
  tweetCopy: string;
  appIconUrl: string;
  screenshotUrls: string[];
  tiktokThumbnail: string;
}): Promise<string | null> {
  const apiKey = process.env.POSTIZ_API_KEY;
  const integrationId = process.env.POSTIZ_X_INTEGRATION_ID;

  if (!apiKey || !integrationId) {
    console.log("Skipping tweet — POSTIZ keys not set");
    return null;
  }

  const articleUrl = `${SITE_URL}/case-studies/${data.slug}`;

  // Build tweet: casual copy + link
  let tweetText = data.tweetCopy;
  if (!tweetText.includes("viralgrowthstrategy.com")) {
    tweetText = `${tweetText}\n\n${articleUrl}`;
  }

  // Try to upload media — prefer screenshots, then app icon, then tiktok thumbnail
  const images: PostMedia[] = [];

  // Try first screenshot
  if (data.screenshotUrls.length > 0) {
    const media = await uploadImageToPostiz(data.screenshotUrls[0], apiKey);
    if (media) images.push(media);
    // Try second screenshot too
    if (data.screenshotUrls.length > 1) {
      const media2 = await uploadImageToPostiz(data.screenshotUrls[1], apiKey);
      if (media2) images.push(media2);
    }
  }

  // If no screenshots, use app icon
  if (images.length === 0 && data.appIconUrl) {
    const media = await uploadImageToPostiz(data.appIconUrl, apiKey);
    if (media) images.push(media);
  }

  // If still nothing, try tiktok thumbnail
  if (images.length === 0 && data.tiktokThumbnail) {
    const media = await uploadImageToPostiz(data.tiktokThumbnail, apiKey);
    if (media) images.push(media);
  }

  console.log(`Posting tweet with ${images.length} image(s)`);

  try {
    const response = await fetch(`${POSTIZ_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        type: "now",
        date: new Date().toISOString(),
        shortLink: false,
        tags: [],
        posts: [
          {
            integration: { id: integrationId },
            value: [
              {
                content: tweetText,
                image: images,
              },
            ],
            settings: {
              __type: "x",
              who_can_reply_post: "everyone",
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Postiz API error (${response.status}): ${errorText}`);
      return null;
    }

    const result = await response.json();
    const postId =
      Array.isArray(result) && result[0]?.postId
        ? result[0].postId
        : "posted";

    // Update Firestore
    const db = getAdminDb();
    await db.collection("caseStudies").doc(data.slug).update({
      tweetId: postId,
      tweetedAt: Timestamp.now(),
    });

    console.log(`Tweet posted via Postiz: ${postId}`);
    return postId;
  } catch (error) {
    console.error("Failed to post tweet:", error);
    return null;
  }
}
