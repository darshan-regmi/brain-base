import type { Metadata } from "next";
import { noIndexMetadata } from "@/lib/app-metadata";

/** page.tsx is a client component, so its metadata lives here instead. */
export const metadata: Metadata = noIndexMetadata("Sign in");

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
