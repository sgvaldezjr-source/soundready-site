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
  /** true = always render all four tracks, even empty; false = only render tracks with rows */
  alwaysShowAllTracks: boolean;
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
    alwaysShowAllTracks: false,
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
    alwaysShowAllTracks: true,
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
    alwaysShowAllTracks: true,
    tracks: {
      IELTS: [],
      KET: [],
      PET: [],
      "Young Learners": [],
    },
  },
  {
    skill: "Writing",
    alwaysShowAllTracks: true,
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
    alwaysShowAllTracks: true,
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

type Selection = { track: TrackName; row: ResourceRow };

function getTracksToRender(section: SkillSection): TrackName[] {
  return section.alwaysShowAllTracks
    ? TRACK_ORDER
    : TRACK_ORDER.filter((t) => (section.tracks[t] ?? []).length > 0);
}

/** first ready row in a section, scanning tracks in TRACK_ORDER — used as the default preview */
function findDefaultSelection(section: SkillSection): Selection | null {
  for (const track of TRACK_ORDER) {
    const row = (section.tracks[track] ?? []).find((r) => r.ready);
    if (row) return { track, row };
  }
  return null;
}

const pillBase =
  "text-xs font-semibold uppercase tracking-wide rounded-full border px-3 py-1.5 transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F]";

export default function Resources() {
  const [activeSkill, setActiveSkill] = useState(skills[0].skill);
  const [activeTrack, setActiveTrack] = useState<TrackName | "All">("All");
  const [selected, setSelected] = useState<Selection | null>(() => findDefaultSelection(skills[0]));

  const section = skills.find((s) => s.skill === activeSkill) ?? skills[0];
  const tracksToRender = getTracksToRender(section);
  const visibleTracks = activeTrack === "All" ? tracksToRender : tracksToRender.filter((t) => t === activeTrack);

  function handleSkillChange(skill: string) {
    const next = skills.find((s) => s.skill === skill);
    setActiveSkill(skill);
    setActiveTrack("All");
    setSelected(next ? findDefaultSelection(next) : null);
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

    if (!selected.row.ready) {
      return (
        <Empty className={`${heightClass} rounded-xl border-2 border-dashed border-gray-200`}>
          <EmptyHeader>
            <EmptyMedia variant="icon" style={{ background: "#F4F1EC", color: TRACK_ACCENT[selected.track] }}>
              <Clock />
            </EmptyMedia>
            <EmptyTitle>{selected.row.title}</EmptyTitle>
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
        <PdfPreview key={selected.row.href} src={selected.row.href} title={selected.row.title} className={heightClass} />
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

        <Tabs
          value={activeSkill}
          onValueChange={handleSkillChange}
          orientation="vertical"
          className="flex-col lg:flex-row lg:items-start gap-6 lg:gap-8"
        >
          <TabsList className="flex h-auto w-full flex-row items-stretch justify-start gap-1 overflow-x-auto rounded-lg bg-gray-50 p-1 lg:w-56 lg:flex-shrink-0 lg:flex-col lg:sticky lg:top-28">
            {skills.map((s) => (
              <TabsTrigger
                key={s.skill}
                value={s.skill}
                className="h-auto flex-shrink-0 justify-start whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors motion-reduce:transition-none hover:bg-gray-200 data-[state=active]:bg-[#1F3A5F] data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:hover:bg-[#1F3A5F] lg:w-full"
              >
                {s.skill}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeSkill} className="min-w-0 flex-1">
            <div className="lg:grid lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-8 lg:items-start">
              {/* preview — directly under the skill tabs on mobile (order-1); docked to the
                  right column on desktop (lg:order-2) */}
              <div className="order-1 mb-8 lg:order-2 lg:mb-0 lg:sticky lg:top-28">
                {selected?.row.ready ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{selected.row.title}</p>
                        <p className="text-sm text-gray-400 truncate">{selected.row.note}</p>
                      </div>
                      <a
                        href={selected.row.href}
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

              <div className="order-2 lg:order-1">
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTrack("All")}
                className={pillBase}
                style={
                  activeTrack === "All"
                    ? { background: "#1F3A5F", color: "#fff", borderColor: "#1F3A5F" }
                    : { color: "#1F3A5F", borderColor: "#e5e7eb" }
                }
              >
                All
              </button>
              {tracksToRender.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTrack(t)}
                  className={pillBase}
                  style={
                    activeTrack === t
                      ? { background: TRACK_ACCENT[t], color: "#fff", borderColor: TRACK_ACCENT[t] }
                      : { color: TRACK_ACCENT[t], borderColor: "#e5e7eb" }
                  }
                >
                  {t}
                </button>
              ))}
            </div>

              <div className="space-y-8 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-4">
                {visibleTracks.map((trackName) => {
                  const rows = section.tracks[trackName] ?? [];
                  return (
                    <div key={trackName}>
                      <h3
                        className="text-xs font-semibold uppercase tracking-widest mb-3"
                        style={{ color: TRACK_ACCENT[trackName] }}
                      >
                        {trackName}
                      </h3>

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
                                const isSelected = selected?.track === trackName && selected.row.title === row.title;
                                return (
                                  <li
                                    key={row.title}
                                    className={i < segment.rows.length - 1 ? "border-b border-gray-100" : undefined}
                                  >
                                    <button
                                      onClick={() => setSelected({ track: trackName, row })}
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
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
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
