"use client";

import { useEffect } from "react";
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
  X,
} from "lucide-react";
import { Wordmark, CandleButton, TagPill } from "@/components/ui";
import { SettingsPopover } from "./SettingsPopover";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";

interface User {
  name: string;
  email: string;
}

type Filter = "all" | "starred" | "recent" | "trash";

const PRIMARY_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Notes", icon: Layers },
  { href: "/focus", label: "Focus", icon: Timer },
  { href: "/log", label: "Daily Log", icon: Calendar },
  { href: "/kb", label: "Knowledge", icon: BookOpen },
  { href: "/learn", label: "Learning", icon: GraduationCap },
  { href: "/review", label: "Review", icon: Repeat2 },
];

interface SidebarProps {
  user: User;
  open: boolean;
  onClose?: () => void;
  tags?: string[];
  filterCounts?: { all: number; starred: number; recent?: number; trash?: number };
  activeFilter?: Filter;
  onFilterChange?: (f: Filter) => void;
  onNewNote?: () => void;
}

export function AppSidebar(props: SidebarProps) {
  const { open, onClose } = props;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!open) return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Desktop rail (lg+): part of layout flow, animates width */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex shrink-0 h-screen sticky top-0 bg-ink-2 border-r border-line-1 overflow-hidden"
          >
            <div className="w-64 flex flex-col h-full">
              <SidebarBody {...props} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile drawer (< lg): overlay with backdrop */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 lg:hidden bg-[#0a1530]/45 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="fixed top-0 bottom-0 left-0 z-50 lg:hidden w-[86%] max-w-[300px] bg-ink-2 border-r border-line-1 shadow-[8px_0_32px_-8px_rgba(0,0,0,0.35)] flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <SidebarBody {...props} showCloseButton />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarBody({
  user,
  onClose,
  tags,
  filterCounts,
  activeFilter,
  onFilterChange,
  onNewNote,
  showCloseButton = false,
}: SidebarProps & { showCloseButton?: boolean }) {
  const pathname = usePathname();
  const onNotesIndex =
    pathname === "/notes" || pathname?.startsWith("/notes?");

  return (
    <>
      {/* Wordmark */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-line-1">
        <Wordmark size="md" withLabel />
        {showCloseButton && onClose && (
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-md text-text-3 hover:text-text-1 hover:bg-vellum-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
              onClick={onClose}
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

      {/* Notes-page filters */}
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

      {/* Settings */}
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
    </>
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
