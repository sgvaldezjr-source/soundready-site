import { lazy, Suspense, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FileText, Clock } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

// pdfjs-dist is ~1MB — load it only when a PDF actually needs to render, not on every page
const PdfPreview = lazy(() => import("@/components/PdfPreview"));

interface ResourceRow {
  title: string;
  note: string;
  href: string;
  ready: boolean;
  /** optional sub-grouping label rendered above consecutive rows that share it */
  subheading?: string;
}

type TrackName = "IELTS" | "KET" | "PET" | "Young Learners";

interface SkillSection {
  skill: string;
  tracks: Partial<Record<TrackName, ResourceRow[]>>;
}

const TRACK_ORDER: TrackName[] = ["IELTS", "KET", "PET", "Young Learners"];

const TRACK_ACCENT: Record<TrackName, string> = {
  IELTS: "#B85C38",
  KET: "#B85C38",
  PET: "#B85C38",
  "Young Learners": "#3A6FA8",
};

const skills: SkillSection[] = [
  {
    skill: "Getting started",
    tracks: {
      IELTS: [
        {
          title: "Why your IELTS score is stuck — self-check",
          note: "A 5-point printable audit of how you're preparing",
          href: "/resources/ielts-score-stuck-checklist.pdf",
          ready: true,
        },
      ],
      "Young Learners": [
        {
          title: "Is your child ready for Movers?",
          note: "Parent readiness checklist",
          href: "/resources/is-your-child-ready-for-movers.pdf",
          ready: true,
          subheading: "Movers",
        },
        {
          title: "Is your child ready for KET?",
          note: "Skill-by-skill parent check",
          href: "/resources/is-your-child-ready-for-ket.pdf",
          ready: true,
          subheading: "KET",
        },
        {
          title: "Complete KET Course Book",
          note: "Unit Maps",
          href: "/resources/ket-complete-course-book.pdf",
          ready: true,
          subheading: "KET",
        },
        {
          title: "Is your child ready for PET?",
          note: "Skill-by-skill parent check",
          href: "/resources/is-your-child-ready-for-pet.pdf",
          ready: true,
          subheading: "PET",
        },
        {
          title: "Complete PET Course Book",
          note: "Unit Maps",
          href: "/resources/pet-complete-course-book.pdf",
          ready: true,
          subheading: "PET",
        },
        {
          title: "KET → PET: what changes",
          note: "Parent guide",
          href: "/resources/ket-to-pet-what-changes.pdf",
          ready: true,
        },
      ],
    },
  },
  {
    skill: "Speaking",
    tracks: {
      IELTS: [
        {
          title: "IELTS pronunciation self-check",
          note: "A 7-point printable checklist for your Speaking score",
          href: "/resources/ielts-pronunciation-checklist.pdf",
          ready: true,
        },
        {
          title: "Part 2 long-turn prompts",
          note: "Cue cards with timing drills",
          href: "",
          ready: false,
        },
      ],
      KET: [
        {
          title: "KET speaking practice prompts",
          note: "Paired-task cue cards",
          href: "",
          ready: false,
        },
      ],
      PET: [],
      "Young Learners": [],
    },
  },
  {
    skill: "Reading",
    tracks: {
      IELTS: [],
      KET: [],
      PET: [],
      "Young Learners": [],
    },
  },
  {
    skill: "Writing",
    tracks: {
      IELTS: [
        {
          title: "Band 6 → 7 essay checklist",
          note: "What examiners reward in Task 2",
          href: "",
          ready: false,
        },
        {
          title: "Task 1 structure worksheet",
          note: "Data & letter templates",
          href: "",
          ready: false,
        },
      ],
      KET: [],
      PET: [],
      "Young Learners": [],
    },
  },
  {
    skill: "Listening",
    tracks: {
      IELTS: [
        {
          title: "Prediction & keyword drill",
          note: "Pre-listening technique",
          href: "",
          ready: false,
        },
      ],
      KET: [],
      PET: [],
      "Young Learners": [],
    },
  },
];

