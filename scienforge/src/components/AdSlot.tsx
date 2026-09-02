"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

type Props = {
  /** Ad unit ID from your AdSense dashboard. */
  slot: string;
  format?: string;
  className?: string;
};

/**
 * Renders nothing at all until NEXT_PUBLIC_ADSENSE_CLIENT is set.
 * That keeps the site clean while you are waiting for approval —
 * AdSense rejects sites that show broken or empty ad containers.
 */
export default function AdSlot({ slot, format = "auto", className = "" }: Props) {
  useEffect(() => {
    if (!SITE.adsenseClient) return;
    try {
      // @ts-expect-error injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocker or script not loaded */
    }
  }, []);

  if (!SITE.adsenseClient) return null;

  return (
    <div className={`my-8 ${className}`}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={SITE.adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
