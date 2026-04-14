import { getAdminDb } from "./firebase-admin";
import type { CaseStudyListing, CaseStudyFull } from "./types/case-study";

const COLLECTION = "caseStudies";

function toListing(doc: FirebaseFirestore.DocumentSnapshot): CaseStudyListing {
  const d = doc.data()!;
  return {
    slug: doc.id,
    title: d.title,
    tag: d.tag,
    metric: d.metric,
    description: d.description,
    readTime: d.readTime,
    date: d.date,
    premium: d.premium,
    appIconUrl: d.appIconUrl ?? "",
  };
}

export async function getAllCaseStudies(): Promise<CaseStudyListing[]> {
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION).get();

  return snapshot.docs
    .filter((doc) => doc.data().status === "published")
    .sort((a, b) => {
      const aTime = a.data().createdAt?.toMillis?.() ?? 0;
      const bTime = b.data().createdAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    })
    .map(toListing);
}

export async function getCaseStudyBySlug(
  slug: string
): Promise<CaseStudyFull | null> {
  const db = getAdminDb();
  const doc = await db.collection(COLLECTION).doc(slug).get();

  if (!doc.exists) return null;

  const d = doc.data()!;
  if (d.status !== "published") return null;

  return {
    slug: doc.id,
    title: d.title,
    tag: d.tag,
    metric: d.metric,
    description: d.description,
    readTime: d.readTime,
    date: d.date,
    premium: d.premium,
    content: d.content,
    metaDescription: d.metaDescription ?? "",
    appIconUrl: d.appIconUrl ?? "",
    appStoreUrl: d.appStoreUrl ?? "",
    screenshotUrls: d.screenshotUrls ?? [],
    externalLinks: d.externalLinks ?? [],
    tiktokEmbeds: d.tiktokEmbeds ?? [],
  };
}

export async function getLatestCaseStudies(
  limit: number
): Promise<CaseStudyListing[]> {
  const all = await getAllCaseStudies();
  return all.slice(0, limit);
}
