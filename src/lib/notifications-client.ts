"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Repeat2,
  Calendar,
  Star,
  Sparkles,
  Timer,
  CheckCircle2,
  BookOpen,
  Trash2,
  Upload,
} from "lucide-react";

export type IconKey =
  | "bell"
  | "review"
  | "calendar"
  | "star"
  | "sparkles"
  | "timer"
  | "check"
  | "book"
  | "trash"
  | "upload";

export const ICON_MAP: Record<IconKey, LucideIcon> = {
  bell: Bell,
  review: Repeat2,
  calendar: Calendar,
  star: Star,
  sparkles: Sparkles,
  timer: Timer,
  check: CheckCircle2,
  book: BookOpen,
  trash: Trash2,
  upload: Upload,
};

export type NotifItem = {
  id: string;
  iconKey: IconKey;
  title: string;
  body: string;
  ts: number;
  href?: string;
  tint: string;
  iconColor: string;
  unread: boolean;
};

const KEY = "bb:notifications:v2";

let items: NotifItem[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function seed(): NotifItem[] {
  const now = Date.now();
  const m = 60 * 1000;
  const h = 60 * m;
  const d = 24 * h;
  return [
    {
      id: "n_welcome",
      iconKey: "sparkles",
      title: "Welcome to Brain Base",
      body: "Press ⌘K from anywhere to capture a thought.",
      ts: now - 6 * h,
      tint: "#ffe8d4",
      iconColor: "#dd5b00",
      unread: false,
    },
    {
      id: "n_streak",
      iconKey: "calendar",
      title: "Daily streak: 12 days",
      body: "You logged something every day this week.",
      ts: now - 2 * h,
      href: "/log",
      tint: "#d9f3e1",
      iconColor: "#1aae39",
      unread: true,
    },
    {
      id: "n_review",
      iconKey: "review",
      title: "Cards are due for review",
      body: "Spaced repetition is ready when you are.",
      ts: now - 12 * m,
      href: "/review",
      tint: "#e6e0f5",
      iconColor: "#5645d4",
      unread: true,
    },
    {
      id: "n_starred",
      iconKey: "star",
      title: "Note starred",
      body: "Pinned to your starred view.",
      ts: now - 3 * d,
      href: "/dashboard",
      tint: "#fef7d6",
      iconColor: "#a86a00",
      unread: false,
    },
  ];
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      items = JSON.parse(raw);
    } else {
      items = seed();
      persist();
    }
  } catch {
    items = seed();
  }
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function snapshot(): NotifItem[] {
  hydrate();
  return items;
}

/** SSR snapshot — must be deterministic (no localStorage / no Date.now). */
const EMPTY: NotifItem[] = [];
export function snapshotServer(): NotifItem[] {
  return EMPTY;
}

export function push(
  item: Omit<NotifItem, "id" | "ts" | "unread"> & { id?: string },
) {
  hydrate();
  const newItem: NotifItem = {
    id: item.id ?? `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts: Date.now(),
    unread: true,
    iconKey: item.iconKey,
    title: item.title,
    body: item.body,
    href: item.href,
    tint: item.tint,
    iconColor: item.iconColor,
  };
  items = [newItem, ...items];
  persist();
  emit();
  /* Best-effort native browser notification (gracefully no-ops without permission) */
  if (typeof window !== "undefined" && "Notification" in window) {
    try {
      if (Notification.permission === "granted") {
        new Notification(newItem.title, { body: newItem.body, icon: "/favicon.ico" });
      }
    } catch {
      /* ignore */
    }
  }
}

export function dismiss(id: string) {
  hydrate();
  items = items.filter((i) => i.id !== id);
  persist();
  emit();
}

export function markRead(id: string) {
  hydrate();
  items = items.map((i) => (i.id === id ? { ...i, unread: false } : i));
  persist();
  emit();
}

export function markAllRead() {
  hydrate();
  items = items.map((i) => ({ ...i, unread: false }));
  persist();
  emit();
}

export function clearAll() {
  hydrate();
  items = [];
  persist();
  emit();
}

/** Politely request browser notification permission once. Safe to call repeatedly. */
export function requestNativePermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    try {
      void Notification.requestPermission();
    } catch {
      /* ignore */
    }
  }
}
