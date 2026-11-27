import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Insights by WeTakeFwd",
    short_name: "WeTakeFwd Insights",
    description: "Practical articles on AI, automation, WhatsApp, software and business technology from WeTakeFwd.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3ec",
    theme_color: "#10275b",
    icons: [
      { src: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { src: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { src: "/images/insights-arrow-favicon.png", sizes: "1024x1024", type: "image/png" },
    ],
  };
}
