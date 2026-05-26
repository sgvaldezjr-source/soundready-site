import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SiteHeader from "@/components/SiteHeader";
import { translations } from "@/lib/translations";
import { config } from "@/config";
import { toast } from "sonner";

export default function SoundReady() {
  const { language } = useLanguage();
  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = translations[language as keyof typeof translations];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wechat: "",
    exam: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(config.formspree.booking, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          wechatId: formData.wechat || "",
          examTarget: formData.exam,
          message: formData.message || "",
          language,
          _subject: `New Trial Lesson Booking from ${formData.name}`,
        }),
      });

      if (response.ok) {
        toast.success(
          language === "zh"
            ? "感谢您的预约！我们将很快与您联系。"
            : "Thank you for your interest! We will contact you soon."
        );
        setShowBookingForm(false);
        setFormData({ name: "", email: "", wechat: "", exam: "", message: "" });
      } else {
        toast.error(
          language === "zh"
            ? "提交失败，请重试。"
            : "Failed to submit booking. Please try again."
        );
      }
    } catch (error: any) {
      toast.error(
        language === "zh"
          ? "提交失败，请重试。"
          : "Failed to submit booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

const logoUrl = "/soundready-logo-transparent.png";

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="h-16" />

      {/* Hero Section with Embedded Logo */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">
        {/* Subtle logo watermark background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img src={logoUrl} alt="" className="h-96 w-auto" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Logo - Prominently embedded */}
          <div className="mb-8 flex justify-center">
            <img src={logoUrl} alt="SoundReady English Logo" className="h-96 w-auto [filter:drop-shadow(0_20px_25px_rgba(0,0,0,0.15))] hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
            <span className="text-sm font-medium" style={{ color: "#E89B2C" }}>
              {t("soundReadyBadge")}
            </span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6" style={{ color: "#1F3A5F" }}>
            {t("soundReadyTagline")}
          </h1>

          {/* Exam Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["IELTS", "KET", "PET", "FCE", "General English", "Young Learners"].map((exam) => (
              <span
                key={exam}
                className="px-4 py-2 border-2 rounded-full text-sm font-medium"
                style={{ borderColor: "#1F3A5F", color: "#1F3A5F" }}
              >
                {exam}
              </span>
            ))}
          </div>

          {/* Primary CTA */}
          <Button
            size="lg"
            className="mb-4 text-white font-semibold"
            style={{ backgroundColor: "#1F3A5F" }}
            onClick={() => setShowBookingForm(true)}
          >
            {t("soundReadyTrialCTA")}
          </Button>

          {/* Sub-text */}
          <p className="text-gray-500 text-sm">{t("soundReadyTrialSubtext")}</p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-2 text-center" style={{ color: "#1F3A5F" }}>
            {t("soundReadyComparisonHeading")}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {language === "en"
              ? "See how SoundReady English stands apart from generic marketplace platforms"
              : "看看 SoundReady English 如何与通用市场平台不同"}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Marketplace Card */}
            <Card className="p-8 bg-white border border-gray-200">
              <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: "#666" }}>
                {language === "en" ? "Marketplace" : "自由市场"}
              </h3>
              <p className="text-sm text-gray-500 mb-6">{t("soundReadyMarketplaceSubtitle")}</p>
              <div className="space-y-4">
                {(t("soundReadyWeaknesses") as unknown as string[]).map((weakness: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{weakness}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* SoundReady Card */}
            <Card
              className="p-8 bg-white border-2"
              style={{ borderColor: "#E89B2C" }}
            >
              <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: "#1F3A5F" }}>
                {language === "en" ? "SoundReady English" : "SoundReady 英语"}
              </h3>
              <p className="text-sm mb-6" style={{ color: "#E89B2C" }}>
                {language === "en" ? "Expert-led, exam-focused approach" : "专家领导，考试重点方法"}
              </p>
              <div className="space-y-4">
                {(t("soundReadyStrengths") as unknown as string[]).map((strength: string, idx: number) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#E89B2C" }} />
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Credentials Bar */}
      <section className="py-12 px-4" style={{ backgroundColor: "#1F3A5F" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-white text-center">
            <div>
              <div className="text-2xl font-bold mb-2" style={{ color: "#E89B2C" }}>
                MEd
              </div>
              <p className="text-sm">{t("soundReadyCredentialsMEd")}</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2" style={{ color: "#E89B2C" }}>
                60+
              </div>
              <p className="text-sm">{t("soundReadyCredentialsStudents")}</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2" style={{ color: "#E89B2C" }}>
                IELTS · KET · PET · FCE
              </div>
              <p className="text-sm">{t("soundReadyCredentialsCertifications")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center" style={{ color: "#1F3A5F" }}>
            {language === "en" ? "What students and parents say" : "学生和家长怎么说"}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {(t("soundReadyTestimonials") as unknown as Array<{ text: string; author: string }>).map(
              (testimonial: { text: string; author: string }, idx: number) => (
                <Card
                  key={idx}
                  className="p-6 bg-white border-l-4"
                  style={{ borderLeftColor: "#E89B2C" }}
                >
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="text-sm font-semibold" style={{ color: "#1F3A5F" }}>
                    — {testimonial.author}
                  </p>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1F3A5F" }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-serif font-bold mb-4">
            {language === "en" ? "Ready to sound ready?" : "准备好了吗？"}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("soundReadyCTAText")}
          </p>
          <Button
            size="lg"
            className="text-white font-semibold"
            style={{ backgroundColor: "#E89B2C", color: "#1F3A5F" }}
            onClick={() => setShowBookingForm(true)}
          >
            {t("soundReadyTrialCTA")}
          </Button>
        </div>
      </section>

      {/* Booking Form Modal */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#1F3A5F" }}>
              {language === "en" ? "Book Your Free Trial" : "预约您的免费试课"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium" style={{ color: "#1F3A5F" }}>
                {language === "en" ? "Name" : "姓名"}
              </label>
              <input
                type="text"
                placeholder={language === "en" ? "Your name" : "您的姓名"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1F3A5F" }}>
                {language === "en" ? "Email" : "电子邮件"}
              </label>
              <input
                type="email"
                placeholder={language === "en" ? "your@email.com" : "your@email.com"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1F3A5F" }}>
                {language === "en" ? "WeChat ID (optional)" : "微信ID（可选）"}
              </label>
              <input
                type="text"
                placeholder={language === "en" ? "e.g., Serge409" : "例如：Serge409"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                value={formData.wechat}
                onChange={(e) => setFormData({ ...formData, wechat: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1F3A5F" }}>
                {language === "en" ? "Exam target" : "考试目标"}
              </label>
              <Select value={formData.exam} onValueChange={(value) => setFormData({ ...formData, exam: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={language === "en" ? "Select exam" : "选择考试"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ielts">IELTS</SelectItem>
                  <SelectItem value="ket">KET</SelectItem>
                  <SelectItem value="pet">PET</SelectItem>
                  <SelectItem value="fce">FCE</SelectItem>
                  <SelectItem value="general">General English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ color: "#1F3A5F" }}>
                {language === "en" ? "Message" : "信息"}
              </label>
              <textarea
                placeholder={language === "en" ? "Tell us about your goals (optional)" : "告诉我们您的目标（可选）"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <Button
              type="submit"
              className="w-full text-white font-semibold"
              style={{ backgroundColor: "#1F3A5F" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (language === "en" ? "Submitting..." : "提交中...") : (language === "en" ? "Submit" : "提交")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center gap-4">
            <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="/terms-of-service" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </a>
            <span>|</span>
            <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              Contact
            </a>
          </div>
          <div className="text-center text-sm text-gray-600">
            <a href="/disclaimer">Disclaimer</a>
            <p>© 2026 SoundReady English-IELTSTutor.com All rights reserved. Reproduction without permission is prohibited.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
