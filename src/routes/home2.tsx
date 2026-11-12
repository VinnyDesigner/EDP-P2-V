import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { ArrowUpRight, MessageCircle, Send, X } from "lucide-react";
import { APPS, ABU_DHABI, type AppGroup } from "@/lib/edp-apps";
import Lenis from "lenis";
import type { Shot } from "@/components/edp/CesiumStage";

const CesiumStage = lazy(() => import("@/components/edp/CesiumStage"));

export const Route = createFileRoute("/home2")({
  head: () => ({
    meta: [
      { title: "EAD Environmental Data Portal — A Journey Across Abu Dhabi" },
      { name: "description", content: "Travel across Abu Dhabi's real terrain and discover the Environment Agency's applications, AI models, and catalogues." },
      { property: "og:title", content: "EAD Environmental Data Portal — A Journey Across Abu Dhabi" },
      { property: "og:description", content: "Unlock environmental insights for a sustainable future." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600&display=swap" }],
  }),
  component: Home2,
});

const pad = (n: number) => String(n).padStart(2, "0");
const ROMAN = ["I", "II", "III", "IV"];

const groupBadge = (g: AppGroup) =>
  g === "ai" ? "AI Model" : g === "catalogue" ? "Catalogue" : "Application";

function Home2() {
  const [active, setActive] = useState<number | null>(null);
  const [chapter, setChapter] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const [indexPeek, setIndexPeek] = useState<number | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [chat, setChat] = useState(false);
  const [ar, setAr] = useState(false);
  const cursor = useRef(0);

  const platforms = APPS.map((a, i) => ({ ...a, i })).filter((a) => a.group === "platform");
  const models = APPS.map((a, i) => ({ ...a, i })).filter((a) => a.group === "ai");
  const catalogues = APPS.map((a, i) => ({ ...a, i })).filter((a) => a.group === "catalogue");

  // One camera shot per scroll "beat": hero, chapter intros, each app/catalogue, finale.
  const { beats, shots } = useMemo(() => {
    const b: { kind: string; app?: number }[] = [];
    const s: Shot[] = [];
    b.push({ kind: "hero" }); s.push({ lon: 54.4, lat: 14, h: 4200000, heading: 0, pitch: -88 });
    b.push({ kind: "ch1" }); s.push({ lon: ABU_DHABI.lon, lat: ABU_DHABI.lat - 0.9, h: 90000, heading: 0, pitch: -40 });
    platforms.forEach((a, k) => { b.push({ kind: "app", app: a.i }); s.push({ lon: a.lon + 0.15, lat: a.lat - 0.45, h: 42000, heading: -20 + k * 12, pitch: -32 }); });
    b.push({ kind: "ch2" }); s.push({ lon: 53.8, lat: 22.2, h: 380000, heading: 15, pitch: -48 });
    models.forEach((a, k) => { b.push({ kind: "app", app: a.i }); s.push({ lon: a.lon - 0.1, lat: a.lat - 0.4, h: 36000, heading: 20 - k * 9, pitch: -30 }); });
    b.push({ kind: "ch3" }); s.push({ lon: 54.2, lat: 23.6, h: 240000, heading: -10, pitch: -44 });
    catalogues.forEach((a, k) => { b.push({ kind: "app", app: a.i }); s.push({ lon: a.lon + 0.08, lat: a.lat - 0.38, h: 38000, heading: -15 + k * 10, pitch: -34 }); });
    b.push({ kind: "end" }); s.push({ lon: 54.3, lat: 20.5, h: 900000, heading: 0, pitch: -55 });
    return { beats: b, shots: s };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Inertial smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
    let id = 0; const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  // Map scroll → fractional beat index (camera cursor)
  useEffect(() => {
    const onScroll = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-beat]"));
      const mid = window.innerHeight * 0.5; let k = 0;
      for (let i = 0; i < els.length; i++) {
        const r = els[i]!.getBoundingClientRect();
        const c = r.top + r.height / 2;
        if (c <= mid) { const next = els[i + 1]?.getBoundingClientRect(); const nc = next ? next.top + next.height / 2 : c; k = i + (next && nc > c ? Math.min(1, (mid - c) / (nc - c)) : 0); }
      }
      cursor.current = k;
      const b = beats[Math.round(k)];
      const na = b?.kind === "app" ? b.app! : null; setActive((p) => (p === na ? p : na));
      const ch2 = beats.findIndex((x) => x.kind === "ch2");
      const ch3 = beats.findIndex((x) => x.kind === "ch3");
      setChapter((p) => {
        const rk = Math.round(k);
        const c = k < 0.5 ? 0 : b?.kind === "end" ? 4 : rk >= ch3 ? 3 : rk >= ch2 ? 2 : 1;
        return c === p ? p : c;
      });
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [beats]);

  const AppBeat = ({ a, n, total }: { a: (typeof platforms)[number]; n: number; total: number }) => {
    const title = ar ? a.nameAr : a.name;
    const desc = ar ? a.descAr : a.desc;
    const ctaLabel =
      a.group === "ai"
        ? ar ? "استكشف النموذج" : "Enter model"
        : a.group === "catalogue"
        ? ar ? "استكشف الفهرس" : "Explore catalogue"
        : ar ? "استكشف المنصة" : "Enter platform";

    return (
      <section data-beat className="relative flex min-h-[85vh] items-center px-6 md:px-16">
        <div className={`max-w-xl transition-all duration-1000 ${active === a.i ? "translate-y-0 opacity-100" : "translate-y-8 opacity-25"}`}>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
            <span>{pad(n)} / {pad(total)}</span>
            <span className="h-px w-12 bg-primary/60" />
            <span>{groupBadge(a.group)} · {a.lat.toFixed(2)}° N · {a.lon.toFixed(2)}° E</span>
          </div>
          <h3 className="mt-6 font-serif text-5xl font-normal leading-[1.02] md:text-7xl">{title}</h3>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">{desc}</p>
          <div className="relative mt-10 inline-block">
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setPeek(a.i)}
              onMouseLeave={() => setPeek(null)}
              onFocus={() => setPeek(a.i)}
              onBlur={() => setPeek(null)}
              className="group inline-flex items-center gap-4 border-b border-primary/50 pb-2 text-xs uppercase tracking-[0.3em] text-primary transition hover:border-primary"
            >
              {ctaLabel} <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <GlancePanel a={a} open={peek === a.i} ar={ar} />
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="theme-lux relative bg-background font-sans text-foreground" dir={ar ? "rtl" : "ltr"}>
      {/* Fixed cinematic stage */}
      <div className="fixed inset-0 z-0">
        <ClientOnly fallback={null}><Suspense fallback={null}><CesiumStage shots={shots} cursor={cursor} active={active} /></Suspense></ClientOnly>
        <div className="bg-veil pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_35%,var(--background)_100%)]" />
      </div>

      {/* Frame */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-16">
        <a href="/home2" aria-label="Environment Agency – Abu Dhabi" className="flex items-center">
          <img src="/edplogo.svg" alt="Environment Agency – Abu Dhabi" className="h-11 w-auto md:h-12" />
        </a>
        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.3em]">
          <button onClick={() => setAr(!ar)} className="text-muted-foreground transition hover:text-foreground">{ar ? "English" : "عربي"}</button>
          <button className="border border-primary/60 px-6 py-3 text-primary transition hover:bg-primary hover:text-primary-foreground">Sign In</button>
        </div>
      </header>

      {/* Chapter rail */}
      <nav className={`pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-5 transition-opacity duration-500 md:right-16 md:flex ${peek !== null || indexPeek !== null ? "opacity-0" : "opacity-100"}`}>
        {["Overture", "Platforms", "AI Models", "Catalogues", "Horizon"].map((l, i) => (
          <div key={l} className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] transition duration-700 ${chapter === i ? "text-primary" : "text-muted-foreground/50"}`}>
            {l}<span className={`h-px transition-all duration-700 ${chapter === i ? "w-12 bg-primary" : "w-5 bg-muted-foreground/40"}`} />
          </div>
        ))}
      </nav>
      <div className="fixed inset-x-0 bottom-0 z-30 h-px bg-border"><div ref={bar} className="h-full origin-left bg-primary" style={{ transform: "scaleX(0)" }} /></div>

      <main className="relative z-10">
        {/* Overture */}
        <section data-beat className="flex min-h-screen flex-col justify-center px-6 md:px-16">
          <p className="animate-rise text-[11px] uppercase tracking-[0.6em] text-primary" style={{ animationDelay: "0.3s" }}>Your Gateway to Environmental Insights</p>
          <h1 className="animate-rise mt-8 max-w-4xl font-serif text-6xl font-normal leading-[0.95] md:text-[8.5rem]" style={{ animationDelay: "0.6s" }}>
            Unlock <span className="font-semibold text-gold">Environmental</span><br />Insights
          </h1>
          <p className="animate-rise mt-8 font-serif text-2xl text-muted-foreground md:text-3xl" style={{ animationDelay: "0.9s" }}>for a Sustainable Future</p>
          <div className="animate-rise mt-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] text-muted-foreground" style={{ animationDelay: "1.2s" }}>
            <span className="h-12 w-px animate-pulse bg-primary" /> Scroll to descend
          </div>
        </section>

        {/* Chapter I: Platforms */}
        <section data-beat className="flex min-h-screen flex-col justify-center px-6 md:px-16">
          <div className="font-serif text-8xl font-normal text-gold md:text-[11rem]">{ROMAN[0]}</div>
          <h2 className="mt-2 font-serif text-5xl font-normal md:text-7xl">The Platforms</h2>
          <p className="mt-6 max-w-md text-muted-foreground">{pad(platforms.length)} environmental platforms, from the capital outward.</p>
        </section>
        {platforms.map((a, n) => <AppBeat key={a.name} a={a} n={n + 1} total={platforms.length} />)}

        {/* Chapter II: AI Models */}
        <section data-beat className="flex min-h-screen flex-col justify-center px-6 md:px-16">
          <div className="font-serif text-8xl font-normal text-gold md:text-[11rem]">{ROMAN[1]}</div>
          <h2 className="mt-2 font-serif text-5xl font-normal md:text-7xl">The AI Models</h2>
          <p className="mt-6 max-w-md text-muted-foreground">{pad(models.length)} AI models reading the land, the sea and the sky.</p>
        </section>
        {models.map((a, n) => <AppBeat key={a.name} a={a} n={n + 1} total={models.length} />)}

        {/* Chapter III: Catalogues */}
        <section data-beat className="flex min-h-screen flex-col justify-center px-6 md:px-16">
          <div className="font-serif text-8xl font-normal text-gold md:text-[11rem]">{ROMAN[2]}</div>
          <h2 className="mt-2 font-serif text-5xl font-normal md:text-7xl">The Catalogues</h2>
          <p className="mt-6 max-w-md text-muted-foreground">{pad(catalogues.length)} thematic environmental data catalogues across Abu Dhabi.</p>
        </section>
        {catalogues.map((a, n) => <AppBeat key={a.name} a={a} n={n + 1} total={catalogues.length} />)}

        {/* Horizon / Complete Index */}
        <section data-beat className="min-h-screen px-6 py-32 md:px-16">
          <div className="font-serif text-8xl font-normal text-gold md:text-[11rem]">{ROMAN[3]}</div>
          <h2 className="mt-2 font-serif text-5xl font-normal md:text-7xl">The Complete Index</h2>
          <div className="mt-16 grid max-w-5xl gap-x-16 md:grid-cols-2">
            {APPS.map((a, i) => (
              <div key={a.name + "-" + i} className="relative">
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setIndexPeek(i)}
                  onMouseLeave={() => setIndexPeek(null)}
                  onFocus={() => setIndexPeek(i)}
                  onBlur={() => setIndexPeek(null)}
                  className="group flex items-center gap-4 border-b border-border py-4 transition hover:border-primary"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">{pad(i + 1)}</span>
                  <img
                    src={a.image}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = a.remoteImage; }}
                    alt={ar ? a.nameAr : a.name}
                    className="h-9 w-12 shrink-0 rounded border border-border object-cover"
                  />
                  <span className="flex-1 font-serif text-2xl font-normal transition group-hover:translate-x-2 group-hover:text-primary">
                    {ar ? a.nameAr : a.name}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                    {groupBadge(a.group)}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100" />
                </a>
                <GlancePanel a={a} open={indexPeek === i} ar={ar} compact />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border bg-background px-6 py-10 md:px-16">
        <div className="flex flex-col items-center justify-between gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground md:flex-row">
          <div className="flex gap-8"><a href="#" className="hover:text-primary">Copyright</a><a href="#" className="hover:text-primary">Privacy Policy</a><a href="#" className="hover:text-primary">Terms &amp; Conditions</a></div>
          <div className="normal-case tracking-normal">© 2024 Abu Dhabi Government. All Rights Reserved. · Imagery &amp; terrain © Esri</div>
        </div>
      </footer>

      <div className="fixed bottom-8 right-6 z-40 flex flex-col items-end gap-3 md:right-16">
        {chat && (
          <div className="w-80 animate-rise border border-border bg-background/95 backdrop-blur">
            <div className="flex items-center justify-between border-b border-border px-5 py-4"><span className="font-serif text-lg">EAD Assistant</span><button onClick={() => setChat(false)} aria-label="Close chat"><X className="h-4 w-4" /></button></div>
            <div className="p-5"><div className="w-fit bg-secondary px-4 py-2 text-sm">Hi!!! How can i help you?</div></div>
            <div className="flex items-center gap-2 border-t border-border px-4 py-3"><input placeholder="Type a message…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /><Send className="h-4 w-4 text-primary" /></div>
          </div>
        )}
        <button onClick={() => setChat(!chat)} className="grid h-14 w-14 place-items-center rounded-full border border-primary/60 bg-background/80 text-primary backdrop-blur transition hover:bg-primary hover:text-primary-foreground" aria-label="Chat"><MessageCircle className="h-5 w-5" /></button>
      </div>
    </div>
  );
}

function GlancePanel({ a, open, ar = false, compact = false }: { a: (typeof APPS)[number]; open: boolean; ar?: boolean; compact?: boolean }) {
  const Icon = ((Icons as unknown as Record<string, Icons.LucideIcon>)[a.icon]) ?? Icons.Sparkles;
  const ez = "ease-[cubic-bezier(.2,.8,.2,1)]";
  const item = (d: number) => ({ className: `transition-all duration-700 ${ez} ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`, style: { transitionDelay: open ? `${d}ms` : "0ms" } });
  const title = ar ? a.nameAr : a.name;
  const desc = ar ? a.descAr : a.desc;

  return (
    <div
      aria-hidden={!open}
      className={`pointer-events-none absolute ${
        compact ? "bottom-[calc(100%+0.75rem)] left-12" : "-top-6 left-[calc(100%+2.5rem)]"
      } z-40 w-80 origin-top-left transition-all duration-700 ${ez} ${
        open ? "translate-x-0 scale-100 opacity-100" : "-translate-x-4 scale-95 opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-secondary/80 shadow-[0_30px_80px_-20px_var(--background)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="relative h-44 overflow-hidden bg-background/60">
          <img
            src={a.image}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = a.remoteImage; }}
            alt={title}
            className={`h-full w-full object-cover transition-transform duration-[2500ms] ease-out ${open ? "scale-100" : "scale-110"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />
          <span className="absolute right-3 top-3 rounded-full border border-border bg-background/70 px-2.5 py-1 text-[9px] uppercase tracking-[0.3em] text-primary backdrop-blur">
            {groupBadge(a.group)}
          </span>
        </div>
        <div className="relative px-5 pb-5">
          <div {...item(150)}>
            <div className="-mt-7 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-background/85 shadow-lg backdrop-blur-xl">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div {...item(230)}>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <h4 className="font-serif text-xl font-medium">{title}</h4>
              <span className="shrink-0 font-mono text-[10px] text-primary">{ar ? a.name : a.nameAr}</span>
            </div>
          </div>
          <div {...item(300)}>
            <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-muted-foreground">{desc}</p>
          </div>
          <div {...item(370)}>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] uppercase tracking-[0.25em] text-primary">
              <span>{ar ? "استكشف في البوابة" : "Explore on EDP"}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
