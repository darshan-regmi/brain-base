import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RegisterSW } from "@/components/app/RegisterSW";
import { Providers } from "@/components/app/Providers";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import { REPO_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brain Base — Your Second Brain",
  description:
    "An open-source second brain app — notes, focus timer, daily logs & learning tracker. No subscriptions. No noise. Just clarity.",
  // Resolves relative OG/canonical/icon URLs. Was hard-coded to
  // https://brainbase.pages.dev, which is not the deployed host.
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  // No `alternates.canonical` here on purpose: root-layout metadata is
  // inherited by every route, so declaring it up here would tag /sign-in and
  // the session-gated routes as duplicates of the homepage. The landing page
  // (app/page.tsx) declares its own.
  authors: [{ name: "Darshan Regmi", url: REPO_URL }],
  creator: "Darshan Regmi",
  keywords: [
    "second brain",
    "open source notes app",
    "pomodoro timer",
    "focus timer",
    "spaced repetition",
    "daily journal",
    "knowledge base",
    "self hosted",
    "productivity app",
  ],
  openGraph: {
    title: "Brain Base — Your Second Brain",
    description:
      "An open-source second brain app — notes, focus timer, daily logs & learning tracker. No subscriptions. No noise.",
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
    title: "Brain Base — Your Second Brain",
    description:
      "An open-source second brain app — notes, focus timer, daily logs & learning tracker. No subscriptions. No noise.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#191919" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set theme class before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t==='dark'||((t==='system'||!t)&&s);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-canvas text-ink`}
      >
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
