import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader";

interface ResourceRow {
  title: string;
  note: string;
  href: string;
  ready: boolean;
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
          href: "",
          ready: false,
        },
        {
          title: "Is your child ready for KET?",
          note: "Skill-by-skill parent check",
          href: "",
          ready: false,
        },
        {
          title: "KET → PET: what changes",
          note: "Parent guide",
          href: "",
          ready: false,
        },
      ],
    },
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Free IELTS &amp; Cambridge Resources | Sound Ready</title>
        <link rel="canonical" href="https://sound-ready.com/resources" />
      </Helmet>
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-4 py-16 pt-32">
        <h1
          className="text-4xl md:text-5xl font-serif font-bold mb-4 text-center"
          style={{ color: "#1F3A5F" }}
        >
          Resources
        </h1>
        <p className="text-center text-gray-500 mb-14">
          Free printable resources — organised by exam and skill. Download what you need.
        </p>

        {skills.map((section) => {
          const tracksToRender = section.alwaysShowAllTracks
            ? TRACK_ORDER
            : TRACK_ORDER.filter((t) => (section.tracks[t] ?? []).length > 0);

          return (
            <section key={section.skill} className="mb-14">
              <h2
                className="text-2xl font-serif font-bold mb-8"
                style={{ color: "#1F3A5F" }}
              >
                {section.skill}
              </h2>

              {tracksToRender.map((trackName) => {
                const rows = section.tracks[trackName] ?? [];
                return (
                  <div key={trackName} className="mb-8">
                    <h3
                      className="text-xs font-semibold uppercase tracking-widest mb-3"
                      style={{ color: TRACK_ACCENT[trackName] }}
                    >
                      {trackName}
                    </h3>

                    {rows.length === 0 ? (
                      <p className="py-2 text-sm text-gray-300">Coming soon</p>
                    ) : (
                      <ul>
                        {rows.map((row, i) => (
                          <li
                            key={row.title}
                            className={`flex items-start justify-between gap-6 py-3${
                              i < rows.length - 1 ? " border-b border-gray-100" : ""
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-900 font-medium leading-snug block">
                                {row.title}
                              </span>
                              <span className="text-sm text-gray-400">{row.note}</span>
                            </div>
                            <div className="flex-shrink-0 pt-0.5">
                              {row.ready ? (
                                <a
                                  href={row.href}
                                  download
                                  className="text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3A5F]"
                                  style={{ color: "#1F3A5F" }}
                                >
                                  Download PDF
                                </a>
                              ) : (
                                <span className="text-sm text-gray-300">Coming soon</span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
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
