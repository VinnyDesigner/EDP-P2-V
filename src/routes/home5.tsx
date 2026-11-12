import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home5")({
  head: () => ({
    meta: [
      {
        title:
          "PUTURE — Interactive AI experiences for brands, pop-ups and campaigns",
      },
      {
        name: "description",
        content:
          "PUTURE is an interactive tech studio that builds experiences with AI. We plan and build them for brands, pop-up stores, AI campaigns and exhibitions, including the three programs inside KT AI Station, named a Champion of the WSIS Prize 2026.",
      },
      {
        property: "og:title",
        content:
          "PUTURE — Interactive AI experiences for brands, pop-ups and campaigns",
      },
      {
        property: "og:description",
        content:
          "PUTURE is an interactive tech studio that builds experiences with AI. We plan and build them for brands, pop-up stores, AI campaigns and exhibitions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home5,
});

function Home5() {
  return (
    <iframe
      src="/puture-en.html"
      title="PUTURE — Interactive AI experiences for brands, pop-ups and campaigns"
      className="fixed inset-0 block h-screen w-screen border-0 bg-black"
      allow="fullscreen; clipboard-write"
    />
  );
}
