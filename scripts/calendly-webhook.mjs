#!/usr/bin/env node
// Registers the Calendly webhook for this site (one-time setup).
//
//   CALENDLY_TOKEN=xxx node scripts/calendly-webhook.mjs https://your-site.vercel.app/api/webhooks/calendly
//
// Prints the signing key — put it into Vercel as CALENDLY_WEBHOOK_SIGNING_KEY.
// Webhooks require a paid Calendly plan (Standard or higher).
import crypto from "node:crypto";

const token = process.env.CALENDLY_TOKEN;
const url = process.argv[2];
if (!token || !url) {
  console.error("Usage: CALENDLY_TOKEN=<personal access token> node scripts/calendly-webhook.mjs <https://…/api/webhooks/calendly>");
  process.exit(1);
}

const api = async (path, init = {}) => {
  const res = await fetch(`https://api.calendly.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json;
};

const me = await api("/users/me");
const organization = me.resource.current_organization;
const user = me.resource.uri;
const signingKey = crypto.randomBytes(32).toString("hex");

const created = await api("/webhook_subscriptions", {
  method: "POST",
  body: JSON.stringify({
    url,
    events: ["invitee.created", "invitee.canceled"],
    organization,
    user,
    scope: "user",
    signing_key: signingKey,
  }),
});

console.log("Webhook created:", created.resource?.uri);
console.log("\nAdd this to your Vercel environment variables:\n");
console.log(`CALENDLY_WEBHOOK_SIGNING_KEY=${signingKey}\n`);
