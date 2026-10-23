import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { noIndexMetadata } from "@/lib/app-metadata";
import { AUTHOR_NAME, AUTHOR_URL, REPO_URL, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  ...noIndexMetadata("Terms of use"),
  description:
    "Terms of use for the hosted Brain Base service, covering accounts, acceptable use, content, availability, and liability.",
};

export default function TermsPage() {
  return (
    <TrustPage
      title="Terms of use"
      intro="These terms govern the hosted Brain Base service. They are under review before publication and are not legal advice."
    >
      <TrustSection title="Agreement">
        <p>
          These terms govern use of the hosted Brain Base service at{" "}
          <a
            href={SITE_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
          >
            brain-base.darshanregmi.com.np
          </a>
          .
        </p>
        <p>
          Operator: {AUTHOR_NAME}, an individual based in Nepal. Jurisdiction:
          Nepal.
        </p>
      </TrustSection>

      <TrustSection title="Accounts">
        <p>
          You need an account to use the app. You are responsible for keeping
          your sign-in credentials secure and for activity under your account.
        </p>
        <p>
          There is no stated minimum age. You are responsible for ensuring that
          you can lawfully use the service where you live. If you suspect
          unauthorized access, open a GitHub issue and ask for a private channel.
          Do not include sensitive details in the issue.
        </p>
      </TrustSection>

      <TrustSection title="Acceptable use">
        <p>You may not use the service to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>break the law or violate another person&apos;s rights;</li>
          <li>
            access another user&apos;s account or data without permission;
          </li>
          <li>
            upload malware, run denial-of-service attacks, or interfere with the
            service;
          </li>
          <li>
            send spam, scrape at a disruptive rate, or place unreasonable load
            on the service.
          </li>
        </ul>
        <p>
          The service may enforce reasonable technical limits, including the
          25 MB upload limit described in the app.
        </p>
      </TrustSection>

      <TrustSection title="Your content">
        <p>
          You keep ownership of the notes, logs, uploads and other content you
          create. You grant the operator a non-exclusive, worldwide licence to
          host, process, back up, and display that content solely to operate the
          service. That licence ends when the content is deleted, except for
          copies retained in backups or as required by law.
        </p>
        <p>
          Notes, learning resources, and review cards can be deleted
          individually in the app. Full account deletion and data export are
          handled by request through GitHub; ask for a private channel without
          posting personal data. See the Privacy Policy for retention details.
        </p>
      </TrustSection>

      <TrustSection title="Open-source code">
        <p>
          The Brain Base source code is released under the MIT license. That
          license governs use, copying, modification and distribution of the
          code. These terms cover the hosted service, not the code license.
        </p>
        <p>
          If you self-host Brain Base, you operate your own instance and are
          responsible for its data, security and legal compliance.
        </p>
      </TrustSection>

      <TrustSection title="Availability and changes">
        <p>
          The hosted service is provided as-is. There is no uptime guarantee.
          Features may change, be suspended, or be discontinued, and maintenance
          may interrupt access. The operator will give notice of material
          changes where practical.
        </p>
      </TrustSection>

      <TrustSection title="Disclaimers and liability">
        <p>
          To the fullest extent permitted by Nepal law, the service is provided
          without warranties of any kind, and the operator is not liable for
          indirect, incidental, special, or consequential damages, or for lost
          data or profits. Nothing in these terms excludes liability that cannot
          lawfully be excluded.
        </p>
      </TrustSection>

      <TrustSection title="Termination">
        <p>
          Access may be suspended or terminated for abuse, illegal use, a
          security risk, or a violation of these terms. Notice will be given
          where practical. Data is handled after termination as described in the
          Privacy Policy.
        </p>
      </TrustSection>

      <TrustSection title="Governing law and contact">
        <p>
          Governing law: Nepal. Venue: the courts of Nepal.
        </p>
        <p>
          Public support and general contact:{" "}
          <a
            href={`${REPO_URL}/issues`}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>
          . For privacy or security reports, open a GitHub issue and ask for a
          private channel; do not post sensitive details in the issue. You can
          also start from the maintainer&apos;s{" "}
          <a
            href={AUTHOR_URL}
            className="underline decoration-[#c8c4be] underline-offset-2 hover:text-ink"
            rel="me noopener noreferrer"
          >
            GitHub profile
          </a>
          .
        </p>
        <p>Effective when published. Last updated 23 October 2026.</p>
      </TrustSection>
    </TrustPage>
  );
}
