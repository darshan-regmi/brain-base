"use client";

import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Sidebar visibility state with viewport-aware default:
 * open on lg+ viewports, closed on smaller ones at mount.
 * User toggles after mount are preserved until the next reload.
 */
export function useResponsiveSidebar() {
  const [open, setOpen] = useState(true);

  /* First-mount sync with the viewport — by design, not a derived value. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOpen(window.matchMedia(DESKTOP_QUERY).matches);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return [open, setOpen] as const;
}
