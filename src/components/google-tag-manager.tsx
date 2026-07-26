"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { readConsentCookie, subscribeToConsentChange } from "@/lib/consent/cookie";

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;

function getSnapshot() {
  return readConsentCookie() === "granted";
}

// No cookie exists during SSR — always assume not-yet-granted server-side;
// useSyncExternalStore reconciles the real client value after hydration.
function getServerSnapshot() {
  return false;
}

/**
 * Google Tag Manager foundation (JOB-AGT-WEB-20260726-M4.6). This is the
 * single loader GA4, Google Ads conversion tracking, and any other
 * Google measurement tag get configured through — as tags/triggers
 * inside the GTM container itself, never as separate hardcoded scripts
 * in this codebase (see docs/google-ecosystem-setup.md). Renders nothing
 * unless BOTH conditions hold: `NEXT_PUBLIC_GTM_CONTAINER_ID` is set (it
 * isn't, in this repo — no GTM container exists yet) AND the visitor has
 * granted cookie consent via `ConsentBanner`. No ID is ever invented
 * here; the env var must be supplied by the owner once a real container
 * exists.
 */
export function GoogleTagManager() {
  const consentGranted = useSyncExternalStore(subscribeToConsentChange, getSnapshot, getServerSnapshot);

  if (!GTM_CONTAINER_ID || !consentGranted) {
    return null;
  }

  return (
    <>
      <Script id="gtm-loader" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
