import Link from "next/link";
import { Wordmark } from "./ui";

/**
 * Shell for the draft trust pages. Every page using this is noindexed and
 * excluded from the sitemap until the owner replaces the TODO markers.
 */
export function TrustPage({
  title,
  intro,
  children,
  showDraftNotice = true,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
  showDraftNotice?: boolean;
}) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <Wordmark size="md" />
          <Link
            href="/"
            className="text-sm text-steel transition-colors hover:text-ink"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {showDraftNotice && (
          <div
            role="note"
            className="mb-8 rounded-md border border-[#e5e3df] bg-[#fef7d6] px-4 py-3 text-sm leading-6 text-[#37352f]"
          >
            <strong className="font-semibold">Draft placeholder.</strong> This
            page is noindexed and excluded from the sitemap. Replace every{" "}
            <code className="rounded bg-white/70 px-1 py-0.5 text-[13px]">
              [TODO: owner to fill in]
            </code>{" "}
            before publishing, then remove the noindex rule, remove this notice
            and add the page to the sitemap.
          </div>
        )}

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-[17px] leading-7 text-steel">{intro}</p>

        <div className="mt-10 space-y-10">{children}</div>
      </main>

      <footer className="border-t border-hairline px-6 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 text-sm text-steel sm:flex-row sm:items-center sm:justify-between">
          <span>Brain Base · MIT licensed</span>
          <nav aria-label="Trust pages" className="flex gap-4">
            <Link href="/about" className="transition-colors hover:text-ink">
              About
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export function TrustSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-[#37352f]">
        {children}
      </div>
    </section>
  );
}
