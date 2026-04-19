const DEFAULT_GOOGLE_ADS_ID = "AW-18003349000";
const DEFAULT_GOOGLE_ADS_CONVERSION_LABEL = "yUvLCMO1rIUcEIic1YhD";

export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || DEFAULT_GOOGLE_ADS_ID;

export const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL ||
  DEFAULT_GOOGLE_ADS_CONVERSION_LABEL;

export const GOOGLE_ADS_SEND_TO = `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackGoogleAdsConversion = () => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_SEND_TO,
  });
};
