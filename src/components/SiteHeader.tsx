import { Home, BookUser, BookOpen, FileText, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SiteHeader() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4">
        <div className="flex gap-3 sm:gap-6 items-center flex-shrink-0">
          <a href="/" className="relative group flex flex-col items-center" style={{ color: "#1F3A5F" }}>
            <Home size={18} />
            <span className="absolute top-full mt-1.5 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
              Home
            </span>
          </a>
          <a href="/sergio" className="relative group flex flex-col items-center" style={{ color: "#666" }}>
            <BookUser size={18} />
            <span className="absolute top-full mt-1.5 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
              About
            </span>
          </a>
          <a href="/blog" className="relative group flex flex-col items-center" style={{ color: "#666" }}>
            <BookOpen size={18} />
            <span className="absolute top-full mt-1.5 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
              Blog
            </span>
          </a>
          <a href="/resources" className="relative group flex flex-col items-center" style={{ color: "#666" }}>
            <FileText size={18} />
            <span className="absolute top-full mt-1.5 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
              Resources
            </span>
          </a>
          <a href="/app" className="relative group flex flex-col items-center" style={{ color: "#666" }}>
            <Smartphone size={18} />
            <span className="absolute top-full mt-1.5 text-[10px] font-medium text-gray-600 bg-white border border-gray-200 rounded px-1.5 py-0.5 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
              App
            </span>
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