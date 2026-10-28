"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelBooking({ id, token, lang, labels }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const qs = new URLSearchParams({ t: token, lang });
      const res = await fetch(`/api/bookings/${id}?${qs}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      // 4xx messages come localised from the API; anything else gets the generic text.
      if (!res.ok) throw new Error((res.status < 500 && data.error) || labels.failed);
      router.refresh();
    } catch (e) {
      setError(e.message || labels.failed);
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>
        {labels.button}
      </button>
    );
  }
  return (
    <div>
      <p style={{ marginBottom: 12, fontWeight: 600 }}>{labels.confirm}</p>
      <div className="actions">
        <button type="button" className="btn btn-danger" disabled={busy} onClick={cancel}>
          {busy ? labels.busy : labels.yes}
        </button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setConfirming(false)}>
          {labels.keep}
        </button>
      </div>
      {error && (
        <p className="alert" role="alert" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}
