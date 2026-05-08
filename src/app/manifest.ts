import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Brain Base",
    short_name: "BB",
    description:
      "Open-source second brain — notes, focus timer, daily logs, learning tracker.",
    start_url: "/dashboard",
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
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
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
