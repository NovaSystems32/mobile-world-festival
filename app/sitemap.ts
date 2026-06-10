import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://mobileworld.com.ar";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/#productos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/#mayoristas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/#quienes-somos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/#contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
