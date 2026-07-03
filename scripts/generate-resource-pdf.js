/**
 * generate-resource-pdf.js
 *
 * Renders the "Is your child ready for…" parent-facing PDF series
 * (Movers / KET / PET / KET→PET transition) from one shared HTML/CSS
 * template using headless Chrome (Puppeteer).
 *
 * Usage:
 *   node scripts/generate-resource-pdf.js ket        # sample only
 *   node scripts/generate-resource-pdf.js all         # full batch (Phase 4)
 *
 * Saves to public/resources/{slug}.pdf
 */

import puppeteer from "puppeteer";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const OUT_DIR = "public/resources";
const LOGO_PATH = "public/soundready-logo-transparent.png";

const ACCENT = "#B85C38"; // terracotta — shared across the whole readiness series
const NAVY = "#1F3A5F";

// ── shared HTML template ────────────────────────────────────────
function renderHtml({ levelTag, title, titleZh, quickFacts, intro, introZh, items, isTransition, logoDataUri }) {
  const checklistHtml = items
    .map(
      (item) => `
        <li class="item">
          ${isTransition ? `<span class="bullet"></span>` : `<span class="box"></span>`}
          <div class="item-text">
            <p class="en">${item.en}</p>
            <p class="zh">${item.zh}</p>
          </div>
        </li>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Inter', 'Noto Sans SC', sans-serif;
    color: #24303f;
    -webkit-font-smoothing: antialiased;
  }
  .page { padding: 14mm 16mm 12mm; }

  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6mm; }
  .logo { height: 34px; }
  .level-tag {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${ACCENT};
    border: 1px solid ${ACCENT};
    border-radius: 999px;
    padding: 4px 10px;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 26px;
    color: ${NAVY};
    margin: 0 0 2px;
    line-height: 1.25;
  }
  h1.zh {
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    font-size: 17px;
    color: ${NAVY};
    margin: 0 0 5mm;
  }

  .quick-facts {
    font-size: 10.5px;
    color: #6b7686;
    margin-bottom: 5mm;
    padding-bottom: 4mm;
    border-bottom: 1px solid #eceef1;
  }

  .intro { margin-bottom: 6mm; }
  .intro .en { font-size: 12px; line-height: 1.55; margin: 0 0 3px; }
  .intro .zh { font-family: 'Noto Sans SC', sans-serif; font-size: 11px; line-height: 1.7; color: #565f6c; margin: 0; }

  ul.checklist { list-style: none; margin: 0 0 7mm; padding: 0; }
  .item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #f1efec;
  }
  .item:last-child { border-bottom: none; }

  .box {
    flex-shrink: 0;
    width: 15px;
    height: 15px;
    margin-top: 2px;
    border: 1.6px solid ${ACCENT};
    border-radius: 3px;
  }
  .bullet {
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    margin-top: 6px;
    border-radius: 999px;
    background: ${ACCENT};
  }

  .item-text .en { font-size: 12px; font-weight: 500; margin: 0 0 2px; line-height: 1.45; }
  .item-text .zh { font-family: 'Noto Sans SC', sans-serif; font-size: 10.5px; color: #6b7686; margin: 0; line-height: 1.6; }

  .footer {
    margin-top: 8mm;
    padding-top: 5mm;
    border-top: 1px solid #eceef1;
  }
  .disclaimer { font-size: 9.5px; color: #97a0ab; margin: 0 0 2px; }
  .disclaimer.zh { font-family: 'Noto Sans SC', sans-serif; font-size: 9px; color: #97a0ab; margin: 0 0 5mm; }

  .cta { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .cta .text .en { font-size: 11.5px; font-weight: 600; color: ${NAVY}; margin: 0 0 1px; }
  .cta .text .zh { font-family: 'Noto Sans SC', sans-serif; font-size: 10.5px; color: #565f6c; margin: 0; }
  .cta .link {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    background: ${NAVY};
    padding: 8px 16px;
    border-radius: 6px;
    white-space: nowrap;
  }
</style>
</head>
<body>
  <div class="page">
    <div class="header">
      <img class="logo" src="${logoDataUri}" />
      <span class="level-tag">${levelTag}</span>
    </div>

    <h1>${title}</h1>
    <h1 class="zh">${titleZh}</h1>

    <p class="quick-facts">${quickFacts}</p>

    <div class="intro">
      <p class="en">${intro}</p>
      <p class="zh">${introZh}</p>
    </div>

    <ul class="checklist">
      ${checklistHtml}
    </ul>

    <div class="footer">
      <p class="disclaimer">This is a general guide based on what we typically see in students, not a formal assessment — every child develops at their own pace.</p>
      <p class="disclaimer zh">本指南基于我们对学生的一般观察经验，并非正式的水平测试——每个孩子的成长节奏都不同。</p>
      <div class="cta">
        <div class="text">
          <p class="en">Want a second opinion from a tutor?</p>
          <p class="zh">想听听老师的专业意见？预约免费15分钟诊断沟通。</p>
        </div>
        <span class="link">sound-ready.com/contact</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── content data (Phase 2, approved) ────────────────────────────
const RESOURCES = {
  ket: {
    slug: "is-your-child-ready-for-ket",
    levelTag: "A2 · Key for Schools",
    title: "Is your child ready for KET?",
    titleZh: "您的孩子准备好参加 KET 考试了吗？",
    quickFacts:
      "3 papers — Reading & Writing (1 hr) · Listening (30 min) · Speaking (8–10 min, paired) — scored on the Cambridge English Scale, CEFR A2.",
    intro:
      "KET (Cambridge English A2 Key for Schools) is often the first formal English exam schools recommend. It shows examiners — and your child — that they can already read, write, and speak in real, everyday English situations, not just repeat classroom phrases. Most children are ready for KET after 2–3 years of steady English study, once single words start turning into real conversations.",
    introZh:
      "KET（剑桥英语 A2 Key for Schools）通常是学校推荐孩子参加的第一门正式英语考试。它向考官——也向孩子自己——证明，他们已经能够在真实的日常场景中读、写、说英语，而不仅仅是重复课堂用语。大多数孩子在持续学习英语2至3年后，当单词逐渐变成真正的对话时，就已经准备好参加KET了。",
    items: [
      {
        en: "Can read a short notice, sign, or simple article and pick out the key information",
        zh: "能阅读简短的通知、标志或简单文章，并找出关键信息",
      },
      {
        en: "Can write 2–3 connected sentences (not just single words) with reasonable spelling and basic punctuation",
        zh: "能写出2-3句连贯的句子（而不仅仅是单词），拼写基本正确，会使用基础标点",
      },
      {
        en: "Can hold a short back-and-forth conversation with a partner, asking as well as answering questions",
        zh: "能与同伴进行简短的双向对话，既能提问也能回答问题",
      },
      {
        en: "Can understand slow, clearly-spoken announcements or short conversations without needing repetition every time",
        zh: "能听懂语速较慢、发音清晰的通知或简短对话，不需要每次都重复",
      },
      {
        en: "Knows and can use everyday vocabulary confidently (not just recognise it passively)",
        zh: "能自信地运用日常词汇，而不仅仅是被动地认识这些词",
      },
      {
        en: "Can sit still and focus for a 1-hour paper without losing concentration",
        zh: "能安静专注地完成一小时的考试，注意力不会分散",
      },
      {
        en: "Is comfortable being assessed one-on-one/in a pair by an unfamiliar adult examiner",
        zh: "能自在地接受不熟悉的成人考官进行一对一或结对测试",
      },
    ],
  },
};

// ── render ───────────────────────────────────────────────────────
async function renderPdf(key) {
  const data = RESOURCES[key];
  if (!data) throw new Error(`Unknown resource key: ${key}`);

  const logoBuffer = readFileSync(LOGO_PATH);
  const logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  const html = renderHtml({ ...data, logoDataUri });

  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const outPath = join(OUT_DIR, `${data.slug}.pdf`);
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
  });

  await browser.close();
  console.log(`✅ Saved → ${outPath}`);
}

async function run() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node scripts/generate-resource-pdf.js <ket|movers|pet|ket-to-pet|all>");
    process.exit(1);
  }

  const keys = arg === "all" ? Object.keys(RESOURCES) : [arg];
  for (const key of keys) {
    await renderPdf(key);
  }
}

run();
