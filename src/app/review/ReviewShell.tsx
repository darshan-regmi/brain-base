"use client";

import { useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Upload, FileText, Check, AlertCircle } from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { CandleButton, Field, Surface } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  createCard,
  reviewCard,
  bulkCreateCards,
} from "@/app/actions/review";
import { push as pushNotif } from "@/lib/notifications-client";
import {
  QUALITY_AGAIN,
  QUALITY_HARD,
  QUALITY_GOOD,
  QUALITY_EASY,
} from "@/lib/sm2";

interface Card {
  id: string;
  front: string;
  back: string;
}

export function ReviewShell({
  user,
  queue,
  totalCards,
}: {
  user: { name: string; email: string };
  queue: Card[];
  totalCards: number;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [, startTransition] = useTransition();

  const card = queue[index];
  const total = queue.length;

  const handleReview = (quality: number) => {
    if (!card) return;
    startTransition(async () => {
      await reviewCard(card.id, quality);
      setFlipped(false);
      setIndex((i) => i + 1);
    });
  };

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar user={user} open={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 flex flex-col items-center justify-center px-8 py-8 relative">
          {/* Counter — top-right */}
          <div className="absolute top-6 right-8 flex items-center gap-3">
            {total > 0 && (
              <p className="font-serif text-text-3 text-sm font-light tabular-nums">
                <span className="text-text-1">{Math.min(index + 1, total)}</span>{" "}
                of {total}
              </p>
            )}
            <button
              onClick={() => setImporting(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line-2 text-text-2 hover:text-text-1 hover:border-line-3 transition-colors text-xs font-medium"
            >
              <Upload className="w-3 h-3" />
              Import CSV
            </button>
            <CandleButton size="sm" onClick={() => setAdding(true)}>
              <Plus className="w-3 h-3" />
              New card
            </CandleButton>
          </div>

          {!card && index === 0 && total === 0 && (
            <Surface className="p-12 text-center max-w-md">
              <p className="font-serif text-text-1 text-3xl font-light mb-3">
                {totalCards === 0 ? "No cards yet." : "All clear."}
              </p>
              <p className="text-text-3 text-sm font-light">
                {totalCards === 0
                  ? "Make a flashcard to remember anything."
                  : "Nothing due. Come back tomorrow."}
              </p>
              {totalCards === 0 && (
                <div className="mt-6">
                  <CandleButton size="sm" onClick={() => setAdding(true)}>
                    <Plus className="w-3.5 h-3.5" />
                    First card
                  </CandleButton>
                </div>
              )}
            </Surface>
          )}

          {!card && index > 0 && (
            <Surface className="p-12 text-center max-w-md">
              <p className="font-serif text-text-1 text-3xl font-light mb-3">
                Done.
              </p>
              <p className="text-text-3 text-sm font-light">
                Reviewed {index} {index === 1 ? "card" : "cards"} today.
              </p>
            </Surface>
          )}

          {card && (
            <div className="w-full max-w-xl">
              <button
                onClick={() => setFlipped((f) => !f)}
                className="w-full perspective-[1200px] cursor-pointer"
                aria-label="Flip card"
              >
                <motion.div
                  className="relative w-full min-h-[260px] rounded-2xl"
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Face side="front">
                    <p className="font-serif text-text-1 text-3xl font-light leading-snug">
                      {card.front}
                    </p>
                    <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-text-4 text-[10px] tracking-widest uppercase">
                      Click or press space
                    </p>
                  </Face>
                  <Face side="back">
                    <p className="font-sans text-text-1 text-xl font-light leading-relaxed whitespace-pre-wrap">
                      {card.back}
                    </p>
                  </Face>
                </motion.div>
              </button>

              <AnimatePresence>
                {flipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-4 gap-2 mt-8"
                  >
                    <ReviewBtn
                      label="Again"
                      sub="< 1m"
                      onClick={() => handleReview(QUALITY_AGAIN)}
                    />
                    <ReviewBtn
                      label="Hard"
                      sub="6m"
                      onClick={() => handleReview(QUALITY_HARD)}
                    />
                    <ReviewBtn
                      label="Good"
                      sub="1d"
                      candle
                      onClick={() => handleReview(QUALITY_GOOD)}
                    />
                    <ReviewBtn
                      label="Easy"
                      sub="4d"
                      onClick={() => handleReview(QUALITY_EASY)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {adding && (
          <AddCardModal
            onClose={() => setAdding(false)}
            onCreate={(input) => {
              startTransition(async () => {
                await createCard(input);
                setAdding(false);
              });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {importing && (
          <ImportCSVModal
            onClose={() => setImporting(false)}
            onImport={(cards) =>
              new Promise((resolve) => {
                startTransition(async () => {
                  const res = await bulkCreateCards(cards);
                  pushNotif({
                    iconKey: "upload",
                    title: `Imported ${res.created} ${res.created === 1 ? "card" : "cards"}`,
                    body: "Your new flashcards are queued for review.",
                    tint: "#e6e0f5",
                    iconColor: "#5645d4",
                    href: "/review",
                  });
                  resolve(res.created);
                });
              })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Face({
  side,
  children,
}: {
  side: "front" | "back";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-2xl bg-vellum-1 border border-line-1 p-10 flex items-center justify-center text-center backface-hidden",
        side === "back" && "[transform:rotateY(180deg)]",
      )}
      style={{ backfaceVisibility: "hidden" }}
    >
      {children}
    </div>
  );
}

function ReviewBtn({
  label,
  sub,
  onClick,
  candle,
}: {
  label: string;
  sub: string;
  onClick: () => void;
  candle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center py-3 rounded-xl text-xs font-light transition-colors border",
        candle
          ? "bg-candle-grad text-ink-1 border-transparent shadow-candle-soft"
          : "border-line-1 text-text-2 hover:text-text-1 hover:border-line-2",
      )}
    >
      <span className="font-serif text-base">{label}</span>
      <span
        className={cn(
          "text-[10px] tracking-widest uppercase mt-0.5",
          candle ? "text-ink-1/60" : "text-text-4",
        )}
      >
        {sub}
      </span>
    </button>
  );
}

/* ─── CSV import ─────────────────────────────────────────────────────────── */

/** Minimal RFC-4180-ish CSV parser — handles quoted fields, escaped quotes,
 *  CR/LF row separators. Returns rows of strings. */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuote = false;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (inQuote) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuote = false;
        i++;
        continue;
      }
      cell += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuote = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(cell);
      cell = "";
      rows.push(row);
      row = [];
      i++;
      continue;
    }
    cell += ch;
    i++;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function ImportCSVModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (cards: { front: string; back: string }[]) => Promise<number>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [parsed, setParsed] = useState<{ front: string; back: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setParsed([]);
    setFilename(file.name);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please pick a .csv file.");
      return;
    }
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length < 2) {
        setError("CSV needs a header row and at least one data row.");
        return;
      }
      const header = rows[0].map((c) => c.trim().toLowerCase());
      const frontIdx = header.indexOf("front");
      const backIdx = header.indexOf("back");
      if (frontIdx === -1 || backIdx === -1) {
        setError(
          'CSV header must include "front" and "back" columns. Other columns are ignored.',
        );
        return;
      }
      const cards = rows
        .slice(1)
        .filter((r) => r.some((c) => c.trim()))
        .map((r) => ({
          front: (r[frontIdx] ?? "").trim(),
          back: (r[backIdx] ?? "").trim(),
        }))
        .filter((c) => c.front.length > 0 && c.back.length > 0);
      if (cards.length === 0) {
        setError("No valid front/back rows found.");
        return;
      }
      setParsed(cards);
    } catch {
      setError("Could not read this file.");
    }
  };

  const handleSubmit = async () => {
    if (parsed.length === 0) return;
    setBusy(true);
    try {
      await onImport(parsed);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 top-[12vh] z-50 mx-auto max-w-lg px-4"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-2xl bg-ink-2 border border-line-2 shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-text-1 text-xl font-light">
              Import flashcards
            </h2>
            <button
              onClick={onClose}
              className="text-text-4 hover:text-text-2 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-text-3 text-xs font-light leading-relaxed">
            Upload a <code className="text-text-2 font-mono">.csv</code> file
            with at minimum two columns:{" "}
            <span className="font-mono text-text-2">front</span> and{" "}
            <span className="font-mono text-text-2">back</span>. Other columns
            are ignored.
          </p>

          {/* Drop / pick zone */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-xl border border-dashed border-line-2 hover:border-[#5645d4] hover:bg-vellum-1 transition-colors p-6 flex flex-col items-center gap-2 text-center"
          >
            {filename ? (
              <>
                <FileText className="w-6 h-6 text-[#5645d4]" />
                <p className="text-text-1 text-sm font-medium">{filename}</p>
                <p className="text-text-4 text-xs">Click to choose another</p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-text-3" />
                <p className="text-text-2 text-sm font-medium">
                  Drop a CSV here or click to choose
                </p>
                <p className="text-text-4 text-xs">.csv files only</p>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />

          {error && (
            <div
              className="flex items-start gap-2 px-3 py-2 rounded-md"
              style={{ background: "rgba(224,49,49,0.08)", color: "#e03131" }}
            >
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {parsed.length > 0 && (
            <div className="rounded-xl border border-line-1 bg-vellum-1 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-3.5 h-3.5 text-[#1aae39]" />
                <p className="text-text-1 text-xs font-medium">
                  {parsed.length} {parsed.length === 1 ? "card" : "cards"}{" "}
                  ready to import
                </p>
              </div>
              <ul className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                {parsed.slice(0, 4).map((c, i) => (
                  <li key={i} className="text-text-3 text-[11px] truncate">
                    <span className="text-text-2">{c.front}</span> →{" "}
                    <span>{c.back}</span>
                  </li>
                ))}
                {parsed.length > 4 && (
                  <li className="text-text-4 text-[11px]">
                    + {parsed.length - 4} more
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-text-3 hover:text-text-1 text-xs font-light transition-colors"
            >
              Cancel
            </button>
            <CandleButton
              size="sm"
              disabled={parsed.length === 0 || busy}
              onClick={handleSubmit}
            >
              {busy
                ? "Importing…"
                : parsed.length > 0
                  ? `Import ${parsed.length}`
                  : "Import"}
            </CandleButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function AddCardModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: { front: string; back: string }) => void;
}) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-x-0 top-[15vh] z-50 mx-auto max-w-md px-4"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-2xl bg-ink-2 border border-line-2 shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-text-1 text-xl font-light">
              New card
            </h2>
            <button
              onClick={onClose}
              className="text-text-4 hover:text-text-2 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Field
            label="Front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="The prompt"
            autoFocus
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-text-2 text-xs font-light tracking-wide">
              Back
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="The answer"
              className="bg-vellum-2 border border-line-1 rounded-xl px-4 py-3 text-text-1 text-sm font-light leading-relaxed outline-none placeholder:text-text-4 resize-none min-h-[100px] focus:border-line-3"
            />
          </div>
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-text-3 hover:text-text-1 text-xs font-light transition-colors"
            >
              Cancel
            </button>
            <CandleButton
              size="sm"
              disabled={!front.trim() || !back.trim()}
              onClick={() => onCreate({ front: front.trim(), back: back.trim() })}
            >
              Create
            </CandleButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}
