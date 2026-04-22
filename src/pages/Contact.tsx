import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, Clock } from "lucide-react";
import { config } from "@/config";

export default function Contact() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      inquiryType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error(language === "en" ? "Please fill in all required fields" : "请填写所有必填字段");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(config.formspree.contact, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          inquiryType: formData.inquiryType,
          _subject: `New Contact Form Submission from ${formData.name}`,
        }),
      });

      if (response.ok) {
        toast.success(
          language === "en"
            ? "Thank you! We'll get back to you soon."
            : "谢谢！我们会尽快回复您。"
        );
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          inquiryType: "general",
        });
      } else {
        toast.error(
          language === "en"
            ? "Failed to send message. Please try again."
            : "发送失败。请重试。"
        );
      }
    } catch (error) {
      toast.error(
        language === "en"
          ? "Failed to send message. Please try again."
          : "发送失败。请重试。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-6">
            <a href="/" className="text-lg font-semibold text-slate-900 hover:text-teal-600">
              {language === "en" ? "SoundReady" : "SoundReady"}
            </a>
            <a href="/sergio" className="text-lg font-semibold text-slate-900 hover:text-teal-600">
              {language === "en" ? "Your tutor" : "您的导师"}
            </a>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = "/?lang=en"}
              className={`px-3 py-1 rounded ${language === "en" ? "bg-teal-600 text-white" : "bg-slate-200"}`}
            >
              English
            </button>
            <button
              onClick={() => window.location.href = "/?lang=zh"}
              className={`px-3 py-1 rounded ${language === "zh" ? "bg-teal-600 text-white" : "bg-slate-200"}`}
            >
              中文
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {language === "en" ? "Get in Touch" : "联系我们"}
            </h1>
            <p className="text-lg text-slate-600">
              {language === "en"
                ? "Have questions about our tutoring services? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible."
                : "对我们的辅导服务有疑问？我们很乐意听到您的意见。请填写下面的表格，我们会尽快回复您。"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {language === "en" ? "Email" : "电子邮件"}
                  </h3>
                  <p className="text-slate-600">sergio@sound-ready.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {language === "en" ? "Response Time" : "回复时间"}
                  </h3>
                  <p className="text-slate-600">
                    {language === "en" ? "24-48 hours" : "24-48小时"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {language === "en" ? "WeChat" : "微信"}
                  </h3>
                  <p className="text-slate-600">Serge409</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {language === "en" ? "Send us a Message" : "发送消息"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {language === "en" ? "Name" : "姓名"} *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={language === "en" ? "Your name" : "您的姓名"}
                  required
                  className="w-full"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {language === "en" ? "Email" : "电子邮件"} *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === "en" ? "your@email.com" : "your@email.com"}
                  required
                  className="w-full"
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {language === "en" ? "Inquiry Type" : "咨询类型"}
                </label>
                <Select value={formData.inquiryType} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      {language === "en" ? "General Question" : "一般问题"}
                    </SelectItem>
                    <SelectItem value="pricing">
                      {language === "en" ? "Pricing & Packages" : "价格和套餐"}
                    </SelectItem>
                    <SelectItem value="lesson">
                      {language === "en" ? "Lesson Format" : "课程格式"}
                    </SelectItem>
                    <SelectItem value="exam">
                      {language === "en" ? "Exam Preparation" : "考试准备"}
                    </SelectItem>
                    <SelectItem value="other">
                      {language === "en" ? "Other" : "其他"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {language === "en" ? "Subject" : "主题"}
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={language === "en" ? "What is your message about?" : "您的消息是关于什么的？"}
                  className="w-full"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  {language === "en" ? "Message" : "消息"} *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={language === "en" ? "Please tell us more about your inquiry..." : "请告诉我们更多关于您的咨询..."}
                  required
                  className="w-full min-h-32"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg"
              >
                {isSubmitting
                  ? language === "en"
                    ? "Sending..."
                    : "发送中..."
                  : language === "en"
                    ? "Send Message"
                    : "发送消息"}
              </Button>
            </form>

            <p className="text-sm text-slate-500 mt-4 text-center">
              {language === "en"
                ? "* Required fields. We'll respond within 24-48 hours."
                : "* 必填字段。我们将在24-48小时内回复。"}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 SoundReady English-IELTSTutor.com All rights reserved. Reproduction without permission is prohibited.</p>
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
