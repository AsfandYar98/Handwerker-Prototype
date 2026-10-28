import { notFound } from "next/navigation";

// Unmatched paths below a valid language (/en/foo) render the localised
// not-found page instead of the global German one.
export default function UnknownPath() {
  notFound();
}
