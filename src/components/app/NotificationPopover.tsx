"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bell, BellOff, CheckCheck, X, Trash2 } from "lucide-react";
import {
  ICON_MAP,
  clearAll,
  dismiss,
  markAllRead,
  markRead,
  snapshot,
  snapshotServer,
  subscribe,
  type NotifItem,
} from "@/lib/notifications-client";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

function formatRelative(ts: number, now: number): string {
  const diff = Math.max(0, now - ts);
  const m = 60 * 1000;
  const h = 60 * m;
  const d = 24 * h;
  if (diff < m) return "just now";
  if (diff < h) return `${Math.floor(diff / m)}m`;
  if (diff < d) return `${Math.floor(diff / h)}h`;
  if (diff < 7 * d) return `${Math.floor(diff / d)}d`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function NotificationPopover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const items = useSyncExternalStore(subscribe, snapshot, snapshotServer);
  const unreadCount = items.filter((i) => i.unread).length;

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setNow(Date.now()), 30 * 1000);
    return () => window.clearInterval(id);
  }, [open]);

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

  const { unread, earlier } = useMemo(() => {
    const sorted = [...items].sort((a, b) => b.ts - a.ts);
    return {
      unread: sorted.filter((i) => i.unread),
      earlier: sorted.filter((i) => !i.unread),
    };
  }, [items]);

  const handleItemClick = (item: NotifItem) => {
    markRead(item.id);
    if (item.href) {
      router.push(item.href);
      setOpen(false);
    }
  };

  const panelBg = isDark ? "#1c1c1e" : "#ffffff";
  const headerBg = isDark ? "#202022" : "#fafaf9";
  const dividerCol = isDark ? "rgba(255,255,255,0.08)" : "#ede9e4";
  const sectionBg = isDark ? "#19191b" : "#fafaf9";
  const titleCol = isDark ? "#ffffff" : "#1a1a1a";
  const bodyCol = isDark ? "rgba(255,255,255,0.66)" : "#5d5b54";
  const subCol = isDark ? "rgba(255,255,255,0.45)" : "#a4a097";
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "relative inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors",
          open
            ? "text-text-1 bg-vellum-3"
            : "text-text-4 hover:text-text-2 hover:bg-vellum-2",
        )}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[14px] h-[14px] px-[3px] rounded-full flex items-center justify-center"
            style={{
              background: "#5645d4",
              color: "#ffffff",
              fontSize: "9px",
              fontWeight: 700,
              lineHeight: 1,
              boxShadow: "0 0 0 2px var(--color-canvas)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-[380px] rounded-2xl overflow-hidden z-50 flex flex-col"
            style={{
              transformOrigin: "top right",
              background: panelBg,
              border: isDark
                ? "1px solid rgba(255,255,255,0.10)"
                : "1px solid #e5e3df",
              boxShadow: isDark
                ? "0 24px 56px -12px rgba(0,0,0,0.65), 0 4px 12px -4px rgba(0,0,0,0.45)"
                : "0 24px 56px -12px rgba(15,15,15,0.18), 0 4px 12px -4px rgba(15,15,15,0.08)",
              maxHeight: "min(560px, calc(100vh - 96px))",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                background: headerBg,
                borderBottom: `1px solid ${dividerCol}`,
              }}
            >
              <div className="flex items-center gap-2">
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: titleCol,
                  }}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "#5645d4",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <HeaderAction
                  icon={CheckCheck}
                  label="Mark all read"
                  disabled={unreadCount === 0}
                  onClick={markAllRead}
                  isDark={isDark}
                />
                <HeaderAction
                  icon={Trash2}
                  label="Clear all"
                  disabled={items.length === 0}
                  onClick={clearAll}
                  isDark={isDark}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <EmptyState isDark={isDark} />
              ) : (
                <>
                  {unread.length > 0 && (
                    <NotifSection
                      label="New"
                      items={unread}
                      sectionBg={sectionBg}
                      titleCol={titleCol}
                      bodyCol={bodyCol}
                      subCol={subCol}
                      dividerCol={dividerCol}
                      hoverBg={hoverBg}
                      now={now}
                      onClickItem={handleItemClick}
                      onDismiss={dismiss}
                    />
                  )}
                  {earlier.length > 0 && (
                    <NotifSection
                      label="Earlier"
                      items={earlier}
                      sectionBg={sectionBg}
                      titleCol={titleCol}
                      bodyCol={bodyCol}
                      subCol={subCol}
                      dividerCol={dividerCol}
                      hoverBg={hoverBg}
                      now={now}
                      onClickItem={handleItemClick}
                      onDismiss={dismiss}
                      muted
                    />
                  )}
                </>
              )}
            </div>

            <div
              className="px-4 py-2.5 shrink-0"
              style={{
                background: headerBg,
                borderTop: `1px solid ${dividerCol}`,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: subCol,
                }}
              >
                {items.length === 0
                  ? "No notifications"
                  : unreadCount === 0
                    ? "You're all caught up"
                    : `${unreadCount} unread · ${items.length} total`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeaderAction({
  icon: Icon,
  label,
  disabled,
  onClick,
  isDark,
}: {
  icon: typeof Bell;
  label: string;
  disabled?: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ color: isDark ? "rgba(255,255,255,0.7)" : "#5d5b54" }}
      onMouseEnter={(e) => {
        if (disabled) return;
        (e.currentTarget as HTMLButtonElement).style.background = isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function NotifSection({
  label,
  items,
  sectionBg,
  titleCol,
  bodyCol,
  subCol,
  dividerCol,
  hoverBg,
  now,
  onClickItem,
  onDismiss,
  muted,
}: {
  label: string;
  items: NotifItem[];
  sectionBg: string;
  titleCol: string;
  bodyCol: string;
  subCol: string;
  dividerCol: string;
  hoverBg: string;
  now: number;
  onClickItem: (n: NotifItem) => void;
  onDismiss: (id: string) => void;
  muted?: boolean;
}) {
  return (
    <div>
      <div
        className="px-4 py-1.5 sticky top-0 z-10"
        style={{
          background: sectionBg,
          borderBottom: `1px solid ${dividerCol}`,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: subCol,
        }}
      >
        {label}
      </div>
      <ul>
        <AnimatePresence initial={false}>
          {items.map((n) => (
            <NotifRow
              key={n.id}
              item={n}
              now={now}
              titleCol={titleCol}
              bodyCol={bodyCol}
              subCol={subCol}
              dividerCol={dividerCol}
              hoverBg={hoverBg}
              onClickItem={onClickItem}
              onDismiss={onDismiss}
              muted={muted}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function NotifRow({
  item,
  now,
  titleCol,
  bodyCol,
  subCol,
  dividerCol,
  hoverBg,
  onClickItem,
  onDismiss,
  muted,
}: {
  item: NotifItem;
  now: number;
  titleCol: string;
  bodyCol: string;
  subCol: string;
  dividerCol: string;
  hoverBg: string;
  onClickItem: (n: NotifItem) => void;
  onDismiss: (id: string) => void;
  muted?: boolean;
}) {
  const Icon = ICON_MAP[item.iconKey] ?? Bell;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
      style={{ borderBottom: `1px solid ${dividerCol}` }}
    >
      <div
        className="group relative flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
        onClick={() => onClickItem(item)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = hoverBg;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
        style={{ opacity: muted ? 0.78 : 1 }}
      >
        {item.unread && (
          <span
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: "#5645d4" }}
            aria-label="Unread"
          />
        )}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-2"
          style={{ background: item.tint }}
        >
          <Icon
            className="w-4 h-4"
            strokeWidth={1.75}
            style={{ color: item.iconColor }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p
              className="truncate"
              style={{
                fontSize: "13px",
                fontWeight: item.unread ? 600 : 500,
                lineHeight: 1.35,
                color: titleCol,
              }}
            >
              {item.title}
            </p>
            <span
              className="shrink-0"
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: subCol,
              }}
            >
              {formatRelative(item.ts, now)}
            </span>
          </div>
          <p
            className="line-clamp-2"
            style={{
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: 1.45,
              color: bodyCol,
            }}
          >
            {item.body}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(item.id);
          }}
          aria-label="Dismiss notification"
          title="Dismiss"
          className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-6 h-6 rounded-md shrink-0 -mt-0.5"
          style={{ color: subCol }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = hoverBg;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.li>
  );
}

function EmptyState({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#f6f5f4" }}
      >
        <BellOff
          className="w-5 h-5"
          style={{ color: isDark ? "rgba(255,255,255,0.45)" : "#a4a097" }}
        />
      </div>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 600,
          lineHeight: 1.4,
          color: isDark ? "#ffffff" : "#1a1a1a",
        }}
      >
        No notifications
      </p>
      <p
        className="mt-1"
        style={{
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: 1.5,
          color: isDark ? "rgba(255,255,255,0.55)" : "#787671",
        }}
      >
        New activity will appear here.
      </p>
    </div>
  );
}
