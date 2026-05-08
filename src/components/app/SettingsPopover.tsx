"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sun, Moon, Monitor, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "./ThemeProvider";
import { ProfileModal } from "./ProfileModal";
import { cn } from "@/lib/utils";

type ThemeKey = "light" | "dark" | "system";

const APPEARANCE: { key: ThemeKey; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];

export function SettingsPopover({
  user,
}: {
  user?: { name: string; email: string };
}) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            key="settings-popover"
            role="dialog"
            aria-label="Settings"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: "bottom center",
              background: isDark
                ? "rgba(28,28,30,0.78)"
                : "rgba(255,255,255,0.78)",
              backdropFilter: "blur(28px) saturate(1.4)",
              WebkitBackdropFilter: "blur(28px) saturate(1.4)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.10)"
                : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isDark
                ? "0 24px 48px -12px rgba(0,0,0,0.50), 0 1px 0 rgba(255,255,255,0.06) inset, 0 0 0 0.5px rgba(255,255,255,0.04) inset"
                : "0 24px 48px -12px rgba(15,15,15,0.18), 0 1px 0 rgba(255,255,255,0.7) inset, 0 0 0 0.5px rgba(255,255,255,0.5) inset",
            }}
            className="absolute left-0 right-0 bottom-full mb-2 rounded-2xl p-2 z-50"
          >
            {/* Section label */}
            <div
              className="px-2.5 pt-1.5 pb-2 select-none"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: isDark ? "rgba(255,255,255,0.55)" : "#787671",
              }}
            >
              Appearance
            </div>

            {/* Segmented Light / Dark / System picker */}
            <div
              className="relative grid grid-cols-3 gap-1 p-1 rounded-xl"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.04)",
              }}
            >
              {APPEARANCE.map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setTheme(opt.key)}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-lg transition-colors",
                      active
                        ? ""
                        : "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]",
                    )}
                    style={{
                      color: active
                        ? isDark
                          ? "#ffffff"
                          : "#1a1a1a"
                        : isDark
                          ? "rgba(255,255,255,0.65)"
                          : "#5d5b54",
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="settings-appearance-active"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: isDark
                            ? "rgba(255,255,255,0.10)"
                            : "#ffffff",
                          boxShadow: isDark
                            ? "0 1px 2px rgba(0,0,0,0.30), 0 0 0 0.5px rgba(255,255,255,0.10) inset"
                            : "0 1px 2px rgba(15,15,15,0.06), 0 0 0 0.5px rgba(0,0,0,0.04) inset",
                        }}
                        transition={{ type: "spring", duration: 0.35, bounce: 0.18 }}
                      />
                    )}
                    <Icon
                      className="relative w-[18px] h-[18px]"
                      strokeWidth={active ? 2 : 1.75}
                    />
                    <span
                      className="relative"
                      style={{
                        fontSize: "12px",
                        fontWeight: active ? 600 : 500,
                        lineHeight: 1.2,
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div
              className="my-2 h-px mx-1"
              style={{
                background: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
              }}
            />

            {/* Edit profile */}
            {user && (
              <button
                onClick={() => {
                  setProfileOpen(true);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors"
                style={{
                  color: isDark ? "rgba(255,255,255,0.85)" : "#37352f",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                <User className="w-4 h-4" />
                <span style={{ fontSize: "13px", fontWeight: 500 }}>
                  Edit profile
                </span>
              </button>
            )}

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors"
              style={{
                color: isDark ? "rgba(255,255,255,0.85)" : "#37352f",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }}
            >
              <LogOut className="w-4 h-4" />
              <span style={{ fontSize: "13px", fontWeight: 500 }}>
                Sign out
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full transition-colors duration-150 text-xs font-light",
          open
            ? "bg-vellum-3 text-text-1"
            : "text-text-3 hover:text-text-2 hover:bg-vellum-2",
        )}
      >
        <Settings className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1">Settings</span>
        <span
          className="text-[10px] uppercase tracking-wider"
          style={{
            color: open
              ? isDark
                ? "#ffffff"
                : "#5645d4"
              : "var(--color-text-4)",
          }}
        >
          {theme === "system" ? "Auto" : theme === "dark" ? "Dark" : "Light"}
        </span>
      </button>

      <AnimatePresence>
        {profileOpen && user && (
          <ProfileModal
            user={user}
            onClose={() => setProfileOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
