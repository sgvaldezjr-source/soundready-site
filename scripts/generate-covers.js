/**
 * generate-covers.js
 *
 * Generates AI cover images via fal.media for blog posts that are
 * missing a cover or using the generic placeholder (blogpost.jpg).
 *
 * Usage:
 *   FAL_API_KEY=your-key node scripts/generate-covers.js
 *
 * Skips posts that already have a specific cover image.
 * Saves generated images to public/blog-images/{slug}-cover.jpg
 * Updates the post's markdown frontmatter with the new cover path.
 */

import { fal } from "@fal-ai/client";
import { readFileSync, writeFileSync, existsSync, createWriteStream } from "fs";
import { join } from "path";
import https from "https";
import matter from "gray-matter";

// ── config ──────────────────────────────────────────────────────
const FAL_KEY    = process.env.FAL_API_KEY;
const BLOG_DIR   = "content/blog";
const IMAGES_DIR = "public/blog-images";
const MODEL      = "fal-ai/flux/dev";
const PLACEHOLDER = "blogpost.jpg";

if (!FAL_KEY) {
  console.error("❌  FAL_API_KEY environment variable is not set.");
  console.error("    Add it to Netlify → Site configuration → Environment variables");
  process.exit(1);
}

fal.config({ credentials: FAL_KEY });

// ── prompt builder ───────────────────────────────────────────────
function buildPrompt(post) {
  const t = (post.title || "").toLowerCase();
  const base = "clean editorial photography, professional study environment, warm natural lighting, shallow depth of field, high quality, no text overlays, no people";

  if (t.includes("speaking"))
    return `IELTS speaking practice — open notebook, audio waveform sketch, desk with pen and coffee, ${base}`;
  if (t.includes("writing"))
    return `IELTS writing preparation — handwritten essay on lined paper, red pen corrections, highlighted text, study desk, ${base}`;
  if (t.includes("ai") || t.includes("artificial"))
    return `Modern language learning with technology — laptop, open notebook, digital study tools, minimal desk setup, ${base}`;
  if (t.includes("score") || t.includes("band") || t.includes("improv"))
    return `Academic progress concept — IELTS score sheet, pencil, upward arrow sketch, organised study desk, ${base}`;
  if (t.includes("tutor") || t.includes("coach") || t.includes("teacher"))
    return `Professional English tutoring — neatly arranged IELTS books, notebook with lesson plan, clean desk, ${base}`;
  if (t.includes("mistake") || t.includes("error") || t.includes("wrong"))
    return `Common exam errors — crossed-out essay draft, red pen, correction marks, study materials on desk, ${base}`;
  if (t.includes("idiom") || t.includes("vocabulary") || t.includes("collocation"))
    return `English vocabulary study — open dictionary, highlighted phrases, index cards with words, warm desk lamp, ${base}`;
  if (t.includes("retake") || t.includes("resit"))
    return `IELTS exam retake preparation — calendar with circled date, study plan, pen, determined study setup, ${base}`;

  return `IELTS English language exam preparation — open textbook, notebook, pen, clean organised desk, ${base}`;
}

// ── download helper ──────────────────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    https.get(url, (res) => {
      // follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      file.destroy();
      reject(err);
    });
  });
}

// ── update markdown frontmatter ──────────────────────────────────
function updateCoverInMarkdown(slug, coverPath) {
  const mdPath = join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(mdPath)) return;

  const raw            = readFileSync(mdPath, "utf-8");
  const { data, content } = matter(raw);
  data.cover           = coverPath;
  const updated        = matter.stringify(content, data);
  writeFileSync(mdPath, updated, "utf-8");
}

// ── main ─────────────────────────────────────────────────────────
async function run() {
  const posts = JSON.parse(readFileSync("public/blog-index.json", "utf-8"));
  let generated = 0;
  let skipped   = 0;

  for (const post of posts) {
    const { slug, cover } = post;

    // skip posts that already have a specific cover
    const hasRealCover =
      cover &&
      !cover.endsWith(PLACEHOLDER) &&
      cover !== "" ;

    if (hasRealCover) {
      console.log(`⏭  Skip  "${post.title.trim().slice(0, 60)}" — cover exists`);
      skipped++;
      continue;
    }

    const destFile = join(IMAGES_DIR, `${slug}-cover.jpg`);
    const destPath = `/blog-images/${slug}-cover.jpg`;

    if (existsSync(destFile)) {
      console.log(`⏭  Skip  "${post.title.trim().slice(0, 60)}" — file already generated`);
      skipped++;
      continue;
    }

    const prompt = buildPrompt(post);
    console.log(`\n🎨  Generating: "${post.title.trim().slice(0, 60)}"`);
    console.log(`    Prompt: ${prompt.slice(0, 80)}…`);

    try {
      const result = await fal.subscribe(MODEL, {
        input: {
          prompt,
          image_size: "landscape_16_9",
          num_inference_steps: 28,
          num_images: 1,
          enable_safety_checker: true,
        },
        logs: false,
      });

      const imageUrl = result.data.images[0].url;
      await download(imageUrl, destFile);
      updateCoverInMarkdown(slug, destPath);

      console.log(`    ✅ Saved → ${destFile}`);
      generated++;

      // short pause between requests to be kind to the API
      await new Promise(r => setTimeout(r, 1500));

    } catch (err) {
      console.error(`    ❌ Failed: ${err.message}`);
    }
  }

  console.log(`\n──────────────────────────────────────`);
  console.log(`✅  Generated: ${generated}   Skipped: ${skipped}`);
  console.log(`\nNext step: commit the new images and push to deploy.`);
}

run();
