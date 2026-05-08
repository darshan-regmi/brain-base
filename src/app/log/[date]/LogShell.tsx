"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { upsertDailyLog } from "@/app/actions/log";
import { fromDateString, prettyDate, shortDate, toDateString } from "@/lib/dates";
import { cn } from "@/lib/utils";

const PROMPTS = [
  "What did today actually mean?",
  "What surprised you?",
  "What would you do again?",
  "What is one thing worth remembering?",
  "Where did your attention go?",
  "What was hard, and what made it hard?",
];

function pickPrompt(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return PROMPTS[h % PROMPTS.length];
}

function buildDateline(currentDate: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(currentDate);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d);
  }
  return days;
}

export function LogShell({
  user,
  dateString,
  entry,
  recent,
}: {
  user: { name: string; email: string };
  dateString: string;
  entry: { content: string; mood: number | null; energy: number | null };
  recent: { dateString: string; hasContent: boolean }[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [content, setContent] = useState(entry.content);
  const [mood, setMood] = useState<number>(entry.mood ?? 50);
  const [energy, setEnergy] = useState<number>(entry.energy ?? 50);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef({
    content: entry.content,
    mood: entry.mood ?? 50,
    energy: entry.energy ?? 50,
  });

  /* Debounced autosave — setSaveState here is the *external* feedback channel
     for an effect that already syncs an external system (the database). */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (
      content === lastSaved.current.content &&
      mood === lastSaved.current.mood &&
      energy === lastSaved.current.energy
    ) {
      return;
    }
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await upsertDailyLog(dateString, { content, mood, energy });
      lastSaved.current = { content, mood, energy };
      setSaveState("saved");
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [content, mood, energy, dateString]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const date = fromDateString(dateString);
  const dateline = buildDateline(date);
  const recentMap = new Map(recent.map((r) => [r.dateString, r.hasContent]));
  const prompt = pickPrompt(dateString);

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar user={user} open={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-8 px-8 py-12 max-w-6xl mx-auto">
            {/* Entry — left 2/3 */}
            <motion.section
              className="col-span-12 lg:col-span-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-text-4 text-xs tracking-widest uppercase">
                  Daily log
                </p>
                <SaveDot state={saveState} />
              </div>

              <h1 className="font-serif text-text-1 text-5xl font-light tracking-tight mb-4">
                {prettyDate(date)}
              </h1>

              <p className="font-serif italic text-text-3 text-lg font-light mb-10">
                {prompt}
              </p>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin…"
                className="w-full bg-transparent text-text-1 text-base font-light leading-[1.85] outline-none placeholder:text-text-4 resize-none min-h-[50vh]"
              />

              <div className="mt-12 flex flex-col gap-6 max-w-md">
                <Slider
                  label="Mood"
                  value={mood}
                  onChange={setMood}
                  leftLabel="low"
                  rightLabel="high"
                />
                <Slider
                  label="Energy"
                  value={energy}
                  onChange={setEnergy}
                  leftLabel="drained"
                  rightLabel="charged"
                />
              </div>
            </motion.section>

            {/* Vertical dateline — right 1/3 */}
            <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 self-start">
              <p className="text-text-4 text-xs tracking-widest uppercase mb-4">
                14 days
              </p>
              <ul className="flex flex-col gap-1">
                {dateline.map((d) => {
                  const ds = toDateString(d);
                  const isCurrent = ds === dateString;
                  const hasContent = recentMap.get(ds) ?? false;
                  return (
                    <li key={ds}>
                      <Link
                        href={`/log/${ds}`}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isCurrent
                            ? "bg-candle-grad text-ink-1"
                            : hasContent
                              ? "text-text-2 hover:bg-vellum-2"
                              : "text-text-4 hover:text-text-3 hover:bg-vellum-1",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1 h-1 rounded-full",
                            isCurrent
                              ? "bg-ink-1"
                              : hasContent
                                ? "bg-candle-2"
                                : "bg-line-2",
                          )}
                        />
                        <span className="font-serif text-sm font-light flex-1">
                          {shortDate(d)}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            isCurrent ? "text-ink-1/60" : "text-text-4",
                          )}
                        >
                          {d.toLocaleDateString("en-US", {
                            weekday: "short",
                            timeZone: "UTC",
                          })}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function SaveDot({ state }: { state: "idle" | "saving" | "saved" }) {
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-text-4 text-xs">
        <Loader2 className="w-3 h-3 animate-spin" />
        Saving
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-text-4 text-xs">
        <Check className="w-3 h-3" />
        Saved
      </span>
    );
  }
  return null;
}

function Slider({
  label,
  value,
  onChange,
  leftLabel,
  rightLabel,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-3 text-xs tracking-widest uppercase">
          {label}
        </span>
        <span className="font-serif text-text-2 text-sm tabular-nums">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full slider-candle"
        aria-label={label}
      />
      <div className="flex justify-between mt-1 text-text-4 text-[10px] font-light tracking-wide">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <style jsx>{`
        .slider-candle {
          appearance: none;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
        }
        .slider-candle::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #faf3e1, #f5e7c6);
          box-shadow: 0 0 12px rgba(250, 243, 225, 0.3);
          cursor: pointer;
        }
        .slider-candle::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #faf3e1, #f5e7c6);
          border: none;
          box-shadow: 0 0 12px rgba(250, 243, 225, 0.3);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
