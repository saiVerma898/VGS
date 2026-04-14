import { google } from "googleapis";

const SITE_URL = "https://viralgrowthstrategy.com";

function getAuth() {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY not set");
  }

  const credentials = JSON.parse(serviceAccountKey);

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/**
 * Check if a creator script was already added today.
 * Only 1 script per day.
 */
export async function hasScriptToday(): Promise<boolean> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) return false;

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A",
    });

    const rows = res.data.values ?? [];
    // Check if any row in column A matches today's date
    return rows.some((row) => row[0] === today);
  } catch {
    return false;
  }
}

export async function appendToCreatorSheet(data: {
  slug: string;
  title: string;
  appName: string;
  creatorScript: string;
  metric: string;
  tag: string;
}): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    console.log("Skipping Google Sheets — GOOGLE_SHEET_ID not set");
    return;
  }

  // Only 1 creator script per day
  const alreadyHasScript = await hasScriptToday();
  if (alreadyHasScript) {
    console.log("Skipping Google Sheets — already added a script today");
    return;
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const articleUrl = `${SITE_URL}/case-studies/${data.slug}`;
  const today = new Date().toISOString().split("T")[0];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:J",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            today,                // A: Date
            data.title,           // B: Article Title
            articleUrl,           // C: Article URL
            data.appName,         // D: App Name
            data.creatorScript,   // E: Creator Script
            "",                   // F: Video Link (filled by creator)
            data.metric,          // G: Metric
            data.tag,             // H: Tag
            "Script Ready",       // I: Status
            "No",                 // J: Posted
          ],
        ],
      },
    });
    console.log(`Added to Google Sheet: ${data.title}`);
  } catch (error) {
    console.error("Google Sheets error:", error);
  }
}

/**
 * Creates the header row if the sheet is empty.
 */
export async function ensureSheetHeaders(): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) return;

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:J1",
    });

    if (!res.data.values || res.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Sheet1!A1:J1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              "Date",
              "Article Title",
              "Article URL",
              "App Name",
              "Creator Script",
              "Video Link",
              "Metric",
              "Tag",
              "Status",
              "Posted",
            ],
          ],
        },
      });
      console.log("Sheet headers created");
    }
  } catch (error) {
    console.error("Failed to check/create sheet headers:", error);
  }
}
