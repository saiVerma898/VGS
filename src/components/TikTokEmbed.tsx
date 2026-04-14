"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    tiktokEmbedLoaded?: boolean;
  }
}

function loadTikTokScript() {
  if (typeof window === "undefined") return;
  if (window.tiktokEmbedLoaded) return;

  const existing = document.querySelector(
    'script[src="https://www.tiktok.com/embed.js"]'
  );
  if (existing) return;

  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  document.body.appendChild(script);
  window.tiktokEmbedLoaded = true;
}

interface TikTokEmbedProps {
  embedHtml: string;
  url: string;
  title: string;
  authorName: string;
  thumbnailUrl: string;
}

export default function TikTokEmbed({
  embedHtml,
  url,
  title,
  authorName,
  thumbnailUrl,
}: TikTokEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedHtml && containerRef.current) {
      containerRef.current.innerHTML = embedHtml;
      loadTikTokScript();
      // Re-trigger TikTok embed processing
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tiktok = (window as any).tiktokEmbed;
        if (tiktok?.lib?.render) {
          tiktok.lib.render();
        }
      }, 500);
    }
  }, [embedHtml]);

  // If we have embed HTML, render it
  if (embedHtml) {
    return (
      <div
        ref={containerRef}
        className="my-6 flex justify-center [&>blockquote]:max-w-[325px]"
      />
    );
  }

  // Fallback: link card with thumbnail
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-6 border-2 border-foreground hover:bg-cream transition-colors group"
    >
      <div className="flex items-center gap-4 p-4">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-highlight mb-1">
            TikTok
          </div>
          <p className="text-sm font-bold truncate group-hover:text-muted transition-colors">
            {title || `Watch on TikTok`}
          </p>
          {authorName && (
            <p className="text-xs text-muted">@{authorName}</p>
          )}
        </div>
        <svg
          className="w-5 h-5 text-muted shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </a>
  );
}
