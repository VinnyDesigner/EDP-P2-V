import { useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { ArrowUpRight, Command, Search, X } from "lucide-react";
import { APPS, type AppGroup } from "@/lib/edp-apps";

type Filter = "all" | AppGroup;

function AppIcon({ name, className }: { name: string; className?: string }) {
  const I = (Icons as unknown as Record<string, React.ComponentType<{ className?: string | undefined }>>)[name] ?? Icons.Circle;
  return <I className={className} />;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function AppIndex4({ onActive }: { onActive: (i: number | null) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [hover, setHover] = useState<number | null>(null);
  const [palette, setPalette] = useState(false);
  const [q, setQ] = useState("");
  const preview = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const list = useMemo(() => APPS.map((a, i) => ({ ...a, i })).filter((a) => filter === "all" || a.group === filter), [filter]);
  const results = useMemo(() => APPS.map((a, i) => ({ ...a, i })).filter((a) => (a.name + " " + a.desc).toLowerCase().includes(q.toLowerCase())), [q]);
  const counts = { all: APPS.length, platform: APPS.filter((a) => a.group === "platform").length, ai: APPS.filter((a) => a.group === "ai").length };

  // smooth cursor-follow preview
  useEffect(() => {
    let raf = 0;
    const mv = (e: PointerEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    const loop = () => {
      const p = pos.current; p.x += (p.tx - p.x) * 0.15; p.y += (p.ty - p.y) * 0.15;
      if (preview.current) preview.current.style.transform = `translate3d(${p.x + 28}px, ${p.y - 120}px, 0) rotate(${(p.tx - p.x) * 0.04}deg)`;
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
              <span key={k} className="flex items-center gap-10">{a.name}<span className="h-1.5 w-1.5 rounded-full bg-primary" /></span>
            ))}
          </div>
        </div>

        {/* Header: counters are the filters */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-primary">Index of applications</p>
            <div className="mt-6 flex items-end gap-6 md:gap-10">
              {([["all", "All"], ["platform", "Platforms"], ["ai", "AI Models"]] as const).map(([k, l]) => (
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
            <Search className="h-4 w-4" /> Search applications
            <span className="flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px]"><Command className="h-3 w-3" />K</span>
          </button>
        </div>

        {/* Kinetic index list */}
        <ul className="mt-14 border-t border-border" onMouseLeave={leave}>
          {list.map((a, n) => {
            const dim = hover !== null && hover !== a.i;
            return (
              <li key={a.name} className="animate-rise" style={{ animationDelay: `${Math.min(n, 14) * 0.03}s` }}>
                <a href="#" onMouseEnter={() => enter(a.i)}
                  className={`group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-border py-5 transition-all duration-500 md:grid-cols-[4rem_1fr_10rem_auto] md:py-6 ${dim ? "opacity-25 blur-[1px]" : "opacity-100"}`}>
                  <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="relative font-mono text-xs text-muted-foreground">{pad(a.i + 1)}</span>
                  <span className="relative">
                    <span className="block font-display text-2xl font-light tracking-tight transition-transform duration-500 group-hover:translate-x-4 md:text-5xl">{a.name}</span>
                    <span className="mt-1 block text-sm text-muted-foreground md:hidden">{a.desc}</span>
                  </span>
                  <span className="relative hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">{a.group === "ai" ? "AI · Model" : "Platform"}</span>
                  <span className="relative grid h-11 w-11 place-items-center rounded-full border border-border transition duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Floating preview card (desktop) */}
      <div ref={preview} className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
        <div className={`w-72 overflow-hidden rounded-2xl glass shadow-glow backdrop-blur-xl transition-all duration-300 ${h ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
          <div className="relative grid h-36 place-items-center border-b border-border">
            <div className="grid-bg absolute inset-0 opacity-60" />
            <div className="scanline absolute inset-x-0 top-0 h-1/2" />
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              {h && <AppIcon name={h.icon} className="h-7 w-7" />}
            </div>
          </div>
          <div className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">{h?.group === "ai" ? "AI · Model" : "Platform"} / {hover !== null ? pad(hover + 1) : ""}</div>
            <div className="mt-2 font-display font-semibold">{h?.name}</div>
            <p className="mt-2 text-sm text-muted-foreground">{h?.desc}</p>
          </div>
        </div>
      </div>

      {/* Command palette */}
      {palette && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-background/70 px-4 pt-[15vh] backdrop-blur-md" onClick={() => setPalette(false)}>
          <div className="mx-auto w-full max-w-xl animate-rise overflow-hidden rounded-2xl glass shadow-glow" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-4 w-4 text-primary" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search platforms and AI models…" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
              <button onClick={() => setPalette(false)} aria-label="Close search"><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.map((a) => (
                <a key={a.name} href="#" onMouseEnter={() => onActive(a.i)} className="flex items-center gap-4 rounded-xl px-3 py-3 transition hover:bg-secondary">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-border text-primary"><AppIcon name={a.icon} className="h-4 w-4" /></span>
                  <span className="flex-1"><span className="block text-sm font-medium">{a.name}</span><span className="line-clamp-1 text-xs text-muted-foreground">{a.desc}</span></span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.group === "ai" ? "AI" : "Platform"}</span>
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