function groupBySubheading(rows: ResourceRow[]): { subheading?: string; rows: ResourceRow[] }[] {
  const segments: { subheading?: string; rows: ResourceRow[] }[] = [];
  for (const row of rows) {
    const last = segments[segments.length - 1];
    if (last && last.subheading === row.subheading) {
      last.rows.push(row);
    } else {
      segments.push({ subheading: row.subheading, rows: [row] });
    }
  }
  return segments;
}

const SKILL_NAMES = skills.map((s) => s.skill);

/**
 * Rows for a given (category, skill) pair. KET and PET are nested inside the
 * "Young Learners" track as subheadings rather than their own top-level track
 * (see e.g. "Complete KET Course Book"), so surface those under the KET/PET
 * category too — stripping the now-redundant subheading label since the
 * category tab itself already says "KET"/"PET".
 */
function getRows(category: TrackName, skillName: string): ResourceRow[] {
  const section = skills.find((s) => s.skill === skillName);
  if (!section) return [];
  const base = section.tracks[category] ?? [];
  if (category === "KET" || category === "PET") {
    const fromYoungLearners = (section.tracks["Young Learners"] ?? [])
      .filter((r) => r.subheading === category)
      .map((r) => ({ ...r, subheading: undefined }));
    return [...base, ...fromYoungLearners];
  }
  return base;
}

/** first ready row across skills (in skills array order) for a category — used as the default preview */
function findDefaultRow(category: TrackName): ResourceRow | null {
  for (const skillName of SKILL_NAMES) {
    const row = getRows(category, skillName).find((r) => r.ready);
    if (row) return row;
  }
  return null;
}

