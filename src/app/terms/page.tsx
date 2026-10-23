import type { Metadata } from "next";
import { TrustPage, TrustSection } from "@/components/TrustPage";
import { noIndexMetadata } from "@/lib/app-metadata";

export const metadata: Metadata = {
  ...noIndexMetadata("Terms of use"),
  description:
    "Draft terms of use for Brain Base. Placeholder copy awaiting owner and legal review.",
};

export default function TermsPage() {
  return (
    <TrustPage
      title="Terms of use"
      intro="This is a draft terms page for Brain Base. It is not legal advice, and it is not ready to publish. The owner and a qualified reviewer must confirm every clause below."
    >
      <TrustSection title="Agreement">
        <p>
          These terms would govern use of the hosted Brain Base service at
          [TODO: owner to fill in — final public URL].
        </p>
        <p>
          Operator: [TODO: owner to fill in — legal name or entity]. Jurisdiction:
          [TODO: owner to fill in — country/state].
        </p>
      </TrustSection>

      <TrustSection title="Accounts">
        <p>
          You need an account to use the app. You are responsible for keeping
          your sign-in credentials secure and for activity under your account.
        </p>
        <p>
          [TODO: owner to fill in — eligibility and minimum age, account
          registration rules, and what happens if you suspect unauthorized
          access.]
        </p>
      </TrustSection>

      <TrustSection title="Acceptable use">
        <p>
          [TODO: owner to fill in — the rules for using the service, including
          prohibited content, abuse, attempts to access other users&apos; data, and
          any rate or storage limits.]
        </p>
      </TrustSection>

      <TrustSection title="Your content">
        <p>
          You keep ownership of the notes, logs, uploads and other content you
          create. [TODO: owner/legal to fill in — the permission the operator
          needs to host, process, back up and display that content, and how far
          that permission extends.]
        </p>
        <p>
          [TODO: owner to fill in — how content can be exported or deleted, and
          what happens to it when an account is closed.]
        </p>
      </TrustSection>

      <TrustSection title="Open-source code">
        <p>
          The Brain Base source code is released under the MIT license. That
          license governs use, copying, modification and distribution of the
          code. These terms would cover the hosted service, not the code
          license.
        </p>
        <p>
          [TODO: owner/legal to fill in — confirm how the hosted service and the
          MIT-licensed code interact, especially if someone self-hosts.]
        </p>
      </TrustSection>

      <TrustSection title="Availability and changes">
        <p>
          [TODO: owner to fill in — whether the service is provided as-is, any
          uptime commitment, maintenance windows, and the right to change or
          discontinue features.]
        </p>
      </TrustSection>

      <TrustSection title="Disclaimers and liability">
        <p>
          [TODO: owner/legal to fill in — warranty disclaimers, limitation of
          liability, and any mandatory consumer rights that cannot be excluded
          in your jurisdiction.]
        </p>
      </TrustSection>

      <TrustSection title="Termination">
        <p>
          [TODO: owner/legal to fill in — when access can be suspended or
          terminated, notice, and what happens to the data afterwards.]
        </p>
      </TrustSection>

      <TrustSection title="Governing law and contact">
        <p>
          Governing law: [TODO: owner/legal to fill in — jurisdiction]. Venue:
          [TODO: owner/legal to fill in — if applicable].
        </p>
        <p>
          Contact: [TODO: owner to fill in — monitored contact email or support
          URL].
        </p>
        <p>
          Effective date: [TODO: owner to fill in — date the final terms take
          effect].
        </p>
      </TrustSection>
    </TrustPage>
  );
}
