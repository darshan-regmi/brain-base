import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { noIndexMetadata } from "@/lib/app-metadata";

export const metadata: Metadata = {
  ...noIndexMetadata("Privacy policy"),
  description:
    "Draft privacy policy for Brain Base. Placeholder copy awaiting owner and legal review.",
};

export default function PrivacyPage() {
  return (
    <TrustPage
      title="Privacy policy"
      intro="This is a draft privacy policy for Brain Base. It is not legal advice, and it is not ready to publish. The owner and a qualified reviewer must confirm every statement below."
    >
      <TrustSection title="Who is responsible">
        <p>
          Data controller: [TODO: owner to fill in — legal name or entity]
        </p>
        <p>
          Contact: [TODO: owner to fill in — monitored privacy contact email]
        </p>
        <p>Jurisdiction: [TODO: owner to fill in — country/state]</p>
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
          [TODO: owner to fill in — confirm this list matches the deployed
          instance and add anything else you collect, including server or
          hosting logs.]
        </p>
      </TrustSection>

      <TrustSection title="Why it is stored">
        <p>
          The data is used to provide the app: authenticate you, save and
          display your notes and logs, run the focus timer and review schedule,
          store uploaded files, and keep your session active.
        </p>
        <p>
          [TODO: owner to fill in — add any other purpose, such as support,
          security, or aggregate usage reporting. Do not claim a purpose you do
          not actually have.]
        </p>
      </TrustSection>

      <TrustSection title="Where it is stored">
        <p>
          Data is stored in the Postgres database configured by the operator of
          the instance. On the public hosted instance, the database host and
          region are: [TODO: owner to fill in — provider and region].
        </p>
        <p>
          Authentication can use email/password, GitHub, or Google. The
          providers enabled on the hosted instance are: [TODO: owner to fill in
          — list only the providers actually enabled].
        </p>
        <p>
          At the time of writing, the codebase contains no third-party analytics
          or telemetry scripts. [TODO: owner to fill in — confirm this is still
          true for the deployed instance and disclose any hosting/CDN logs.]
        </p>
      </TrustSection>

      <TrustSection title="Cookies and local storage">
        <p>
          Brain Base uses a session cookie to keep you signed in. The theme
          preference is stored locally in your browser.
        </p>
        <p>
          [TODO: owner to fill in — confirm there are no advertising or
          third-party cookies, and list any added later.]
        </p>
      </TrustSection>

      <TrustSection title="Retention and deletion">
        <p>
          [TODO: owner to fill in — how long account data and content are kept,
          what happens when an account is deleted, whether backups retain data,
          and how someone can request deletion.]
        </p>
      </TrustSection>

      <TrustSection title="Your rights">
        <p>
          [TODO: owner to fill in — the rights available in your jurisdiction
          (for example access, correction, deletion, portability, objection),
          how to exercise them, and how identity is verified.]
        </p>
        <p>
          [TODO: owner to fill in — international transfer safeguards, if
          applicable.]
        </p>
      </TrustSection>

      <TrustSection title="Changes and contact">
        <p>
          Effective date: [TODO: owner to fill in — date the final policy takes
          effect].
        </p>
        <p>
          [TODO: owner to fill in — how material changes will be announced.]
        </p>
        <p>
          Privacy contact: [TODO: owner to fill in — monitored email or support
          URL].
        </p>
      </TrustSection>
    </TrustPage>
  );
}
