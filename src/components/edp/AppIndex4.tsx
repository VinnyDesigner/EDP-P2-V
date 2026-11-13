import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as Icons from "lucide-react";
import {
  ArrowUpRight,
  Command,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Sparkles,
  Layers,
  Activity,
  Compass,
  Radio,
  SlidersHorizontal,
  Eye
} from "lucide-react";
import { APPS, type AppGroup, type EdpApp } from "@/lib/edp-apps";

type Filter = "all" | AppGroup | "catalogue";

function AppIcon({ name, className }: { name: string; className?: string }) {
  const I =
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string | undefined }>>)[name] ??
    Icons.Circle;
  return <I className={className} />;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function AppIndex4({ onActive }: { onActive: (i: number | null) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [palette, setPalette] = useState(false);
  const [q, setQ] = useState("");
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  // Filtered list with original indices preserved
  const list = useMemo(() => {
    return APPS.map((a, i) => ({ ...a, i })).filter((a) => {
      if (filter === "all") return true;
      if (filter === "catalogue") return a.tab === "catalogues" || a.group === "catalogue";
      return a.group === filter;
    });
  }, [filter]);

  // When filter changes, reset active card to 0
  useEffect(() => {
    setActiveIdx(0);
  }, [filter]);

  // Update map pin when active card changes
  useEffect(() => {
    if (list[activeIdx]) {
      onActive(list[activeIdx].i);
    }
  }, [activeIdx, list, onActive]);

  // Navigation handlers
  const nextCard = useCallback(() => {
    if (list.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % list.length);
  }, [list.length]);

  const prevCard = useCallback(() => {
    if (list.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + list.length) % list.length);
  }, [list.length]);

  // Keyboard navigation (ArrowLeft / ArrowRight / Cmd+K)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
      if (e.key === "Escape") setPalette(false);
      if (e.key === "ArrowRight") nextCard();
      if (e.key === "ArrowLeft") prevCard();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextCard, prevCard]);

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || list.length === 0) return;
    const interval = setInterval(nextCard, 5000);
    return () => clearInterval(interval);
  }, [autoplay, nextCard, list.length]);

  // Mouse tilt on the active card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 14, y: -y * 14 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Pointer drag gestures
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    setDragOffset(delta);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 70) {
      prevCard();
    } else if (dragOffset < -70) {
      nextCard();
    }
    setDragOffset(0);
  };

  // Search results for Command Palette
  const results = useMemo(() => {
    return APPS.map((a, i) => ({ ...a, i })).filter((a) =>
      (a.name + " " + a.nameAr + " " + a.desc).toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const counts = {
    all: APPS.length,
    platform: APPS.filter((a) => a.group === "platform").length,
    ai: APPS.filter((a) => a.group === "ai").length,
    catalogue: APPS.filter((a) => a.tab === "catalogues" || a.group === "catalogue").length,
  };

  const activeApp = list[activeIdx] ?? list[0];

  return (
    <section id="apps" className="relative z-10 overflow-hidden px-4 pb-36 pt-16 md:px-12">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(16,185,129,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute -left-48 top-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-48 top-1/3 -z-10 h-96 w-96 rounded-full bg-[#c5a059]/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Top Marquee */}
        <div className="relative -mx-4 mb-14 overflow-hidden border-y border-border/60 py-3.5 md:-mx-12">
          <div className="marquee flex w-max gap-12 whitespace-nowrap font-mono text-xs uppercase tracking-[0.45em] text-muted-foreground/80">
            {[...APPS, ...APPS].map((a, k) => (
              <span key={k} className="flex items-center gap-12">
                <span className="text-foreground/90 font-medium">{a.name}</span>
                <span className="text-xs text-primary/70">{a.nameAr}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_#10b981]" />
              </span>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.4em] text-primary">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span>Interactive 3D Portfolio</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-[#c5a059]">{list.length} Systems</span>
            </div>

            <h2 className="mt-4 text-3xl font-light tracking-tight text-foreground md:text-5xl">
              Floating <span className="font-semibold text-aurora">Intelligence Carousel</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Glide through Abu Dhabi's live environmental platforms, predictive AI services, and authoritative
              biodiversity registries with interactive 3D spatial positioning.
            </p>
          </div>

          {/* Quick Action Tools */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAutoplay((v) => !v)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-mono uppercase tracking-wider transition ${
                autoplay
                  ? "border-primary bg-primary/20 text-primary shadow-glow"
                  : "border-border/70 glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${autoplay ? "animate-pulse text-primary" : ""}`} />
              <span>{autoplay ? "Autoplay ON" : "Autoplay OFF"}</span>
            </button>

            <button
              onClick={() => setPalette(true)}
              className="flex items-center gap-3 rounded-full glass border border-border/70 px-4 py-2 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground hover:shadow-glow"
            >
              <Search className="h-3.5 w-3.5 text-primary" />
              <span>Search index</span>
              <span className="flex items-center gap-0.5 rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
                <Command className="h-2.5 w-2.5" />K
              </span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap items-center gap-3 border-b border-border/50 pb-6">
          {(
            [
              ["all", "All Solutions", counts.all, Sparkles],
              ["platform", "Live Platforms", counts.platform, Activity],
              ["ai", "Conservation AI", counts.ai, Sparkles],
              ["catalogue", "Catalogues", counts.catalogue, Layers],
            ] as const
          ).map(([key, label, count, Icon]) => {
            const isSelected = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`group flex items-center gap-2.5 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider transition-all duration-300 ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500 to-teal-700 text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] scale-105"
                    : "glass border border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-primary"}`} />
                <span>{label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                    isSelected ? "bg-black/30 text-white" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {pad(count)}
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            3D FLOATING CAROUSEL STAGE
           ========================================================================= */}
        <div
          className="relative mt-12 flex h-[620px] w-full select-none items-center justify-center overflow-visible"
          style={{ perspective: "1500px", perspectiveOrigin: "50% 48%" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* Subtle 3D Radar Grid Floor */}
          <div
            className="pointer-events-none absolute bottom-6 inset-x-0 h-44 opacity-25"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.2) 50%, rgba(197,160,89,0.15) 100%)",
              maskImage: "radial-gradient(ellipse at 50% 100%, black 30%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 100%, black 30%, transparent 80%)",
              transform: "rotateX(75deg) translateZ(-60px)",
            }}
          />

          {/* Cards Track */}
          <div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            {list.map((app, idx) => {
              // Calculate delta distance from active center
              let diff = idx - activeIdx;
              const total = list.length;

              // Enable circular nearest-path navigation if list is large
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const absDiff = Math.abs(diff);

              // Render window of +/- 3 neighbors
              if (absDiff > 3) return null;

              const isCenter = diff === 0;

              // Calculate 3D transforms
              const dragShift = isDragging ? dragOffset * 0.4 : 0;
              const translateX = diff * 340 + dragShift;
              const translateZ = -Math.pow(absDiff, 1.25) * 120;
              const rotateY = -diff * 20;
              const scale = Math.max(0.68, 1 - absDiff * 0.12);
              const opacity = Math.max(0.18, 1 - absDiff * 0.28);
              const blur = isCenter ? 0 : absDiff * 1.5;
              const zIndex = 50 - Math.round(absDiff * 10);

              // Interactive 3D tilt applied only on center active card
              const currentRotateX = isCenter ? tilt.y : 0;
              const currentRotateY = isCenter ? rotateY + tilt.x : rotateY;

              const isAI = app.group === "ai";
              const isCatalogue = app.tab === "catalogues" || app.group === "catalogue";
              const badgeTheme = isAI
                ? "bg-[#c5a059]/90 text-black border-[#c5a059]"
                : isCatalogue
                ? "bg-cyan-500/90 text-white border-cyan-400"
                : "bg-emerald-500/90 text-white border-emerald-400";

              return (
                <div
                  key={app.name}
                  onClick={() => !isCenter && setActiveIdx(idx)}
                  onMouseMove={isCenter ? handleMouseMove : undefined}
                  onMouseLeave={isCenter ? handleMouseLeave : undefined}
                  className={`absolute top-1/2 left-1/2 w-[380px] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:w-[410px] ${
                    isCenter ? "cursor-default" : "hover:brightness-110"
                  }`}
                  style={{
                    transform: `translate3d(calc(-50% + ${translateX}px), -50%, ${translateZ}px) rotateY(${currentRotateY}deg) rotateX(${currentRotateX}deg) scale(${scale})`,
                    opacity,
                    filter: `blur(${blur}px)`,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Floating Card Body with Glassmorphism */}
                  <div
                    className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                      isCenter
                        ? "border-[#c5a059]/40 bg-gradient-to-b from-[#06201a]/95 via-[#031410]/95 to-[#010a08]/98 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.25)]"
                        : "border-border/40 bg-[#041612]/80 backdrop-blur-md"
                    }`}
                  >
                    {/* Glowing holographic corner notches */}
                    {isCenter && (
                      <>
                        <div className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l-2 border-t-2 border-[#10b981]" />
                        <div className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r-2 border-t-2 border-[#c5a059]" />
                        <div className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b-2 border-l-2 border-[#c5a059]" />
                        <div className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b-2 border-r-2 border-[#10b981]" />
                      </>
                    )}

                    {/* Thumbnail Image Cover */}
                    <div className="relative h-48 w-full overflow-hidden bg-black/40">
                      <img
                        src={app.image}
                        alt={app.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = app.remoteImage || "/edp-thumbs/img-97.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#031410] via-transparent to-black/30" />

                      {/* Top Overlay Badges */}
                      <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between">
                        <span
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] font-bold tracking-wider backdrop-blur-md ${badgeTheme}`}
                        >
                          {isAI ? (
                            <>
                              <Sparkles className="h-3 w-3" />
                              <span>CONSERVATION AI</span>
                            </>
                          ) : isCatalogue ? (
                            <>
                              <Layers className="h-3 w-3" />
                              <span>CATALOGUE</span>
                            </>
                          ) : (
                            <>
                              <Activity className="h-3 w-3" />
                              <span>LIVE PLATFORM</span>
                            </>
                          )}
                        </span>

                        <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-300 backdrop-blur-md">
                          #{pad(app.i + 1)}
                        </span>
                      </div>

                      {/* Coordinates GPS Tag */}
                      <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-emerald-300/80">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>
                          LAT {app.lat.toFixed(2)}°N &middot; LON {app.lon.toFixed(2)}°E
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-bold tracking-tight text-white group-hover:text-primary transition">
                            {app.name}
                          </h3>
                          <div className="mt-1 font-arabic text-sm font-semibold text-[#c5a059]" dir="rtl">
                            {app.nameAr}
                          </div>
                        </div>

                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                          <AppIcon name={app.icon} className="h-4 w-4" />
                        </div>
                      </div>

                      <p className="mt-3.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground/90">
                        {app.desc}
                      </p>

                      {/* Key Attribute Pills */}
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {isAI ? "Machine Learning" : isCatalogue ? "Spatial Registry" : "Real-Time Telemetry"}
                        </span>
                        <span className="rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                          EAD Governed
                        </span>
                        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                          Active Link
                        </span>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onActive(app.i);
                            const mapElem = document.querySelector("#hero, header");
                            mapElem?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-[#c5a059]"
                        >
                          <Compass className="h-3.5 w-3.5 text-[#c5a059]" />
                          <span>Pin on 3D Map</span>
                        </button>

                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-700 px-4 py-1.5 text-xs font-bold text-white shadow-[0_2px_12px_rgba(16,185,129,0.35)] transition hover:brightness-110 hover:scale-105"
                        >
                          <span>Launch Portal</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Mirrored Reflection underneath */}
                  {isCenter && (
                    <div
                      className="pointer-events-none absolute -bottom-48 inset-x-0 h-44 opacity-20 blur-[1px] -scale-y-100 overflow-hidden"
                      style={{
                        maskImage: "linear-gradient(to top, transparent 40%, black 100%)",
                        WebkitMaskImage: "linear-gradient(to top, transparent 40%, black 100%)",
                      }}
                    >
                      <div className="rounded-3xl border border-white/10 bg-[#06201a] p-6">
                        <div className="h-32 w-full rounded-2xl bg-black/40" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Navigation Controls (Left / Right Arrows) */}
          <button
            onClick={prevCard}
            aria-label="Previous card"
            className="absolute left-2 z-50 grid h-12 w-12 place-items-center rounded-full border border-[#c5a059]/40 bg-[#031410]/85 text-white shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl transition hover:scale-110 hover:border-primary hover:bg-primary/20 hover:text-primary md:left-8 md:h-14 md:w-14"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextCard}
            aria-label="Next card"
            className="absolute right-2 z-50 grid h-12 w-12 place-items-center rounded-full border border-[#c5a059]/40 bg-[#031410]/85 text-white shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl transition hover:scale-110 hover:border-primary hover:bg-primary/20 hover:text-primary md:right-8 md:h-14 md:w-14"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* =========================================================================
            BOTTOM SCRUBBER & TIMELINE CONTROLS
           ========================================================================= */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 md:flex-row">
          {/* Active Card Indicator */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-2xl font-light tabular-nums text-foreground">
              <span className="font-semibold text-aurora">{pad(activeIdx + 1)}</span>
              <span className="text-muted-foreground/50"> / </span>
              <span className="text-muted-foreground">{pad(list.length)}</span>
            </span>

            <div className="h-5 w-[1px] bg-border" />

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">{activeApp?.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                {activeApp?.group === "ai" ? "Conservation AI" : activeApp?.tab === "catalogues" ? "Catalogue" : "Platform"}
              </span>
            </div>
          </div>

          {/* Interactive Dot Track */}
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto py-2">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                aria-label={`Jump to item ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIdx === i
                    ? "w-8 bg-gradient-to-r from-emerald-400 to-[#c5a059] shadow-[0_0_10px_#10b981]"
                    : "w-2 bg-border/80 hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>

          {/* Interaction hints */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5">
              &larr; &rarr;
            </span>
            <span>Use keys or drag to slide</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          COMMAND PALETTE MODAL (CMD + K)
         ========================================================================= */}
      {palette && (
        <div
          className="fixed inset-0 z-50 grid place-items-start bg-background/80 px-4 pt-[12vh] backdrop-blur-xl"
          onClick={() => setPalette(false)}
        >
          <div
            className="mx-auto w-full max-w-2xl animate-rise overflow-hidden rounded-3xl border border-[#c5a059]/40 bg-[#031410]/95 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(16,185,129,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border/70 px-6 py-5">
              <Search className="h-5 w-5 text-primary" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search platforms, AI avatars, biodiversity catalogues..."
                className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setPalette(false)}
                aria-label="Close search"
                className="rounded-full p-1 text-muted-foreground transition hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-3">
              {results.map((a) => (
                <div
                  key={a.name}
                  onClick={() => {
                    const foundIdx = list.findIndex((item) => item.name === a.name);
                    if (foundIdx !== -1) setActiveIdx(foundIdx);
                    onActive(a.i);
                    setPalette(false);
                  }}
                  className="flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition hover:bg-primary/10"
                >
                  <img
                    src={a.image}
                    alt={a.name}
                    className="h-12 w-12 rounded-xl object-cover border border-border/60"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = a.remoteImage || "/edp-thumbs/img-97.jpg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-foreground truncate">{a.name}</span>
                      <span className="font-arabic text-xs text-[#c5a059]" dir="rtl">{a.nameAr}</span>
                    </div>
                    <p className="line-clamp-1 text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-primary">
                    {a.group === "ai" ? "AI" : a.tab === "catalogues" ? "Catalogue" : "Platform"}
                  </span>
                </div>
              ))}
              {results.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">
                  No environmental platforms match &ldquo;{q}&rdquo;.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
