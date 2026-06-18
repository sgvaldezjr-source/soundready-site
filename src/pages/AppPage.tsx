import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/SiteHeader";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Helmet><link rel="canonical" href="https://sound-ready.com/app" /></Helmet>
      <SiteHeader />

      {/* Hero */}
      <section
        className="pt-32 pb-20 px-4 text-center"
        style={{ background: "linear-gradient(160deg, #1F3A5F 0%, #15294a 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Prepare for IELTS Smarter
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-2xl mx-auto">
            AI-powered practice for speaking, mock tests, vocabulary and grammar — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.sound-ready.com"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D4A537" }}
            >
              Try the App Free
            </a>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-base border-2 border-white text-white transition-colors hover:bg-white hover:text-[#1F3A5F]"
            >
              Book a Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-slate-900 text-center mb-12"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Everything you need to hit your target band
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎤",
                title: "Speaking Practice",
                desc: "Get instant AI feedback on your IELTS speaking responses",
              },
              {
                icon: "📝",
                title: "Mock Tests & Scoring",
                desc: "Full mock tests scored to IELTS band standards",
              },
              {
                icon: "📚",
                title: "Vocabulary & Grammar",
                desc: "Targeted drills to close your weakest gaps",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3
                  className="text-xl font-bold text-slate-900 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1F3A5F" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl font-bold text-white mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to raise your band score?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://app.sound-ready.com"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D4A537" }}
            >
              Try the App Free
            </a>
            <a
              href="/contact"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-base border-2 border-white text-white transition-colors hover:bg-white hover:text-[#1F3A5F]"
            >
              Book a Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 SoundReady. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-4">
            <a href="/privacy-policy" className="hover:text-white">
              {language === "en" ? "Privacy Policy" : "隐私政策"}
            </a>
            <span>|</span>
            <a href="/terms-of-service" className="hover:text-white">
              {language === "en" ? "Terms of Service" : "服务条款"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
