import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home6")({
  head: () => ({
    meta: [
      {
        title: "Abu Dhabi EDP — Environmental Data Portal | EAD (Home 6)",
      },
      {
        name: "description",
        content:
          "Environmental Data Portal by Environment Agency – Abu Dhabi (EAD). Explore environmental data, AI applications, biodiversity, and air quality across Abu Dhabi.",
      },
      {
        property: "og:title",
        content: "Abu Dhabi EDP — Environmental Data Portal | EAD (Home 6)",
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
  component: Home6,
});

function Home6() {
  return (
    <iframe
      src="/edp-home6.html?v=edp6-v14"
      title="Abu Dhabi EDP — Environmental Data Portal (Home 6)"
      className="fixed inset-0 block h-screen w-screen border-0 bg-[#020b09]"
      allow="fullscreen; clipboard-write"
    />
  );
}

