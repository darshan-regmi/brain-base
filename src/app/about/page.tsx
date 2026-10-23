import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { noIndexMetadata } from "@/lib/app-metadata";

export const metadata: Metadata = {
  ...noIndexMetadata("About Brain Base"),
  description:
    "Draft About page for Brain Base. Placeholder copy awaiting owner facts.",
};

export default function AboutPage() {
  return (
    <TrustPage
      title="About Brain Base"
      intro="Brain Base is an open-source second brain app for notes, focus, daily logs and review. This page is a draft: the project story, author bio and contact details still need the owner's real facts."
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
            href="https://brain-base.darshanregmi.com.np/"
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
          >
            brain-base.darshanregmi.com.np
          </a>
          . The source code is on{" "}
          <a
            href="https://github.com/darshan-regmi/brain-base"
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
          The project started from a simple frustration: juggling five different
          tools just to stay on top of the day. Brain Base is an attempt to make
          that loop quieter — capture a thought, focus on one thing, write the
          day down, and review what is worth keeping.
        </p>
        <p>
          [TODO: owner to fill in — when you started the project, what the first
          version did, and what changed since then. Real dates and details only.]
        </p>
      </TrustSection>

      <TrustSection title="Who builds it">
        <p>
          Brain Base is built by{" "}
          <a
            href="https://github.com/darshan-regmi"
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="me noopener noreferrer"
          >
            Darshan Regmi
          </a>
          .
        </p>
        <p>
          [TODO: owner to fill in — a short first-person bio: what you work on,
          your role on this project, and anything you want public. Add a photo
          only if you want one published.]
        </p>
      </TrustSection>

      <TrustSection title="How it is built">
        <p>
          The app uses Next.js and React on the front end, Prisma with Postgres
          for data, and NextAuth for sign-in. The source is MIT licensed. The
          codebase contains no third-party analytics or telemetry scripts at the
          time of writing.
        </p>
        <p>
          [TODO: owner to fill in — confirm the production database host and
          region if you want them named here.]
        </p>
      </TrustSection>

      <TrustSection title="What it is not">
        <p>
          Brain Base is a single-user tool for notes, focus, daily logs and
          review. It is not a team workspace, a general-purpose database, or a
          native mobile app.
        </p>
        <p>
          [TODO: owner to fill in — confirm the single-user description and add
          any limits you want stated publicly.]
        </p>
      </TrustSection>

      <TrustSection title="Contact" id="contact">
        <p>
          These contact details are placeholders. Do not publish this page until
          they are real and monitored.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Email: [TODO: owner to fill in — monitored contact email]
          </li>
          <li>
            Support: [TODO: owner to fill in — GitHub Issues or Discussions URL]
          </li>
          <li>
            Security reports: [TODO: owner to fill in — private security contact]
          </li>
          <li>
            Response time: [TODO: owner to fill in — only if you can commit to
            one]
          </li>
          <li>
            Legal entity and mailing address: [TODO: owner to fill in — if
            required in your jurisdiction]
          </li>
        </ul>
        <p>
          For now, the public project home is the{" "}
          <a
            href="https://github.com/darshan-regmi/brain-base"
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
