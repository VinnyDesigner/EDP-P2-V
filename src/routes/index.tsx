import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { APPS } from "@/lib/edp-apps";
import AppIndex from "@/components/edp/AppIndex";

const AbuDhabiMap = lazy(() => import("@/components/edp/AbuDhabiMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EAD Environmental Data Portal — Your Gateway to Environmental Insights" },
      { name: "description", content: "Unlock environmental insights for a sustainable future with the Environment Agency – Abu Dhabi data portal." },
      { property: "og:title", content: "EAD Environmental Data Portal" },
      { property: "og:description", content: "Unlock environmental insights for a sustainable future." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});


function Home() {
  const [active, setActive] = useState<number | null>(null);
  const [chat, setChat] = useState(false);
  const [ar, setAr] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground" dir={ar ? "rtl" : "ltr"}>
      {/* HERO */}
      <section className="relative h-screen min-h-[720px] w-full">
        <div className="absolute inset-0">
          <ClientOnly fallback={null}>
            <Suspense fallback={null}><AbuDhabiMap active={active} onHover={setActive} /></Suspense>
          </ClientOnly>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

        {/* Nav */}
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-12">
          <a href="/" aria-label="Environment Agency – Abu Dhabi" className="flex items-center">
            <img src="/edplogo.svg" alt="Environment Agency – Abu Dhabi" className="h-11 w-auto md:h-12" />
          </a>
          <div className="flex items-center gap-3">
            <button onClick={() => setAr(!ar)} className="rounded-full glass px-4 py-2 text-sm transition hover:shadow-glow">{ar ? "English" : "عربي"}</button>
            <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-110">Sign In</button>
          </div>
        </header>

        {/* HUD corners */}
        <div className="pointer-events-none absolute left-6 bottom-10 z-10 hidden font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:left-12 md:block">
          <div className="text-primary">● Live geospatial link</div>
          <div className="mt-2">LAT 24.4539° N</div>
          <div>LON 54.3773° E</div>
        </div>
        <div className="pointer-events-none absolute right-24 bottom-10 z-10 hidden text-right font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:right-28 md:block">
          <div>{APPS.filter((a) => a.tab === "applications").length} Applications</div>
          <div>{APPS.filter((a) => a.tab === "catalogues").length} Catalogues</div>
        </div>

        {/* Headline */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex max-w-3xl flex-col justify-center px-6 md:px-12">
          <p className="animate-rise font-mono text-xs uppercase tracking-[0.5em] text-primary" style={{ animationDelay: "0.4s" }}>Your Gateway to Environmental Insights</p>
          <h1 className="animate-rise mt-5 text-4xl font-light leading-[1.05] tracking-tight md:text-6xl" style={{ animationDelay: "0.7s" }}>
            Unlock <span className="text-aurora font-semibold">Environmental Insights</span><br /> for a <span className="font-semibold">Sustainable Future</span>
          </h1>
          <a href="#apps" className="animate-rise pointer-events-auto mt-12 flex h-12 w-7 justify-center rounded-full border border-border pt-2" style={{ animationDelay: "1.1s" }} aria-label="Scroll to applications">
            <span className="h-2 w-1 animate-bounce rounded-full bg-primary" />
          </a>
        </div>
      </section>

      <AppIndex onActive={setActive} ar={ar} />

      <footer className="relative z-10 border-t border-border px-6 py-8 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
          <div className="flex gap-5"><a href="#" className="hover:text-foreground">Copyright</a><a href="#" className="hover:text-foreground">Privacy Policy</a><a href="#" className="hover:text-foreground">Terms &amp; Conditions</a></div>
          <div>© 2024 Abu Dhabi Government. All Rights Reserved.</div>
        </div>
      </footer>

      {/* Chat */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {chat && (
          <div className="w-80 animate-rise overflow-hidden rounded-2xl glass shadow-glow">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-display text-sm font-semibold">EAD Assistant</span>
              <button onClick={() => setChat(false)} aria-label="Close chat"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4"><div className="w-fit rounded-2xl rounded-tl-sm bg-secondary px-4 py-2 text-sm">Hi!!! How can i help you?</div></div>
            <div className="flex items-center gap-2 border-t border-border px-3 py-2">
              <input placeholder="Type a message…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              <Send className="h-4 w-4 text-primary" />
            </div>
          </div>
        )}
        <button onClick={() => setChat(!chat)} className="relative grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow" aria-label="Chat">
          <span className="animate-ring absolute inset-0 rounded-full border border-primary" />
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
