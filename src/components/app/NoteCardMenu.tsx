"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
  RotateCcw,
  Trash,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

export function NoteCardMenu({
  starred,
  inTrash,
  onStar,
  onTrash,
  onRestore,
  onDeleteForever,
}: {
  starred: boolean;
  inTrash?: boolean;
  onStar?: () => void;
  onTrash?: () => void;
  onRestore?: () => void;
  onDeleteForever?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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

  const handle = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "p-1 rounded-md transition-colors",
          open
            ? "text-text-1 bg-vellum-3"
            : "text-text-4 hover:text-text-2",
        )}
      >
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-1.5 w-44 rounded-xl overflow-hidden p-1 z-30"
            style={{
              transformOrigin: "top right",
              background: isDark
                ? "rgba(28,28,30,0.82)"
                : "rgba(255,255,255,0.82)",
              backdropFilter: "blur(24px) saturate(1.4)",
              WebkitBackdropFilter: "blur(24px) saturate(1.4)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.10)"
                : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isDark
                ? "0 16px 32px -8px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset"
                : "0 16px 32px -8px rgba(15,15,15,0.18), 0 1px 0 rgba(255,255,255,0.7) inset",
            }}
          >
            {inTrash ? (
              <>
                {onRestore && (
                  <MenuItem
                    icon={RotateCcw}
                    label="Restore"
                    isDark={isDark}
                    onClick={handle(onRestore)}
                  />
                )}
                {onDeleteForever && (
                  <>
                    <div
                      className="my-1 h-px mx-1"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                      }}
                    />
                    <MenuItem
                      icon={Trash}
                      label="Delete forever"
                      isDark={isDark}
                      danger
                      onClick={handle(onDeleteForever)}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {onStar && (
                  <MenuItem
                    icon={starred ? StarOff : Star}
                    label={starred ? "Unstar" : "Star"}
                    isDark={isDark}
                    onClick={handle(onStar)}
                  />
                )}
                {onTrash && (
                  <>
                    <div
                      className="my-1 h-px mx-1"
                      style={{
                        background: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                      }}
                    />
                    <MenuItem
                      icon={Trash2}
                      label="Move to trash"
                      isDark={isDark}
                      danger
                      onClick={handle(onTrash)}
                    />
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  isDark,
  danger,
  onClick,
}: {
  icon: typeof Star;
  label: string;
  isDark: boolean;
  danger?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const baseColor = danger
    ? "#e03131"
    : isDark
      ? "rgba(255,255,255,0.85)"
      : "#37352f";

  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md transition-colors text-left"
      style={{ color: baseColor }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = danger
          ? isDark
            ? "rgba(224,49,49,0.14)"
            : "rgba(224,49,49,0.08)"
          : isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      <span style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.4 }}>
        {label}
      </span>
    </button>
  );
}
