export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "section_jump"
  | "scroll_depth"
  | "language_switch"
  | "lead_submit"
  | "lead_submit_error";

type AnalyticsPayload = {
  event: AnalyticsEventName;
  timestamp: string;
} & Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    __neurotradeEvents?: AnalyticsPayload[];
  }
}

export function trackEvent(
  event: AnalyticsEventName,
  payload: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;

  const analyticsPayload: AnalyticsPayload = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  window.dataLayer?.push(analyticsPayload);
  window.gtag?.("event", event, payload);
  window.__neurotradeEvents = [
    ...(window.__neurotradeEvents ?? []),
    analyticsPayload,
  ].slice(-200);

  window.dispatchEvent(
    new CustomEvent("neurotrade:analytics", { detail: analyticsPayload })
  );
}
