import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Notebook",
    short_name: "Notebook",
    description: "Простий цифровий блокнот для щоденних нотаток",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e3",
    theme_color: "#f7f1e3",
    orientation: "portrait",
    icons: [
      {
        src: "/iconPWA/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/iconPWA/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pen.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
