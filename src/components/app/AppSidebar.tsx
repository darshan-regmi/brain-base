"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  LayoutDashboard,
  Star,
  Trash2,
  Clock,
  FileText,
  Timer,
  BookOpen,
  GraduationCap,
  Repeat2,
  Calendar,
  Plus,
} from "lucide-react";
import { Wordmark, CandleButton, TagPill } from "@/components/ui";
import { SettingsPopover } from "./SettingsPopover";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface User {
  name: string;
  email: string;
}

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Notes", icon: Layers },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/log", label: "Daily Log", icon: Calendar },
  { href: "/kb", label: "Knowledge", icon: BookOpen },
  { href: "/learn", label: "Learning", icon: GraduationCap },
  { href: "/review", label: "Review", icon: Repeat2 },
];

export function AppSidebar({
  user,
  open,
  tags,
  filterCounts,
  activeFilter,
  onFilterChange,
  onNewNote,
}: {
  user: User;
  open: boolean;
  tags?: string[];
  filterCounts?: { all: number; starred: number; recent?: number; trash?: number };
  activeFilter?: "all" | "starred" | "recent" | "trash";
  onFilterChange?: (f: "all" | "starred" | "recent" | "trash") => void;
  onNewNote?: () => void;
}) {
  const pathname = usePathname();
  const onNotesIndex =
    pathname === "/notes" || pathname?.startsWith("/notes?");

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-64 shrink-0 flex flex-col h-screen sticky top-0 bg-ink-2 border-r border-line-1"
        >
          {/* Wordmark */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-line-1">
            <Wordmark size="md" withLabel />
          </div>

          {/* New Note */}
          {onNewNote && (
            <div className="px-4 pt-5 pb-3">
              <CandleButton
                onClick={onNewNote}
                size="sm"
                className="w-full py-2.5 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                New Note
              </CandleButton>
            </div>
          )}

          {/* Primary nav */}
          <nav className="px-3 flex flex-col gap-0.5 mt-2">
            {PRIMARY_NAV.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname?.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full transition-colors duration-150 text-xs",
                    active
                      ? "text-[#5645d4] font-semibold"
                      : "text-text-3 hover:text-text-2 font-light hover:bg-vellum-2",
                  )}
                >
                  {active && (
                    <>
                      <motion.span
                        layoutId="sidebar-nav-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(86, 69, 212, 0.12)" }}
                        transition={{
                          type: "spring",
                          duration: 0.45,
                          bounce: 0.18,
                        }}
                      />
                      <motion.span
                        layoutId="sidebar-nav-rail"
                        className="absolute left-1 top-1.5 bottom-1.5 w-0.5 rounded-full"
                        style={{ background: "#5645d4" }}
                        transition={{
                          type: "spring",
                          duration: 0.45,
                          bounce: 0.18,
                        }}
                      />
                    </>
                  )}
                  <Icon className="relative w-3.5 h-3.5 shrink-0" />
                  <span className="relative flex-1">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Notes-page filters — only shown on /notes. Click the active
              filter again to toggle back to All. */}
          {onNotesIndex && filterCounts && onFilterChange && (
            <>
              <div className="mx-4 my-4 h-px bg-line-1" />
              <div className="px-3 flex flex-col gap-0.5">
                <FilterButton
                  icon={Star}
                  label="Starred"
                  count={filterCounts.starred}
                  active={activeFilter === "starred"}
                  onClick={() =>
                    onFilterChange(
                      activeFilter === "starred" ? "all" : "starred",
                    )
                  }
                />
                <FilterButton
                  icon={Clock}
                  label="Recent"
                  active={activeFilter === "recent"}
                  onClick={() =>
                    onFilterChange(
                      activeFilter === "recent" ? "all" : "recent",
                    )
                  }
                />
                <FilterButton
                  icon={Trash2}
                  label="Trash"
                  count={filterCounts.trash}
                  active={activeFilter === "trash"}
                  onClick={() =>
                    onFilterChange(activeFilter === "trash" ? "all" : "trash")
                  }
                />
              </div>
            </>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="px-4 mt-6">
              <p className="text-xs tracking-widest uppercase mb-3 text-text-4">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <TagPill key={tag} tag={tag} size="sm" />
                ))}
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* Settings — opens a macOS-style popover with appearance + profile + sign out */}
          <div className="px-3 pt-3">
            <SettingsPopover user={user} />
          </div>

          {/* User */}
          <div className="px-4 py-4 mt-2 flex items-center gap-3 border-t border-line-1">
            <Avatar name={user.name} email={user.email} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-text-2 text-xs font-medium truncate">
                {user.name}
              </p>
              <p className="text-text-4 text-xs truncate">{user.email}</p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function FilterButton({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: typeof FileText;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-left w-full transition-colors duration-150 text-xs",
        active
          ? "text-[#5645d4] font-semibold"
          : "text-text-3 hover:text-text-2 font-light hover:bg-vellum-2",
      )}
    >
      {active && (
        <>
          <motion.span
            layoutId="sidebar-filter-pill"
            className="absolute inset-0 rounded-lg"
            style={{ background: "rgba(86, 69, 212, 0.12)" }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.18 }}
          />
          <motion.span
            layoutId="sidebar-filter-rail"
            className="absolute left-1 top-1.5 bottom-1.5 w-0.5 rounded-full"
            style={{ background: "#5645d4" }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.18 }}
          />
        </>
      )}
      <Icon className="relative w-3.5 h-3.5 shrink-0" />
      <span className="relative flex-1">{label}</span>
      {count !== undefined && (
        <span
          className="relative tabular-nums"
          style={{ color: active ? "#5645d4" : "var(--color-text-4)" }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
