import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home5")({
  head: () => ({
    meta: [
      {
        title: "Abu Dhabi EDP — Environmental Data Portal | EAD",
      },
      {
        name: "description",
        content:
          "Environmental Data Portal by Environment Agency – Abu Dhabi (EAD). Explore environmental data, AI applications, biodiversity, and air quality across Abu Dhabi.",
      },
      {
        property: "og:title",
        content: "Abu Dhabi EDP — Environmental Data Portal | EAD",
      },
      {
        property: "og:description",
        content:
          "Environmental Data Portal by Environment Agency – Abu Dhabi (EAD). Explore environmental data, AI applications, biodiversity, and air quality across Abu Dhabi.",
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
      title="Abu Dhabi EDP — Environmental Data Portal"
      className="fixed inset-0 block h-screen w-screen border-0 bg-black"
      allow="fullscreen; clipboard-write"
    />
  );
}
