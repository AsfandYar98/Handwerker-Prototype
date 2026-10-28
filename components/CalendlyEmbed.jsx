"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

function loadScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (window.__calendlyLoading) return window.__calendlyLoading;
  window.__calendlyLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Calendly konnte nicht geladen werden."));
    document.head.appendChild(s);
  });
  return window.__calendlyLoading;
}

/**
 * Inline Calendly scheduler. Calls onScheduled({ eventUri, inviteeUri }) when the
 * visitor completes a booking. Calendly then emails the confirmation and the
 * meeting link to both the visitor and the company.
 */
export default function CalendlyEmbed({ url, onScheduled }) {
  const ref = useRef(null);
  const cb = useRef(onScheduled);
  const [error, setError] = useState("");
  cb.current = onScheduled;

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.Calendly) return;
        ref.current.innerHTML = "";
        window.Calendly.initInlineWidget({ url, parentElement: ref.current });
      })
      .catch((e) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [url]);

  useEffect(() => {
    function onMessage(e) {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data || {};
      if (data.event === "calendly.event_scheduled") {
        const p = data.payload || {};
        cb.current?.({ eventUri: p.event?.uri, inviteeUri: p.invitee?.uri });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (error) {
    return (
      <p className="alert" role="alert">
        {error} Bitte laden Sie die Seite neu oder rufen Sie uns an.
      </p>
    );
  }
  return <div ref={ref} className="calendly-frame" aria-label="Terminauswahl von Calendly" />;
}
