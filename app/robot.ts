import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.stravaastro.site";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/callback/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
