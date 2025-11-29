// Generate a robots.txt based on the website pages.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      Disallow: "/dashboard",
    },
    sitemap: "https://yourdomain.com/sitemap.xml",
  };
}
