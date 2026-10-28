"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelBooking({ id, token }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${id}?t=${encodeURIComponent(token)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Absage hat nicht geklappt.");
      router.refresh();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  if (!confirming) {
    return (
      <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>
        Termin absagen
      </button>
    );
  }
  return (
    <div>
      <p style={{ marginBottom: 12, fontWeight: 600 }}>Wirklich absagen? Der Termin wird für andere freigegeben.</p>
      <div className="actions">
        <button type="button" className="btn btn-danger" disabled={busy} onClick={cancel}>
          {busy ? "Wird abgesagt …" : "Ja, Termin absagen"}
        </button>
        <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => setConfirming(false)}>
          Termin behalten
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
