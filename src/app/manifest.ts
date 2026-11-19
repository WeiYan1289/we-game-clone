import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "WeGame Portal Mockup",
    short_name: "WeGame",
    description: "WeGame 一起更好玩 — responsive, installable portal mockup.",
    lang: "zh-CN",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#0b0b0d",
    theme_color: "#0b0b0d",
    categories: ["games", "entertainment"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: "/icons/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "WeGame portal home",
      },
      {
        src: "/icons/screenshot-narrow.png",
        sizes: "720x1280",
        type: "image/png",
        form_factor: "narrow",
        label: "WeGame portal on mobile",
      },
    ],
  };
}
