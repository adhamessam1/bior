import fs from "node:fs";
import path from "node:path";
import { loadEnv } from "vite";

const env = loadEnv(
  "production",
  process.cwd(),
  ""
);

const SUPABASE_URL =
  env.VITE_SUPABASE_URL;

const SUPABASE_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SITE_URL =
  "https://bior-fashion.vercel.app";

if (!SUPABASE_URL) {
  throw new Error(
    "VITE_SUPABASE_URL is missing."
  );
}

if (!SUPABASE_KEY) {
  throw new Error(
    "VITE_SUPABASE_PUBLISHABLE_KEY is missing."
  );
}

async function getProducts() {
  const url =
    `${SUPABASE_URL}/rest/v1/products` +
    `?select=id` +
    `&is_available=eq.true` +
    `&order=id.asc`;

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `Supabase request failed: ${response.status} ${text}`
    );
  }

  return response.json();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function generateSitemap() {
  console.log("Generating BIOR sitemap...");

  const products = await getProducts();

  const urls = [];

  // Homepage
  urls.push(`
  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);

  // Products page
  urls.push(`
  <url>
    <loc>${SITE_URL}/products</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);

  // Product pages
  for (const product of products) {
    if (!product?.id) continue;

    urls.push(`
  <url>
    <loc>${escapeXml(
      `${SITE_URL}/product/${product.id}`
    )}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urls.join("\n")}
</urlset>
`;

  const publicDir =
    path.resolve("public");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, {
      recursive: true,
    });
  }

  const sitemapPath =
    path.join(
      publicDir,
      "sitemap.xml"
    );

  fs.writeFileSync(
    sitemapPath,
    sitemap,
    "utf8"
  );

  console.log(
    `Sitemap generated successfully: ${products.length} products`
  );

  console.log(
    `Saved to: ${sitemapPath}`
  );
}

generateSitemap().catch((error) => {
  console.error(
    "Sitemap generation failed:"
  );

  console.error(error);

  process.exit(1);
});