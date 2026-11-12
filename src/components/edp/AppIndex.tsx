import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { ArrowUpRight, Command, Search, X } from "lucide-react";
import { APPS, type AppGroup } from "@/lib/edp-apps";

type Filter = "all" | "applications" | AppGroup;

function AppIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, React.ComponentType<{ className?: string | undefined }>>)[name] ?? Icons.Circle;
  return <I className={className} />;
}

const pad = (n: number) => String(n).padStart(2, "0");

const groupLabel = (g: AppGroup) =>
  g === "ai" ? "AI · Model" : g === "catalogue" ? "Catalog · Theme" : "Application · Platform";

export default function AppIndex({ onActive, ar = false }: { onActive: (i: number | null) => void; ar?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [hover, setHover] = useState<number | null>(null);
  const [palette, setPalette] = useState(false);
  const [q, setQ] = useState("");
  const preview = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const list = useMemo(
    () =>
      APPS.map((a, i) => ({ ...a, i })).filter((a) => {
        if (filter === "all") return true;
        if (filter === "applications") return a.tab === "applications";
        return a.group === filter;
      }),
    [filter]
  );
  const results = useMemo(
    () =>
      APPS.map((a, i) => ({ ...a, i })).filter((a) =>
        (a.name + " " + a.nameAr + " " + a.desc + " " + a.descAr).toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );
  const counts: Record<Filter, number> = {
    all: APPS.length,
    applications: APPS.filter((a) => a.tab === "applications").length,
    catalogue: APPS.filter((a) => a.group === "catalogue").length,
    platform: APPS.filter((a) => a.group === "platform").length,
    ai: APPS.filter((a) => a.group === "ai").length,
  };

  // smooth cursor-follow preview
  useEffect(() => {
    let raf = 0;
    const mv = (e: PointerEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    const loop = () => {
      const p = pos.current; p.x += (p.tx - p.x) * 0.15; p.y += (p.ty - p.y) * 0.15;
      if (preview.current) preview.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 140}px, 0) rotate(${(p.tx - p.x) * 0.04}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", mv); raf = requestAnimationFrame(loop);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((v) => !v); }
      if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", mv); window.removeEventListener("keydown", key); };
  }, []);

  const enter = (i: number) => { setHover(i); onActive(i); };
  const leave = () => { setHover(null); onActive(null); };
  const h = hover !== null ? APPS[hover] : null;

  return (
    <section id="apps" className="relative z-10 px-6 pb-32 pt-10 md:px-12">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl">
        {/* Marquee */}
        <div className="relative -mx-6 mb-16 overflow-hidden border-y border-border py-4 md:-mx-12">
          <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-sm uppercase tracking-[0.4em] text-muted-foreground">
            {[...APPS, ...APPS].map((a, k) => (
              <span key={k} className="flex items-center gap-10">{ar ? a.nameAr : a.name}<span className="h-1.5 w-1.5 rounded-full bg-primary" /></span>
            ))}
          </div>
        </div>

        {/* Header: counters are the filters */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-primary">Index of applications &amp; catalogues</p>
            <div className="mt-6 flex flex-wrap items-end gap-6 md:gap-10">
              {([
                ["all", "All"],
                ["applications", "Applications"],
                ["catalogue", "Catalogues"],
                ["platform", "Platforms"],
                ["ai", "AI Models"],
              ] as const).map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)} className="group text-left">
                  <div className={`font-display text-5xl font-light leading-none tabular-nums transition md:text-7xl ${filter === k ? "text-aurora font-semibold" : "text-muted-foreground/40 group-hover:text-foreground"}`}>{pad(counts[k])}</div>
                  <div className={`mt-2 font-mono text-[11px] uppercase tracking-[0.3em] transition ${filter === k ? "text-primary" : "text-muted-foreground"}`}>
                    {filter === k ? "● " : ""}{l}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setPalette(true)} className="flex items-center gap-3 self-start rounded-full glass px-5 py-3 text-sm text-muted-foreground transition hover:text-foreground hover:shadow-glow md:self-auto">
            <Search className="h-4 w-4" /> Search applications &amp; catalogues
            <span className="flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px]"><Command className="h-3 w-3" />K</span>
          </button>
        </div>

        {/* Kinetic index list */}
        <ul className="mt-14 border-t border-border" onMouseLeave={leave}>
          {list.map((a, n) => {
            const dim = hover !== null && hover !== a.i;
            const title = ar ? a.nameAr : a.name;
            const desc = ar ? a.descAr : a.desc;
            return (
              <li key={a.name + "-" + a.i} className="animate-rise" style={{ animationDelay: `${Math.min(n, 14) * 0.03}s` }}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" onMouseEnter={() => enter(a.i)}
                  className={`group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-border py-5 transition-all duration-500 md:grid-cols-[4rem_1fr_11rem_auto] md:py-6 ${dim ? "opacity-25 blur-[1px]" : "opacity-100"}`}>
                  <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="relative font-mono text-xs text-muted-foreground">{pad(a.i + 1)}</span>
                  <span className="relative">
                    <span className="block font-display text-2xl font-light tracking-tight transition-transform duration-500 group-hover:translate-x-4 md:text-5xl">{title}</span>
                    <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground md:hidden">{desc}</span>
                  </span>
                  <span className="relative hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">{groupLabel(a.group)}</span>
                  <span className="relative grid h-11 w-11 place-items-center rounded-full border border-border transition duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Floating preview popover card (desktop) — uses exact EDP thumbnails & content */}
      <div ref={preview} className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
        <div className={`w-80 overflow-hidden rounded-2xl glass shadow-glow backdrop-blur-xl transition-all duration-300 ${h ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
          <div className="relative h-44 w-full overflow-hidden border-b border-border bg-secondary/40">
            {h && (
              <img
                src={h.image}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = h.remoteImage; }}
                alt={ar ? h.nameAr : h.name}
                className="h-full w-full object-cover transition-transform duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="scanline absolute inset-x-0 top-0 h-1/2 opacity-40" />
            <span className="absolute left-3 top-3 rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-primary backdrop-blur-md">
              {h ? groupLabel(h.group) : ""}
            </span>
            <div className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
              {h && <AppIcon name={h.icon} className="h-5 w-5" />}
            </div>
            <span className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/80">
              {hover !== null ? `#${pad(hover + 1)}` : ""}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="font-display text-lg font-semibold leading-snug text-foreground">
                {h ? (ar ? h.nameAr : h.name) : ""}
              </div>
              {h && (
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {ar ? h.name : h.nameAr}
                </span>
              )}
            </div>
            <p className="mt-2.5 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
              {h ? (ar ? h.descAr : h.desc) : ""}
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-primary">
              <span>{ar ? "استكشف" : "Explore on EDP"}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Command palette */}
      {palette && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-background/70 px-4 pt-[15vh] backdrop-blur-md" onClick={() => setPalette(false)}>
          <div className="mx-auto w-full max-w-xl animate-rise overflow-hidden rounded-2xl glass shadow-glow" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-4 w-4 text-primary" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search applications, AI models, and catalogues…" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
              <button onClick={() => setPalette(false)} aria-label="Close search"><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto p-2">
              {results.map((a) => (
                <a key={a.name + "-" + a.i} href={a.url} target="_blank" rel="noopener noreferrer" onMouseEnter={() => onActive(a.i)} className="flex items-center gap-4 rounded-xl px-3 py-2.5 transition hover:bg-secondary">
                  <img
                    src={a.image}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = a.remoteImage; }}
                    alt={a.name}
                    className="h-11 w-14 shrink-0 rounded-lg border border-border object-cover"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-sm font-medium">{ar ? a.nameAr : a.name}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{ar ? a.descAr : a.desc}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {a.group === "ai" ? "AI" : a.group === "catalogue" ? "Catalog" : "App"}
                  </span>
                </a>
              ))}
              {results.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No results.</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
