import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brain Base — Your Second Brain",
  description:
    "An open-source second brain app — notes, focus timer, daily logs & learning tracker. No subscriptions. No noise. Just Clarity.",
  metadataBase: new URL("https://brainbase.pages.dev"),
  openGraph: {
    title: "Brain Base — Your Second Brain",
    description:
      "An open-source second brain app — notes, focus timer, daily logs & learning tracker. No subscriptions. No noise.",
    url: "https://brainbase.pages.dev",
    siteName: "Brain Base",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
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
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
