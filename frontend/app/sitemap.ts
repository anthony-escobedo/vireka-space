import type { MetadataRoute } from "next";

const base = "https://vireka.space";

const paths: string[] = [
  "/",
  "/clarify",
  "/about",
  "/faq",
  "/privacy",
  "/terms",
  "/contact",
  "/plan",
  "/sign-in",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified: now,
  }));
}
