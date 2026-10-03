import type { Metadata } from "next";
import { auth } from "@/auth";
import BrainBase from "@/components/landing";
import { REPO_URL, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

const DESCRIPTION =
  "An open-source second brain app — notes, focus timer, daily logs & learning tracker. No subscriptions. No noise. Just clarity.";

export const metadata: Metadata = {
  // Declared per-route rather than in the root layout, which every other route
  // inherits — this is the only page on the site that should canonicalise here.
  alternates: { canonical: "/" },
};

function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: absoluteUrl("/favicon-512.png"),
          contentUrl: absoluteUrl("/favicon-512.png"),
          width: 512,
          height: 512,
        },
        image: { "@id": `${SITE_URL}/#logo` },
        sameAs: [REPO_URL],
      },
      {
        // Qualifies for a rich result: it is a downloadable, free,
        // open-source web application.
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        description: DESCRIPTION,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web, iOS, Android",
        softwareVersion: "1.0.0",
        featureList: [
          "Notes with backlinks and tags",
          "Pomodoro focus timer",
          "Daily logs",
          "Spaced-repetition learning tracker",
          "Graph-based knowledge base",
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        image: absoluteUrl("/og-image.png"),
        screenshot: absoluteUrl("/og-image.png"),
        license: "https://opensource.org/licenses/MIT",
        codeRepository: REPO_URL,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function Home() {
  const session = await auth();
  const isAuthed = !!session?.user?.id;
  const firstName = session?.user?.name?.split(" ")[0] ?? null;

  return (
    <>
      <JsonLd />
      <BrainBase isAuthed={isAuthed} firstName={firstName} />
    </>
  );
}