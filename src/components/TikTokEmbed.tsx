"use client";

import { useEffect, useRef, useState } from "react";

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!embedHtml || !containerRef.current) return;

    // Inject the embed HTML
    containerRef.current.innerHTML = embedHtml;

    // Remove any existing TikTok scripts to force re-init
    const oldScripts = document.querySelectorAll('script[src*="tiktok.com/embed"]');
    oldScripts.forEach((s) => s.remove());

    // Add a fresh TikTok embed script
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [embedHtml]);

  // If we have embed HTML, render the actual TikTok player
  if (embedHtml) {
    return (
      <div className="my-4">
        <div
          ref={containerRef}
          className={`flex justify-center transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-50"}`}
          style={{ minHeight: "400px" }}
        />
      </div>
    );
  }

  // Fallback: link card
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-4 border-2 border-foreground hover:bg-cream transition-colors group"
    >
      <div className="flex items-center gap-4 p-4 sm:p-5">
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-20 h-20 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-highlight mb-1">
            TikTok
          </div>
          <p className="text-base font-bold truncate group-hover:text-muted transition-colors">
            {title || "Watch on TikTok"}
          </p>
          {authorName && (
            <p className="text-sm text-muted">@{authorName}</p>
          )}
        </div>
        <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
}
