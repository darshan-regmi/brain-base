import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RegisterSW } from "@/components/app/RegisterSW";
import { Providers } from "@/components/app/Providers";
import { ThemeProvider } from "@/components/app/ThemeProvider";

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
  metadataBase: new URL("https://brainbase.pages.dev"),
  applicationName: "Brain Base",
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
  icons: { icon: "/favicon.ico" },
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
