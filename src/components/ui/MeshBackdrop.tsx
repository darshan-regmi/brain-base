"use client";

import type { ComponentProps } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

/* The shader lib's TS types don't accept `wireframe` even though the runtime
   honours it. Strip backgroundColor from prop forwarding to silence its noisy
   re-export; everything else flows straight through. */
type MeshProps = Omit<ComponentProps<typeof MeshGradient>, "backgroundColor"> & {
  backgroundColor?: string;
  wireframe?: string;
};

const SafeMeshGradient = (props: MeshProps) => <MeshGradient {...props} />;

type Theme = "dark" | "light";

/* Notion design palette — pastel tints + brand purple/pink/blue wireframe.
   Light theme is the marketing-canonical mode; dark stays neutral grays. */
const COLORS: Record<
  Theme,
  { primary: string[]; wireframe: string[]; bg: string }
> = {
  dark: {
    primary: ["#0a1530", "#1a2a52", "#3a2a99", "#4534b3", "#5645d4"],
    wireframe: ["#7b3ff2", "#5645d4", "#0075de", "#ff64c8", "#d6b6f6"],
    bg: "#0a1530",
  },
  light: {
    primary: ["#ffffff", "#dcecfa", "#e6e0f5", "#fde0ec", "#ffe8d4"],
    wireframe: ["#5645d4", "#7b3ff2", "#ff64c8", "#0075de", "#dd5b00"],
    bg: "#ffffff",
  },
};

const VIGNETTE: Record<Theme, string> = {
  dark: "rgba(10,21,48,0.9)",
  light: "rgba(255,255,255,0.92)",
};

/** Reusable shader background. Only mount on landing/auth surfaces. */
export function MeshBackdrop({
  vignette = "center",
  intensity = 1,
  theme = "dark",
}: {
  vignette?: "center" | "edge" | "none";
  intensity?: number;
  theme?: Theme;
}) {
  const c = COLORS[theme];
  const v = VIGNETTE[theme];

  return (
    <>
      <SafeMeshGradient
        className="absolute inset-0 w-full h-full"
        colors={c.primary}
        speed={0.25 * intensity}
        backgroundColor={c.bg}
      />
      <SafeMeshGradient
        className="absolute inset-0 w-full h-full opacity-30"
        colors={c.wireframe}
        speed={0.18 * intensity}
        wireframe="true"
        backgroundColor="transparent"
      />
      {vignette !== "none" && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              vignette === "edge"
                ? `radial-gradient(ellipse at center, transparent 40%, ${v} 100%)`
                : `radial-gradient(ellipse at center, transparent 30%, ${v} 100%)`,
          }}
        />
      )}
    </>
  );
}
