"use client";

import { useState } from "react";

export default function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/admin";
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error || "Anmeldung fehlgeschlagen.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 16 }}>
      <div className="field">
        <label htmlFor="pw">Passwort</label>
        <input
          id="pw"
          className="input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={error ? "true" : undefined}
          required
        />
        {error && <span className="field-error">{error}</span>}
      </div>
      <button className="btn" type="submit" disabled={busy}>
        {busy ? "Wird angemeldet …" : "Anmelden"}
      </button>
    </form>
  );
}
