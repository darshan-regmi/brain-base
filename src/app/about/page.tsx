import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { noIndexMetadata } from "@/lib/app-metadata";
import { AUTHOR_NAME, AUTHOR_URL, REPO_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  ...noIndexMetadata("About Brain Base"),
  description:
    "About Brain Base: the open-source second brain app, who maintains it, how it is built, and how to get support.",
};

export default function AboutPage() {
  return (
    <TrustPage
      title="About Brain Base"
      intro="Brain Base is an open-source second brain app for notes, focus, daily logs and review. This page is under review before publication."
    >
      <TrustSection title="What Brain Base is">
        <p>
          Brain Base is an MIT-licensed, self-hostable app that keeps notes,
          a focus timer, daily logs, a learning tracker and spaced repetition in
          one workspace. It is free to use and does not have a paid tier.
        </p>
        <p>
          The public site is at{" "}
          <a
            href={SITE_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
          >
            brain-base.darshanregmi.com.np
          </a>
          . The source code is on{" "}
          <a
            href={REPO_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </TrustSection>

      <TrustSection title="Why it exists">
        <p>
          The project started in early 2026. The source code and commit history
          are public on GitHub, so the changes since then can be checked
          directly.
        </p>
      </TrustSection>

      <TrustSection title="Who builds it">
        <p>
          Brain Base is built and maintained by{" "}
          <a
            href={AUTHOR_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="me noopener noreferrer"
          >
            {AUTHOR_NAME}
          </a>
          . More about his work is on GitHub.
        </p>
      </TrustSection>

      <TrustSection title="How it is built">
        <p>
          The app uses Next.js and React on the front end, Prisma with Postgres
          for data, and NextAuth for sign-in. The source is MIT licensed. The
          codebase contains no third-party analytics or telemetry scripts.
        </p>
        <p>
          The hosted instance runs on Vercel. Its Postgres database is hosted by
          Neon in AWS US East 1 (N. Virginia).
        </p>
      </TrustSection>

      <TrustSection title="What it is not">
        <p>
          Brain Base is a single-user tool for notes, focus, daily logs and
          review. It is not a team workspace, a general-purpose database, or a
          native mobile app. There is no sharing or team collaboration feature.
        </p>
      </TrustSection>

      <TrustSection title="Contact" id="contact">
        <p>
          Public support and bug reports go to{" "}
          <a
            href={`${REPO_URL}/issues`}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>
          . For privacy or security reports, open a GitHub issue and ask for a
          private channel; do not include personal or sensitive details in the
          issue. You can also start from the maintainer&apos;s{" "}
          <a
            href={AUTHOR_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="me noopener noreferrer"
          >
            GitHub profile
          </a>
          .
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Support: GitHub Issues</li>
          <li>Privacy and security: request a private channel on GitHub</li>
          <li>Response time: best effort, with no guaranteed response time</li>
          <li>
            Operator: {AUTHOR_NAME}, an individual based in Nepal. No public
            mailing address.
          </li>
        </ul>
        <p>
          The public project home is the{" "}
          <a
            href={REPO_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          .
        </p>
      </TrustSection>
    </TrustPage>
  );
}
