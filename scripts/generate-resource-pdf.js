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

const ACCENT = "#B8941F"; // straw/gold — shared across the whole readiness series
const ACCENT_TINT = "#F8EFC9"; // pale straw background tint
const ACCENT_BORDER = "#E6D89A"; // straw-tinted border
const NAVY = "#1F3A5F"; // header band + level tag

// ── shared HTML template ────────────────────────────────────────
function renderHtml({ levelTag, title, titleZh, quickFacts, intro, introZh, items, isTransition, logoDataUri }) {
  const checklistHtml = items
    .map(
      (item, i) => `
        <li class="item">
          ${isTransition ? `<span class="bullet"></span>` : `<span class="num">${i + 1}</span><span class="box"></span>`}
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
  html, body {
    margin: 0;
    background: #FBF8F4;
    font-family: 'Inter', 'Noto Sans SC', sans-serif;
    color: #24303f;
    -webkit-font-smoothing: antialiased;
  }

  .topbar { height: 5mm; background: linear-gradient(90deg, ${NAVY} 0%, #2E4F76 55%, ${NAVY} 100%); }

  .page { padding: 8mm 16mm 6mm; }

  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5mm; }
  .logo { height: 34px; }
  .level-tag {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fff;
    background: ${NAVY};
    border-radius: 999px;
    padding: 5px 12px;
  }

  .hero {
    background: linear-gradient(135deg, #FFFFFF 0%, ${ACCENT_TINT} 100%);
    border: 1px solid ${ACCENT_BORDER};
    border-radius: 14px;
    padding: 5mm 8mm;
    margin-bottom: 4mm;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 27px;
    color: ${NAVY};
    margin: 0 0 3px;
    line-height: 1.25;
  }
  h1.zh {
    font-family: 'Noto Sans SC', sans-serif;
    font-weight: 600;
    font-size: 17px;
    color: ${NAVY};
    margin: 0 0 4mm;
  }
  .rule { width: 42px; height: 3px; border-radius: 999px; background: ${ACCENT}; margin: 0 0 4mm; }

  .quick-facts {
    display: inline-block;
    font-size: 10px;
    font-weight: 500;
    color: ${NAVY};
    background: #fff;
    border: 1px solid ${ACCENT_BORDER};
    border-radius: 999px;
    padding: 5px 12px;
    margin-bottom: 4mm;
  }

  .intro .en { font-size: 12px; line-height: 1.55; margin: 0 0 3px; }
  .intro .zh { font-family: 'Noto Sans SC', sans-serif; font-size: 11px; line-height: 1.7; color: #565f6c; margin: 0; }

  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${ACCENT};
    margin: 0 0 2.5mm;
  }

  ul.checklist { list-style: none; margin: 0 0 4mm; padding: 0; }
  .item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: #fff;
    border: 1px solid #EFEAE3;
    border-radius: 10px;
    padding: 6px 12px;
    margin-bottom: 4px;
  }
  .item:last-child { margin-bottom: 0; }

  .num {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 1px;
    border-radius: 999px;
    background: ${ACCENT_TINT};
    color: ${ACCENT};
    font-size: 9.5px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .box {
    flex-shrink: 0;
    width: 15px;
    height: 15px;
    margin-top: 2px;
    border: 1.6px solid ${ACCENT};
    border-radius: 4px;
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

  .cta-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: linear-gradient(135deg, ${ACCENT_TINT} 0%, #F6F0E6 100%);
    border: 1px solid ${ACCENT_BORDER};
    border-radius: 12px;
    padding: 4mm 8mm;
    margin-bottom: 3mm;
  }
  .cta-panel .text .en { font-size: 12px; font-weight: 700; color: ${NAVY}; margin: 0 0 2px; }
  .cta-panel .text .zh { font-family: 'Noto Sans SC', sans-serif; font-size: 10.5px; color: #565f6c; margin: 0; }
  .cta-panel .link {
    flex-shrink: 0;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    background: ${NAVY};
    padding: 9px 18px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .disclaimer { font-size: 9px; color: #a3acb6; text-align: center; margin: 0 0 2px; }
  .disclaimer.zh { font-family: 'Noto Sans SC', sans-serif; font-size: 8.5px; color: #a3acb6; text-align: center; margin: 0; }
</style>
</head>
<body>
  <div class="topbar"></div>
  <div class="page">
    <div class="header">
      <img class="logo" src="${logoDataUri}" />
      <span class="level-tag">${levelTag}</span>
    </div>

    <div class="hero">
      <h1>${title}</h1>
      <h1 class="zh">${titleZh}</h1>
      <div class="rule"></div>
      <span class="quick-facts">${quickFacts}</span>
      <div class="intro">
        <p class="en">${intro}</p>
        <p class="zh">${introZh}</p>
      </div>
    </div>

    <p class="section-label">${isTransition ? "What's new" : "Readiness signs to look for"}</p>
    <ul class="checklist">
      ${checklistHtml}
    </ul>

    <div class="cta-panel">
      <div class="text">
        <p class="en">Want a second opinion from a tutor?</p>
        <p class="zh">想听听老师的专业意见？预约免费15分钟诊断沟通。</p>
      </div>
      <span class="link">sound-ready.com/contact</span>
    </div>

    <p class="disclaimer">This is a general guide based on what we typically see in students, not a formal assessment — every child develops at their own pace.</p>
    <p class="disclaimer zh">本指南基于我们对学生的一般观察经验，并非正式的水平测试——每个孩子的成长节奏都不同。</p>
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

  movers: {
    slug: "is-your-child-ready-for-movers",
    levelTag: "A1 · Movers",
    title: "Is your child ready for Movers?",
    titleZh: "您的孩子准备好参加 Movers 考试了吗？",
    quickFacts:
      "3 papers — Listening (~25 min) · Reading & Writing (30 min) · Speaking (5–7 min, one-on-one) — shields awarded per skill, no pass/fail.",
    intro:
      "A1 Movers (Cambridge English Young Learners) is usually a child's first taste of a real exam — but there's no pass or fail here. Every child receives shields for what they can already do across Listening, Reading & Writing, and Speaking. Most children are ready for Movers after a year or so of regular English lessons, once they're comfortable with basic words and short spoken instructions.",
    introZh:
      "A1 Movers（剑桥英语青少版考试）通常是孩子第一次接触正式考试——但这里没有及格与不及格之分。每个孩子都会根据听力、读写和口语中已掌握的能力获得盾牌奖励。大多数孩子在经过一年左右的英语常规学习后，能够熟练掌握基础词汇和简单的口头指令时，就已经准备好参加Movers了。",
    items: [
      {
        en: "Can recognise and spell everyday words (colours, animals, family, school objects) out loud and in writing",
        zh: "能认读并拼写日常词汇（颜色、动物、家庭成员、校园物品），口头和书写都可以",
      },
      {
        en: "Can follow a short story or set of instructions read aloud and answer simple picture/comprehension questions about it",
        zh: "能听懂朗读的简短故事或指令，并回答关于图片/内容的简单问题",
      },
      {
        en: "Can describe what's happening in a simple picture in a few short sentences",
        zh: "能用几句简单的话描述图片中发生的事情",
      },
      {
        en: "Can spot 4–5 differences between two similar pictures and explain them in English",
        zh: "能找出两幅相似图片之间的4-5处不同，并用英语说明",
      },
      {
        en: "Can answer simple personal questions (name, age, favourite things) without long pauses",
        zh: "能流畅回答简单的个人问题（姓名、年龄、喜欢的事物），不会长时间停顿",
      },
      {
        en: "Can write a simple sentence with mostly correct spelling, even if grammar isn't perfect",
        zh: "能写出拼写基本正确的简单句子，即使语法不完全正确也没关系",
      },
      {
        en: "Enjoys short English games/songs/stories without visible frustration",
        zh: "喜欢参与简短的英语游戏、歌曲或故事活动，不会明显感到沮丧或抵触",
      },
    ],
  },

  pet: {
    slug: "is-your-child-ready-for-pet",
    levelTag: "B1 · Preliminary for Schools",
    title: "Is your child ready for PET?",
    titleZh: "您的孩子准备好参加 PET 考试了吗？",
    quickFacts:
      "4 papers — Reading (45 min) · Writing (45 min) · Listening (30 min) · Speaking (10–12 min, paired) — scored on the Cambridge English Scale, CEFR B1.",
    intro:
      "B1 Preliminary for Schools (PET) is the next step up from KET, and it's where English starts to feel less like a subject and more like a tool your child can actually use. It asks for longer reading, structured writing, and real opinions — not just correct answers. Most children are ready for PET after building real confidence and stamina at KET level.",
    introZh:
      "B1 Preliminary for Schools（PET）是继KET之后的进阶考试，从这一阶段开始，英语对孩子来说不再只是一门学科，而是真正能够运用的工具。它要求孩子阅读更长的文章、进行有条理的写作，并表达真实的观点——而不仅仅是给出正确答案。大多数孩子在KET阶段积累了足够的自信和应试能力后，就已经准备好迎接PET了。",
    items: [
      {
        en: "Can read a longer text (magazine article, story) and understand both detail and overall meaning, not just headlines",
        zh: "能阅读较长的文章（杂志文章、故事），既能理解细节，也能把握整体意思，而不只是标题",
      },
      {
        en: "Can write a structured ~100-word piece (a story or article) with a beginning, middle and end, not just a list of sentences",
        zh: "能写出结构完整、约100词的短文（故事或文章），包含开头、发展和结尾，而不只是简单罗列句子",
      },
      {
        en: "Can follow natural-paced spoken English (not slowed down for learners) in short conversations or announcements",
        zh: "能听懂以自然语速（非为学习者刻意放慢）表达的简短对话或通知",
      },
      {
        en: "Can give opinions and reasons in conversation, not just facts (\"I like it because…\")",
        zh: "能在对话中表达观点并说明原因（例如“我喜欢它，因为……”），而不只是陈述事实",
      },
      {
        en: "Can sustain a 4-part spoken interaction, including a short discussion with a partner, without needing constant prompting",
        zh: "能完成包含四个部分的口语互动，包括与同伴的简短讨论，不需要不断提示",
      },
      {
        en: "Can manage independent written work for 45 minutes without losing focus",
        zh: "能独立完成45分钟的书面练习，且保持专注",
      },
      {
        en: "Shows some ability to infer meaning from context when they don't know every word",
        zh: "即使遇到不认识的单词，也能根据上下文推测出大致意思",
      },
    ],
  },

  ketToPet: {
    slug: "ket-to-pet-what-changes",
    levelTag: "KET → PET",
    title: "KET → PET: what changes",
    titleZh: "从 KET 到 PET：有哪些变化？",
    isTransition: true,
    quickFacts: "For families moving from A2 Key for Schools (KET) to B1 Preliminary for Schools (PET).",
    intro:
      "If your child has just finished KET, congratulations — the hardest part, building real exam confidence, is already done. PET builds directly on those same skills; it doesn't start from scratch. Here's exactly what's different, so you know what to expect.",
    introZh:
      "如果您的孩子刚刚完成KET考试，恭喜——最难的部分，也就是建立真正的应试信心，已经完成了。PET正是在这些能力的基础上继续提升，而不是从零开始。以下是两者之间的具体差异，帮助您提前了解。",
    items: [
      {
        en: "One extra paper: Reading and Writing split into two standalone papers (previously combined at KET)",
        zh: "增加了一门考试：阅读和写作从KET阶段的合并试卷，变成两门独立的试卷",
      },
      {
        en: "Longer, denser reading texts with more inference required, not just literal fact-finding",
        zh: "阅读文章更长、信息更密集，需要更多推理理解，而不只是查找字面信息",
      },
      {
        en: "Writing moves from short sentences to a structured ~100-word story/article",
        zh: "写作从简单句子过渡到结构完整、约100词的故事或文章",
      },
      {
        en: "Speaking gets longer (10–12 min vs 8–10 min) and includes more independent opinion-giving",
        zh: "口语考试时间变长（从8-10分钟增加到10-12分钟），并需要更多独立表达观点",
      },
      {
        en: "Listening moves closer to natural speaking speed",
        zh: "听力材料的语速更接近自然语速",
      },
      {
        en: "Reassurance: everything the child already learned for KET carries over — PET builds on it rather than replacing it",
        zh: "请放心：孩子在KET阶段积累的一切——词汇习惯、应试耐力、口语自信——都会直接延续到PET阶段。PET是在KET基础上的进阶，而不是从零开始",
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
