import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const BASE_URL = "https://sound-ready.com";
const BLOG_DIR = "content/blog";
const OUTPUT_DIR = "public";
const POSTS_DIR = join(OUTPUT_DIR, "blog-posts");

if (!existsSync(POSTS_DIR)) {
  mkdirSync(POSTS_DIR, { recursive: true });
}

if (!existsSync(BLOG_DIR)) {
  console.log("No blog directory yet. Skipping.");
  writeFileSync(join(OUTPUT_DIR, "blog-index.json"), "[]");
  process.exit(0);
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

const index = [];

for (const file of files) {
  const raw = readFileSync(join(BLOG_DIR, file), "utf-8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, "");

  const post = {
    slug,
    ...data,
    body: content,
  };

  writeFileSync(join(POSTS_DIR, `${slug}.json`), JSON.stringify(post));
  index.push({
    slug,
    title: data.title,
    date: data.date,
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    cover: data.cover,
    summary: data.summary,
  });
}

index.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
writeFileSync(join(OUTPUT_DIR, "blog-index.json"), JSON.stringify(index, null, 2));

console.log(`Built ${index.length} blog post(s).`);

// Generate sitemap.xml (UTF-8, no BOM)
const today = new Date().toISOString().split("T")[0];

const staticPages = [
  { loc: `${BASE_URL}/`,                  priority: "1.0", lastmod: today },
  { loc: `${BASE_URL}/sergio`,            priority: "0.8", lastmod: today },
  { loc: `${BASE_URL}/blog`,              priority: "0.9", lastmod: today },
  { loc: `${BASE_URL}/app`,              priority: "0.8", lastmod: today },
  { loc: `${BASE_URL}/contact`,          priority: "0.7", lastmod: today },
  { loc: `${BASE_URL}/privacy-policy`,   priority: "0.3", lastmod: today },
  { loc: `${BASE_URL}/terms-of-service`, priority: "0.3", lastmod: today },
  { loc: `${BASE_URL}/disclaimer`,       priority: "0.3", lastmod: today },
];

const blogEntries = index.map((post) => ({
  loc: `${BASE_URL}/blog/${post.slug}`,
  priority: "0.7",
  lastmod: post.date ? new Date(post.date).toISOString().split("T")[0] : today,
}));

const allEntries = [...staticPages, ...blogEntries];

const urlTags = allEntries
  .map(
    ({ loc, priority, lastmod }) =>
      `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>\n`;

writeFileSync(join(OUTPUT_DIR, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated sitemap.xml with ${allEntries.length} URLs.`);
