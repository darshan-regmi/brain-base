import type { Metadata } from "next";
import { auth } from "@/auth";
import BrainBase from "@/components/landing";
import { JsonLd } from "@/components/JsonLd";
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

const TITLE = "Open-source second brain app for notes & focus | Brain Base";

export const metadata: Metadata = {
  // Declared per-route rather than in the root layout, which every other route
  // inherits — this is the only page on the site that should canonicalise here.
  title: TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brain Base — an open-source second brain app",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
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
        founder: { "@id": `${SITE_URL}/#person` },
        sameAs: [AUTHOR_URL, REPO_URL],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        url: AUTHOR_URL,
        sameAs: [AUTHOR_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: TITLE,
        description: SITE_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#app` },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Web",
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
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        image: absoluteUrl("/og-image.png"),
        license: "https://opensource.org/licenses/MIT",
        codeRepository: REPO_URL,
      },
    ],
  };
}

export default async function Home() {
  const session = await auth();
  const isAuthed = !!session?.user?.id;
  const firstName = session?.user?.name?.split(" ")[0] ?? null;

  return (
    <>
      <JsonLd data={jsonLd()} />
      <BrainBase isAuthed={isAuthed} firstName={firstName} />
    </>
  );
}
