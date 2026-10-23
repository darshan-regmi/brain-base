import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { noIndexMetadata } from "@/lib/app-metadata";
import { AUTHOR_NAME, AUTHOR_URL, REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  ...noIndexMetadata("Privacy policy"),
  description:
    "Privacy policy for the hosted Brain Base service, covering what is stored, why, where, and how to request deletion.",
};

export default function PrivacyPage() {
  return (
    <TrustPage
      title="Privacy policy"
      intro="This policy describes how the hosted Brain Base service handles personal data. It is under review before publication and is not legal advice."
    >
      <TrustSection title="Who is responsible">
        <p>
          Data controller: {AUTHOR_NAME}, an individual based in Nepal.
        </p>
        <p>
          Public support:{" "}
          <a
            href={`${REPO_URL}/issues`}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>
          . For privacy requests, open a GitHub issue and ask for a private
          channel; do not post personal data in the issue. You can also start
          from the maintainer&apos;s{" "}
          <a
            href={AUTHOR_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="me noopener noreferrer"
          >
            GitHub profile
          </a>
          .
        </p>
        <p>Jurisdiction: Nepal.</p>
        <p>
          If you self-host Brain Base, you are the operator of your instance and
          are responsible for its privacy practices.
        </p>
      </TrustSection>

      <TrustSection title="What the app stores">
        <p>When you create an account and use Brain Base, the app can store:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Account details: name, email address, profile image, and a hashed
            password. If you sign in with GitHub or Google, the app stores the
            provider account ID and the tokens needed for sign-in.
          </li>
          <li>
            Content you create: notes, tags, wikilinks, daily logs (including
            mood and energy values), learning resources, review cards, and focus
            session records.
          </li>
          <li>
            Uploaded files: PDF, DOC, DOCX, PPT, and PPTX files up to 25 MB,
            stored as bytes in the database.
          </li>
          <li>
            Session data: a session token and expiry used to keep you signed in.
          </li>
        </ul>
        <p>
          Vercel, the hosting provider, processes standard request logs such as
          IP address, user agent, and request time for security and operations.
        </p>
      </TrustSection>

      <TrustSection title="Why it is stored">
        <p>
          The data is used to provide the app: authenticate you, save and
          display your notes and logs, run the focus timer and review schedule,
          store uploaded files, and keep your session active. Request logs are
          used for security, abuse prevention, and troubleshooting.
        </p>
        <p>
          The hosted instance does not use your content for advertising, does
          not sell it, and does not run third-party analytics or telemetry.
        </p>
      </TrustSection>

      <TrustSection title="Where it is stored">
        <p>
          Data is stored in the Postgres database configured by the operator of
          the instance. On the public hosted instance, the database is hosted by
          Neon in AWS US East 1 (N. Virginia), and the app runs on Vercel.
        </p>
        <p>
          Authentication can use email/password, GitHub, or Google. All three
          are enabled on the hosted instance.
        </p>
        <p>
          The codebase contains no third-party analytics or telemetry scripts.
          Vercel processes the standard request logs described above.
        </p>
      </TrustSection>

      <TrustSection title="Cookies and local storage">
        <p>
          Brain Base uses a session cookie to keep you signed in. The theme
          preference is stored locally in your browser.
        </p>
        <p>
          The hosted instance does not use advertising cookies or third-party
          analytics cookies.
        </p>
      </TrustSection>

      <TrustSection title="Retention and deletion">
        <p>
          Account data and content are kept until you delete them or request
          account deletion. Notes, learning resources, and review cards can be
          deleted individually in the app. Full account deletion and data export
          are handled by request through GitHub; ask for a private channel without
          posting personal data.
        </p>
        <p>
          Neon provides the database&apos;s default backup retention. Deleted
          data may remain in those backups until they expire. The operator may
          need to verify your identity before acting on a deletion or export
          request.
        </p>
      </TrustSection>

      <TrustSection title="Your rights">
        <p>
          You can request access to, correction of, export of, or deletion of
          your personal data through GitHub, asking for a private channel. You may
          also have additional rights under the law that applies to you. Requests
          are handled on a best-effort basis.
        </p>
        <p>
          The production database is in the United States. If you use the
          service from another country, your data is transferred to and
          processed there. Contact the operator for details about the safeguards
          that apply.
        </p>
      </TrustSection>

      <TrustSection title="Changes and contact">
        <p>
          Effective when published. Last updated 23 October 2026.
        </p>
        <p>
          Material changes will be posted on this page and noted in the GitHub
          repository. There is no mailing list, so check this page for updates.
        </p>
        <p>
          Privacy contact: ask for a private channel on the maintainer&apos;s{" "}
          <a
            href={AUTHOR_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="me noopener noreferrer"
          >
            GitHub profile
          </a>
          . Public support:{" "}
          <a
            href={`${REPO_URL}/issues`}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>
          .
        </p>
      </TrustSection>
    </TrustPage>
  );
}
