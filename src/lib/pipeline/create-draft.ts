const POSTIZ_API_URL = "https://api.postiz.com/public/v1";
const SITE_URL = "https://viralgrowthstrategy.com";

/**
 * Creates a Postiz DRAFT post for X.
 * This draft includes the article link and is ready to publish
 * once the creator video is attached.
 */
export async function createPostizDraft(data: {
  slug: string;
  title: string;
  metric: string;
  tag: string;
  appName: string;
}): Promise<string | null> {
  const apiKey = process.env.POSTIZ_API_KEY;
  const integrationId = process.env.POSTIZ_X_INTEGRATION_ID;

  if (!apiKey || !integrationId) {
    console.log("Skipping Postiz draft — keys not set");
    return null;
  }

  const url = `${SITE_URL}/case-studies/${data.slug}`;
  const hashtags = `#AppMarketing #OrganicGrowth #${data.tag.replace(/\s+/g, "")}`;

  // Draft tweet text — designed to go with the creator video
  let draftText = `${data.metric} with ZERO ad spend.\n\nHow ${data.appName} did it:\n\n${url}\n\n${hashtags}`;

  if (draftText.length > 280) {
    draftText = `${data.metric} — ${data.appName}\n\n${url}\n\n${hashtags}`;
  }

  try {
    const response = await fetch(`${POSTIZ_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        type: "draft",
        date: new Date().toISOString(),
        shortLink: false,
        tags: [],
        posts: [
          {
            integration: { id: integrationId },
            value: [
              {
                content: draftText,
                image: [],
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
      console.error(`Postiz draft error (${response.status}): ${errorText}`);
      return null;
    }

    const result = await response.json();
    const draftId =
      Array.isArray(result) && result[0]?.postId
        ? result[0].postId
        : "draft-created";

    console.log(`Postiz draft created: ${draftId}`);
    return draftId;
  } catch (error) {
    console.error("Failed to create Postiz draft:", error);
    return null;
  }
}