const pillBase =
  "text-xs font-semibold uppercase tracking-wide rounded-full border px-3 py-1.5 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F]";

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<TrackName>(TRACK_ORDER[0]);
  const [activeSkillName, setActiveSkillName] = useState(SKILL_NAMES[0]);
  const [selected, setSelected] = useState<ResourceRow | null>(() => findDefaultRow(TRACK_ORDER[0]));

  const rows = getRows(activeCategory, activeSkillName);

  function handleCategoryChange(category: string) {
    const c = category as TrackName;
    setActiveCategory(c);
    const nextRows = getRows(c, activeSkillName);
    setSelected(nextRows.find((r) => r.ready) ?? findDefaultRow(c));
  }

  function handleSkillChange(skillName: string) {
    setActiveSkillName(skillName);
    const nextRows = getRows(activeCategory, skillName);
    setSelected(nextRows.find((r) => r.ready) ?? null);
  }

  function renderPreview(heightClass: string) {
    if (!selected) {
      return (
        <Empty className={`${heightClass} rounded-xl border-2 border-dashed border-gray-200`}>
          <EmptyHeader>
            <EmptyMedia variant="icon" style={{ background: "#F4F1EC", color: "#1F3A5F" }}>
              <FileText />
            </EmptyMedia>
            <EmptyTitle>Nothing to preview yet</EmptyTitle>
            <EmptyDescription>Resources for this section are still on the way.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    if (!selected.ready) {
      return (
        <Empty className={`${heightClass} rounded-xl border-2 border-dashed border-gray-200`}>
          <EmptyHeader>
            <EmptyMedia variant="icon" style={{ background: "#F4F1EC", color: TRACK_ACCENT[activeCategory] }}>
              <Clock />
            </EmptyMedia>
            <EmptyTitle>{selected.title}</EmptyTitle>
            <EmptyDescription>
              This one's still in the works — check back soon, or{" "}
              <a href="/contact">book a free diagnostic</a> in the meantime.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <Suspense
        fallback={
          <div className={`flex items-center justify-center gap-2 bg-gray-50 text-sm text-gray-400 ${heightClass}`}>
            <Spinner /> Loading preview…
          </div>
        }
      >
        <PdfPreview key={selected.href} src={selected.href} title={selected.title} className={heightClass} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Free IELTS &amp; Cambridge Resources | Sound Ready</title>
        <link rel="canonical" href="https://sound-ready.com/resources" />
      </Helmet>
      <SiteHeader />
      <div className="max-w-6xl mx-auto px-4 pb-16 pt-32">
        <h1
          className="text-4xl md:text-5xl font-serif font-bold mb-4 text-center"
          style={{ color: "#1F3A5F" }}
        >
          Resources
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Free printable resources — organised by exam and skill. Pick a section, preview a resource, download what you need.
        </p>

        {/* categories on top — the primary exam-program navigation */}
        <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
          <TabsList className="flex h-auto w-full flex-wrap items-stretch justify-center gap-1 rounded-lg bg-gray-50 p-1 sm:justify-start">
            {TRACK_ORDER.map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="h-auto flex-shrink-0 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors motion-reduce:transition-none hover:bg-gray-200 data-[state=active]:text-white data-[state=active]:shadow-none"
                style={activeCategory === t ? { backgroundColor: TRACK_ACCENT[t] } : undefined}
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            {/* skills under the categories — secondary navigation */}
            <div className="mb-6 mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {SKILL_NAMES.map((skillName) => (
                <button
                  key={skillName}
                  onClick={() => handleSkillChange(skillName)}
                  className={pillBase}
                  style={
                    activeSkillName === skillName
                      ? { background: "#1F3A5F", color: "#fff", borderColor: "#1F3A5F" }
                      : { color: "#1F3A5F", borderColor: "#e5e7eb" }
                  }
                >
                  {skillName}
                </button>
              ))}
            </div>

            {/* preview — directly under the tabs, auto-displayed, no click/dialog needed */}
            <div className="mb-8">
              {selected?.ready ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{selected.title}</p>
                      <p className="text-sm text-gray-400 truncate">{selected.note}</p>
                    </div>
                    <a
                      href={selected.href}
                      download
                      className="flex-shrink-0 text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F]"
                      style={{ color: "#1F3A5F" }}
                    >
                      Download
                    </a>
                  </div>
                  {renderPreview("h-[50vh] lg:h-[70vh]")}
                </div>
              ) : (
                renderPreview("h-[50vh] lg:h-[70vh]")
              )}
            </div>

            {rows.length === 0 ? (
              <p className="py-2 text-sm text-gray-300">Coming soon</p>
            ) : (
              groupBySubheading(rows).map((segment, si) => (
                <div key={si} className={si > 0 ? "mt-5" : undefined}>
                  {segment.subheading && (
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                      {segment.subheading}
                    </h4>
                  )}
                  <ul>
                    {segment.rows.map((row, i) => {
                      const isSelected = selected?.title === row.title;
                      return (
                        <li
                          key={row.title}
                          className={i < segment.rows.length - 1 ? "border-b border-gray-100" : undefined}
                        >
                          <button
                            onClick={() => setSelected(row)}
                            aria-pressed={isSelected}
                            className={`w-full flex items-start justify-between gap-6 -mx-2 px-2 py-2 rounded-md text-left transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F] ${
                              isSelected ? "bg-gray-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="flex-1 min-w-0">
                              <span
                                className="font-medium leading-snug block"
                                style={{ color: isSelected ? "#1F3A5F" : "#111827" }}
                              >
                                {row.title}
                              </span>
                              <span className="text-sm text-gray-400">{row.note}</span>
                            </span>
                            <span className="flex-shrink-0 pt-0.5 text-sm font-medium">
                              {row.ready ? (
                                <span style={{ color: "#1F3A5F" }}>View</span>
                              ) : (
                                <span className="text-gray-300">Coming soon</span>
                              )}
                            </span>
                          </button>
                          {row.ready && (
                            <div className="flex items-center gap-4 px-2 pb-2 -mt-1">
                              <a
                                href={row.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-gray-400 hover:text-gray-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F]"
                              >
                                Preview
                              </a>
                              <a
                                href={row.href}
                                download
                                className="text-xs font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F]"
                                style={{ color: "#1F3A5F" }}
                              >
                                Download PDF
                              </a>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <a
            href="/contact"
            className="text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F]"
            style={{ color: "#1F3A5F" }}
          >
            Book a free diagnostic
          </a>
        </div>
      </div>
    </div>
  );
}
