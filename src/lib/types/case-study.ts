import { Timestamp } from "firebase-admin/firestore";

export interface TikTokEmbed {
  url: string;
  embedHtml: string;
  thumbnailUrl: string;
  authorName: string;
  title: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface CaseStudyDoc {
  slug: string;
  title: string;
  tag: string;
  metric: string;
  description: string;
  readTime: string;
  date: string;
  premium: boolean;
  content: string[];
  status: "draft" | "published" | "failed";
  createdAt: Timestamp;
  publishedAt: Timestamp | null;
  sourceApp: string;
  sourceTweetId: string | null;
  gatheredData: GatheredData | null;
  tweetId: string | null;
  tweetedAt: Timestamp | null;
  metaDescription: string;
  appIconUrl: string;
  appStoreUrl: string;
  screenshotUrls: string[];
  externalLinks: ExternalLink[];
  creatorScript: string;
  tiktokEmbeds: TikTokEmbed[];
}

export interface GatheredData {
  appName: string;
  appDescription: string;
  category: string;
  developer: string;
  appStoreUrl: string;
  appIconUrl: string;
  screenshotUrls: string[];
  estimatedDownloads: string;
  estimatedRevenue: string;
  tiktokStrategy: string;
  tiktokMetrics: string;
  rawTweetText: string;
  tiktokEmbeds: TikTokEmbed[];
}

export interface CaseStudyListing {
  slug: string;
  title: string;
  tag: string;
  metric: string;
  description: string;
  readTime: string;
  date: string;
  premium: boolean;
  appIconUrl?: string;
}

export interface CaseStudyFull extends CaseStudyListing {
  content: string[];
  metaDescription: string;
  appIconUrl: string;
  appStoreUrl: string;
  screenshotUrls: string[];
  externalLinks: ExternalLink[];
  tiktokEmbeds: TikTokEmbed[];
}

export interface ProcessedTweetDoc {
  tweetId: string;
  articleSlug: string | null;
  processedAt: Timestamp;
  status: "success" | "failed";
  error: string | null;
}

export interface PipelineRunDoc {
  startedAt: Timestamp;
  completedAt: Timestamp | null;
  status: "running" | "completed" | "failed";
  tweetsFetched: number;
  articlesGenerated: number;
  articlesFailed: number;
  tweetsPosted: number;
  errors: string[];
}
