"use client";

import { useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Video,
  FileText,
  Upload,
  Plus,
  ExternalLink,
  Check,
  Pause,
  Play,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { push as pushNotif } from "@/lib/notifications-client";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import {
  CandleButton,
  Field,
  Surface,
  bloom,
  stagger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useResponsiveSidebar } from "@/lib/use-responsive-sidebar";
import {
  createResource,
  updateResource,
  deleteResource,
} from "@/app/actions/resources";

type Kind = "READING" | "COURSE" | "WATCHING";
type Status = "QUEUED" | "ACTIVE" | "PAUSED" | "DONE";

interface Resource {
  id: string;
  title: string;
  source: string;
  url: string;
  coverUrl: string;
  kind: Kind;
  status: Status;
  progress: number;
  takeaways: string;
  nowReading: boolean;
}

const KIND_ICON: Record<Kind, typeof BookOpen> = {
  READING: BookOpen,
  COURSE: GraduationCap,
  WATCHING: Video,
};

const KIND_LABEL: Record<Kind, string> = {
  READING: "Reading",
  COURSE: "Course",
  WATCHING: "Watching",
};

export function LearnShell({
  user,
  resources,
}: {
  user: { name: string; email: string };
  resources: Resource[];
}) {
  const [sidebarOpen, setSidebarOpen] = useResponsiveSidebar();
  const [filter, setFilter] = useState<Kind | "ALL">("ALL");
  const [active, setActive] = useState<Resource | null>(null);
  const [adding, setAdding] = useState(false);
  const [, startTransition] = useTransition();

  const nowReading = resources.find((r) => r.nowReading);
  const rest = resources.filter((r) => !r.nowReading);
  const filtered =
    filter === "ALL" ? rest : rest.filter((r) => r.kind === filter);

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-8 md:py-10 max-w-5xl mx-auto w-full">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h1 className="font-serif text-text-1 text-2xl sm:text-3xl font-light tracking-tight">
                Learning
              </h1>
              <p className="text-text-3 text-sm font-light mt-1">
                Track what you&rsquo;re reading, watching, or studying.
              </p>
            </div>
            <CandleButton size="sm" onClick={() => setAdding(true)}>
              <Plus className="w-3.5 h-3.5" />
              Add resource
            </CandleButton>
          </div>

          <p className="text-text-4 text-xs font-light mb-10">
            {resources.length === 0
              ? "Nothing here yet — add a book, course, video, or upload a PDF/DOCX/PPTX."
              : `${resources.length} ${resources.length === 1 ? "resource" : "resources"} · upload PDFs, DOCX, or PPTX to track them here.`}
          </p>

          {nowReading && (
            <motion.div
              variants={bloom}
              initial="hidden"
              animate="show"
              className="mb-12"
            >
              <p className="text-text-4 text-xs tracking-widest uppercase mb-3">
                In progress
              </p>
              <button
                onClick={() => setActive(nowReading)}
                className="w-full text-left rounded-2xl p-5 bg-vellum-2 border border-[#5645d4]/30 shadow-[0_4px_14px_rgba(86,69,212,0.10)] transition-all hover:bg-vellum-3"
              >
                <ResourceRow r={nowReading} hero />
              </button>
            </motion.div>
          )}

          <div className="flex items-center gap-2 mb-6">
            <FilterChip
              active={filter === "ALL"}
              onClick={() => setFilter("ALL")}
              label="Everything"
            />
            {(["READING", "COURSE", "WATCHING"] as Kind[]).map((k) => (
              <FilterChip
                key={k}
                active={filter === k}
                onClick={() => setFilter(k)}
                label={KIND_LABEL[k]}
                icon={KIND_ICON[k]}
              />
            ))}
          </div>

          <motion.ul
            className="flex flex-col gap-2"
            variants={stagger()}
            initial="hidden"
            animate="show"
            key={filter}
          >
            {filtered.map((r) => (
              <motion.li key={r.id} variants={bloom}>
                <button
                  onClick={() => setActive(r)}
                  className="w-full text-left rounded-xl p-4 bg-vellum-1 border border-line-1 hover:bg-vellum-2 hover:border-line-2 transition-colors"
                >
                  <ResourceRow r={r} />
                </button>
              </motion.li>
            ))}
          </motion.ul>

          {filtered.length === 0 && !nowReading && !adding && (
            <Surface className="p-12 text-center">
              <p className="font-serif text-text-2 text-2xl font-light mb-2">
                Nothing on the desk.
              </p>
              <p className="text-text-3 text-sm font-light">
                Add a book, course, or video to track.
              </p>
            </Surface>
          )}
        </main>
      </div>

      <AnimatePresence>
        {adding && (
          <AddResourceModal
            onClose={() => setAdding(false)}
            onCreate={(input) => {
              startTransition(async () => {
                await createResource(input);
                setAdding(false);
              });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <DetailPanel
            resource={active}
            onClose={() => setActive(null)}
            onUpdate={(data) => {
              startTransition(async () => {
                await updateResource(active.id, data);
              });
            }}
            onDelete={() => {
              startTransition(async () => {
                await deleteResource(active.id);
                setActive(null);
              });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ResourceRow({ r, hero = false }: { r: Resource; hero?: boolean }) {
  const Icon = KIND_ICON[r.kind];
  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          "shrink-0 rounded-md flex items-center justify-center",
          hero ? "w-16 h-16" : "w-12 h-12",
          "bg-vellum-3",
        )}
      >
        {r.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={r.coverUrl}
            alt=""
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <span className="font-serif text-text-2 text-2xl font-light">
            {r.title.charAt(0).toUpperCase() || "?"}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Icon className="w-3 h-3 text-text-4 shrink-0" />
          <p className="text-text-4 text-[10px] tracking-widest uppercase">
            {KIND_LABEL[r.kind]}
            {r.source && <> · {r.source}</>}
          </p>
        </div>
        <p
          className={cn(
            "font-serif text-text-1 font-light truncate mt-0.5",
            hero ? "text-2xl" : "text-base",
          )}
        >
          {r.title}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <ProgressBar value={r.progress} />
          <span className="text-text-4 text-xs tabular-nums shrink-0">
            {r.progress}%
          </span>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex-1 h-px bg-line-1 relative">
      <div
        className="absolute inset-y-0 left-0 bg-candle-grad shadow-candle-soft"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: "1px" }}
      />
      <div className="absolute inset-0 flex justify-between">
        {[0, 25, 50, 75, 100].map((t) => (
          <div
            key={t}
            className="w-px bg-line-2"
            style={{ height: t === 0 || t === 100 ? "5px" : "3px", marginTop: "-1px" }}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: typeof BookOpen;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-colors border",
        active
          ? "bg-candle-grad text-ink-1 border-transparent"
          : "border-line-1 text-text-3 hover:text-text-1 hover:border-line-2",
      )}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </button>
  );
}

type Tab = "link" | "file";

function AddResourceModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: {
    title: string;
    kind: Kind;
    source?: string;
    url?: string;
  }) => void;
}) {
  const [tab, setTab] = useState<Tab>("link");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Kind>("READING");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");

  /* file upload */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<{
    url: string;
    title: string;
    sizeBytes: number;
    extension: string;
  } | null>(null);

  const handlePickFile = async (file: File) => {
    setUploadError(null);
    setUploading(true);
    setUploaded(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-resource", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.message ?? "Upload failed.");
        return;
      }
      setUploaded(data);
      if (!title.trim()) setTitle(data.title);
      setUrl(data.url);
      setKind("READING");
    } catch {
      setUploadError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    if (tab === "file" && !uploaded) return;

    onCreate({
      title: title.trim(),
      kind,
      source: source.trim() || (tab === "file" ? uploaded?.extension.toUpperCase() : undefined),
      url: (tab === "file" ? uploaded?.url : url.trim()) || undefined,
    });

    if (tab === "file" && uploaded) {
      pushNotif({
        iconKey: "upload",
        title: `Uploaded ${title.trim() || uploaded.title}`,
        body: `${uploaded.extension.toUpperCase()} added to your learning queue.`,
        tint: "#dcecfa",
        iconColor: "#0075de",
        href: "/learn",
      });
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
        className="fixed inset-x-0 top-[14vh] z-50 mx-auto max-w-md px-4"
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-2xl bg-ink-2 border border-line-2 shadow-[0_24px_60px_rgba(0,0,0,0.6)] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-text-1 text-xl font-light">
              Add a resource
            </h2>
            <button
              onClick={onClose}
              className="text-text-4 hover:text-text-2 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs: link vs file */}
          <div
            className="grid grid-cols-2 gap-1 p-1 rounded-lg"
            style={{ background: "rgba(0,0,0,0.04)" }}
          >
            <TabBtn
              active={tab === "link"}
              onClick={() => setTab("link")}
              icon={ExternalLink}
              label="Link"
            />
            <TabBtn
              active={tab === "file"}
              onClick={() => setTab("file")}
              icon={Upload}
              label="Upload file"
            />
          </div>

          {tab === "link" ? (
            <>
              <Field
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you learning?"
                autoFocus
              />
              <div className="flex gap-2">
                {(["READING", "COURSE", "WATCHING"] as Kind[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors border",
                      kind === k
                        ? "bg-[#5645d4] text-white border-transparent"
                        : "border-line-1 text-text-3 hover:text-text-1 hover:border-line-2",
                    )}
                  >
                    {KIND_LABEL[k]}
                  </button>
                ))}
              </div>
              <Field
                label="Source (optional)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Author, channel, platform"
              />
              <Field
                label="URL (optional)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
              />
            </>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full rounded-xl border border-dashed border-line-2 hover:border-[#5645d4] hover:bg-vellum-1 transition-colors p-6 flex flex-col items-center gap-2 text-center disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Upload className="w-6 h-6 text-[#5645d4] animate-pulse" />
                    <p className="text-text-2 text-sm font-medium">
                      Uploading…
                    </p>
                  </>
                ) : uploaded ? (
                  <>
                    <FileText className="w-6 h-6 text-[#5645d4]" />
                    <p className="text-text-1 text-sm font-medium truncate max-w-full">
                      {uploaded.title}
                    </p>
                    <p className="text-text-4 text-xs">
                      {uploaded.extension.toUpperCase()} ·{" "}
                      {(uploaded.sizeBytes / (1024 * 1024)).toFixed(2)} MB ·
                      Click to replace
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-text-3" />
                    <p className="text-text-2 text-sm font-medium">
                      Drop a file or click to choose
                    </p>
                    <p className="text-text-4 text-xs">
                      PDF, DOCX, PPTX · max 25 MB
                    </p>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.pptx,.doc,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handlePickFile(f);
                  e.target.value = "";
                }}
              />

              {uploadError && (
                <div
                  className="flex items-start gap-2 px-3 py-2 rounded-md"
                  style={{
                    background: "rgba(224,49,49,0.08)",
                    color: "#e03131",
                  }}
                >
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium">{uploadError}</p>
                </div>
              )}

              {uploaded && (
                <Field
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give it a name"
                />
              )}
            </>
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
              disabled={
                !title.trim() ||
                (tab === "file" && !uploaded) ||
                uploading
              }
              onClick={handleSubmit}
            >
              {tab === "file" ? "Add to learning" : "Add"}
            </CandleButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function TabBtn({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Upload;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors",
        active
          ? "bg-white text-[#1a1a1a] shadow-[0_1px_2px_rgba(15,15,15,0.06)]"
          : "text-text-3 hover:text-text-1",
      )}
      style={
        active
          ? { color: "#1a1a1a" }
          : undefined
      }
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function DetailPanel({
  resource,
  onClose,
  onUpdate,
  onDelete,
}: {
  resource: Resource;
  onClose: () => void;
  onUpdate: (data: Partial<Resource>) => void;
  onDelete: () => void;
}) {
  const [progress, setProgress] = useState(resource.progress);
  const [takeaways, setTakeaways] = useState(resource.takeaways);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-30 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed right-0 top-0 h-full w-full max-w-lg z-40 flex flex-col bg-ink-2 border-l border-line-1"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-line-1">
          <p className="text-text-4 text-xs tracking-widest uppercase">
            {KIND_LABEL[resource.kind]}
          </p>
          <button
            onClick={onClose}
            className="text-text-4 hover:text-text-2 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-7 py-6 overflow-y-auto flex flex-col gap-6">
          <h2 className="font-serif text-text-1 text-3xl font-light leading-tight">
            {resource.title}
          </h2>

          {resource.source && (
            <p className="text-text-3 text-sm font-light">{resource.source}</p>
          )}

          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-text-2 hover:text-text-1 text-xs font-light w-fit"
            >
              Open <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-3 text-xs tracking-widest uppercase">
                Progress
              </span>
              <span className="font-serif text-text-2 text-base tabular-nums">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              onMouseUp={() => onUpdate({ progress })}
              onTouchEnd={() => onUpdate({ progress })}
              className="w-full slider-candle"
            />
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
                cursor: pointer;
              }
            `}</style>
          </div>

          <div>
            <p className="text-text-3 text-xs tracking-widest uppercase mb-2">
              Takeaways
            </p>
            <textarea
              value={takeaways}
              onChange={(e) => setTakeaways(e.target.value)}
              onBlur={() => onUpdate({ takeaways })}
              placeholder="What did you learn?"
              className="w-full bg-vellum-2 border border-line-1 rounded-xl px-4 py-3 text-text-1 text-sm font-light leading-relaxed outline-none placeholder:text-text-4 resize-none min-h-[120px] focus:border-line-3"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <StatusButton
              icon={Play}
              label="Active"
              active={resource.status === "ACTIVE"}
              onClick={() => onUpdate({ status: "ACTIVE" })}
            />
            <StatusButton
              icon={Pause}
              label="Pause"
              active={resource.status === "PAUSED"}
              onClick={() => onUpdate({ status: "PAUSED" })}
            />
            <StatusButton
              icon={Check}
              label="Done"
              active={resource.status === "DONE"}
              onClick={() => onUpdate({ status: "DONE", progress: 100 })}
            />
            <button
              onClick={() => onUpdate({ nowReading: !resource.nowReading })}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-colors border ml-auto",
                resource.nowReading
                  ? "bg-candle-grad text-ink-1 border-transparent"
                  : "border-line-2 text-text-3 hover:text-text-1",
              )}
            >
              {resource.nowReading ? "★ Now Reading" : "Set as Now Reading"}
            </button>
          </div>
        </div>

        <div className="px-7 py-4 border-t border-line-1 flex items-center justify-between">
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 text-text-4 hover:text-[var(--color-danger)] text-xs font-light transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </motion.div>
    </>
  );
}

function StatusButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Play;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-colors border",
        active
          ? "bg-vellum-3 text-text-1 border-line-2"
          : "border-line-1 text-text-3 hover:text-text-1 hover:border-line-2",
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}
