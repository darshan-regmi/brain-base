import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/app-metadata";

/**
 * Scoped to this segment so it also covers any child route added later
 * (e.g. /notes/[id]) without those needing their own declaration.
 */
export const metadata: Metadata = noIndexMetadata("Notes");

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
