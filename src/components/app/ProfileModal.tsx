"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { X, Check, AlertCircle } from "lucide-react";
import { CandleButton, Field } from "@/components/ui";
import { updateProfile } from "@/app/actions/profile";
import { Avatar } from "./Avatar";
import { useTheme } from "./ThemeProvider";

export function ProfileModal({
  user,
  onClose,
}: {
  user: { name: string; email: string };
  onClose: () => void;
}) {
  const { update } = useSession();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const dirty = name.trim() !== user.name.trim();
  const valid = name.trim().length > 0 && name.trim().length <= 80;

  const handleSave = () => {
    if (!dirty || !valid) return;
    setError(null);
    startTransition(async () => {
      const res = await updateProfile({ name: name.trim() });
      if (!res.ok) {
        setError(res.message ?? "Could not save.");
        return;
      }
      try {
        await update({ name: res.name });
      } catch {
        /* session refresh — non-blocking */
      }
      setSavedAt(Date.now());
    });
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40"
        style={{
          background: isDark ? "rgba(0,0,0,0.6)" : "rgba(15,15,15,0.45)",
          backdropFilter: "blur(2px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 top-[12vh] z-50 mx-auto max-w-md px-4"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-2xl p-6 flex flex-col gap-5"
          style={{
            background: isDark ? "#1c1c1e" : "#ffffff",
            border: isDark
              ? "1px solid rgba(255,255,255,0.10)"
              : "1px solid #e5e3df",
            boxShadow: isDark
              ? "0 24px 56px -12px rgba(0,0,0,0.65), 0 4px 12px -4px rgba(0,0,0,0.45)"
              : "0 24px 56px -12px rgba(15,15,15,0.18), 0 4px 12px -4px rgba(15,15,15,0.08)",
          }}
        >
          <div className="flex items-center justify-between">
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: isDark ? "#ffffff" : "#1a1a1a",
              }}
            >
              Your profile
            </h2>
            <button
              onClick={onClose}
              className="text-text-4 hover:text-text-2 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Live preview: avatar updates as you type */}
          <div className="flex items-center gap-4">
            <Avatar name={name || user.name} size="lg" />
            <div className="min-w-0">
              <p
                className="truncate"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: isDark ? "#ffffff" : "#1a1a1a",
                  lineHeight: 1.3,
                }}
              >
                {name.trim() || user.name || "You"}
              </p>
              <p
                className="truncate"
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: isDark ? "rgba(255,255,255,0.55)" : "#787671",
                  lineHeight: 1.4,
                }}
              >
                {user.email}
              </p>
              <p
                className="mt-1"
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: isDark ? "rgba(255,255,255,0.35)" : "#a4a097",
                }}
              >
                Avatar uses the first letter of your name.
              </p>
            </div>
          </div>

          <Field
            label="Display name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
              setSavedAt(null);
            }}
            placeholder="Your name"
            autoFocus
            error={error}
          />

          <div className="flex items-center justify-between">
            {savedAt ? (
              <span
                className="inline-flex items-center gap-1.5"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#1aae39",
                }}
              >
                <Check className="w-3.5 h-3.5" />
                Saved
              </span>
            ) : error ? (
              <span
                className="inline-flex items-center gap-1.5"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#e03131",
                }}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </span>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-text-3 hover:text-text-1 text-xs font-light transition-colors"
              >
                Close
              </button>
              <CandleButton
                size="sm"
                disabled={!dirty || !valid || pending}
                onClick={handleSave}
              >
                {pending ? "Saving…" : "Save"}
              </CandleButton>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
