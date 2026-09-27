import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Consagración⇒Reconstrucción",
    short_name: "Consagración",
    description:
      "Plan devocional de 5 días para hombres basado en la historia de Nehemías",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#c2410c",
    lang: "es",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
