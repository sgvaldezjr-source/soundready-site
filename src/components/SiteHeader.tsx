import { Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SiteHeader() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex gap-3 sm:gap-6 items-center flex-shrink-0">
          <a href="/" style={{ color: "#1F3A5F" }}>
            <Home size={18} />
          </a>
          <a href="/sergio" className="text-sm font-medium whitespace-nowrap" style={{ color: "#666" }}>
            {language === "en" ? "Your tutor" : "您的导师"}
          </a>
          <a href="/blog" className="text-sm font-medium" style={{ color: "#666" }}>
            {language === "en" ? "Blog" : "博客"}
          </a>
          <a href="/app" className="text-sm font-medium" style={{ color: "#666" }}>
            {language === "en" ? "App" : "应用"}
          </a>
        </div>
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1 flex-shrink-0">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === "en" ? "bg-[#1F3A5F] text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("zh")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === "zh" ? "bg-[#1F3A5F] text-white" : "text-gray-700 hover:bg-gray-200"}`}
          >
            中文
          </button>
        </div>
      </div>
    </header>
  );
}