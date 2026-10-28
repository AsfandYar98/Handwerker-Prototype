import { getBlockedDates, setBlockedDates } from "@/lib/store";
import { isValidDate } from "@/lib/time";
import { isAdmin, json, unauthorized } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return json({ blocked: await getBlockedDates() });
}

// POST { date } adds a closed day; DELETE { date } removes it.
export async function POST(request) {
  if (!(await isAdmin())) return unauthorized();
  const { date } = await request.json().catch(() => ({}));
  if (!isValidDate(date)) return json({ error: "Ungültiges Datum." }, 400);
  const blocked = await setBlockedDates([...(await getBlockedDates()), date]);
  return json({ blocked });
}

export async function DELETE(request) {
  if (!(await isAdmin())) return unauthorized();
  const { date } = await request.json().catch(() => ({}));
  const blocked = await setBlockedDates((await getBlockedDates()).filter((d) => d !== date));
  return json({ blocked });
}
