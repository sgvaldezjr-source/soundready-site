import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

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