import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brain Base",
    short_name: "BB",
    description:
      "Open-source second brain — notes, focus timer, daily logs, learning tracker.",
    // Was "/dashboard", which bounces an anonymous visitor straight into the
    // sign-in redirect. The landing page is the correct install target.
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    orientation: "portrait",
    categories: ["productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      // Served from public/icon-192.png and public/icon-512.png. These files
      // did not exist before — the manifest pointed at names that were never
      // committed, so the PWA icon always 404'd.
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Capture",
        short_name: "Capture",
        url: "/notes/new",
        description: "New blank note",
      },
      {
        name: "Focus",
        short_name: "Focus",
        url: "/focus",
        description: "Start a Pomodoro",
      },
      {
        name: "Daily Log",
        short_name: "Log",
        url: "/log",
        description: "Today's journal",
      },
    ],
  };
}