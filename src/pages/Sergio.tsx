import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Award, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SiteHeader from "@/components/SiteHeader";
import { translations } from "@/lib/translations";
import { config } from "@/config";
import { toast } from "sonner";

export default function Sergio() {
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
  const [showAvailability, setShowAvailability] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wechat: "",
    exam: "",
    message: "",
  });

  // Available time slots based on day of week (Beijing Time)
  // Weekdays (Mon-Fri): 5:30 PM to 10:00 PM
  // Weekends (Sat-Sun): 9:00 AM to 5:00 PM
  const getTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
    
    if (isWeekend) {
      // Weekend: 9:00 AM to 5:00 PM (30-minute slots)
      return [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00"
      ];
    } else {
      // Weekdays: 5:30 PM to 10:00 PM (30-minute slots)
      return [
        "17:30", "18:00", "18:30", "19:00", "19:30", "20:00",
        "20:30", "21:00", "21:30", "22:00"
      ];
    }
  };

  // Get available dates (next 30 days, all days including weekends)
  const getAvailableDates = () => {
    const available = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      // Include all days (both weekdays and weekends)
      available.push(date);
    }
    return available;
  };

  const availableDates = getAvailableDates();
  
  // Timezone conversion helper
  const convertBeijingTimeToLocal = (beijingTimeStr: string) => {
    const [hours, minutes] = beijingTimeStr.split(':').map(Number);
    const beijingDate = new Date();
    beijingDate.setHours(hours, minutes, 0, 0);
    const beijingOffset = 8 * 60;
    const localOffset = beijingDate.getTimezoneOffset();
    const timeDiff = (beijingOffset + localOffset) * 60 * 1000;
    const localDate = new Date(beijingDate.getTime() - timeDiff);
    const localHours = String(localDate.getHours()).padStart(2, '0');
    const localMinutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${localHours}:${localMinutes}`;
  };
  
  const isDateAvailable = (date: Date) => {
    return availableDates.some(d => 
      d.toDateString() === date.toDateString()
    );
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const calendarDays = [];
  const daysInMonth = getDaysInMonth(calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i));
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateSelect = (date: Date) => {
    if (isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(null);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookFromCalendar = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toLocaleDateString();
      setFormData({
        ...formData,
        message: `Preferred date: ${dateStr} at ${selectedTime}`
      });
      setShowAvailability(false);
      setShowBookingForm(true);
    } else {
      toast.error(language === "en" ? "Please select both date and time" : "请选择日期和时间");
    }
  };

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
          preferredDate: selectedDate ? selectedDate.toLocaleDateString() : "",
          preferredTime: selectedTime || "",
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

  return (
    <div className="min-h-screen bg-white">
      <Helmet><link rel="canonical" href="https://sound-ready.com/sergio" /></Helmet>
      <SiteHeader />
      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="text-left md:text-left">
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4" style={{ color: "#1F3A5F" }}>
                {t("sergioHeroHeading")}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t("sergioHeroSubheading")}
              </p>
              <Button
                size="lg"
                className="mb-4 text-white font-semibold"
                style={{ backgroundColor: "#1F3A5F" }}
                onClick={() => setShowBookingForm(true)}
              >
                {t("sergioHeroCTA")}
              </Button>
              <p className="text-gray-500 text-sm">{t("sergioHeroSubtext")}</p>
            </div>
            
            {/* Right side - Photo */}
            <div className="flex justify-center">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663428183852/FBPv6RSpJr4bth8GwtxoWw/profilepic_4681e0ee.jpg"
                alt="Sergio Valdes"
                className="rounded-lg shadow-2xl w-full max-w-sm h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TTT Methodology Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-4 text-center" style={{ color: "#1F3A5F" }}>
            {t("sergioTTTHeading")}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t("sergioTTTIntro")}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Test Phase */}
            <Card className="p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E89B2C" }}>
                  <span className="text-white font-bold text-lg">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-center" style={{ color: "#1F3A5F" }}>
                {t("sergioTTTPhase1Title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("sergioTTTPhase1Desc")}
              </p>
            </Card>

            {/* Teach Phase */}
            <Card className="p-8 bg-white border-2" style={{ borderColor: "#E89B2C" }}>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E89B2C" }}>
                  <span className="text-white font-bold text-lg">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-center" style={{ color: "#1F3A5F" }}>
                {t("sergioTTTPhase2Title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("sergioTTTPhase2Desc")}
              </p>
            </Card>

            {/* Test Phase (Again) */}
            <Card className="p-8 bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E89B2C" }}>
                  <span className="text-white font-bold text-lg">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3 text-center" style={{ color: "#1F3A5F" }}>
                {t("sergioTTTPhase3Title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("sergioTTTPhase3Desc")}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Sergio Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6 text-center" style={{ color: "#1F3A5F" }}>
            {t("sergioAboutHeading")}
          </h2>
          <p className="text-lg text-gray-600 mb-12 text-center">
            {t("sergioAboutIntro")}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {(t("sergioAboutPoints") as unknown as string[]).map((point: string, idx: number) => (
              <div key={`about-point-${idx}`} className="flex gap-4 items-start">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: "#E89B2C" }} />
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1F3A5F" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center text-white">
            {t("sergioCredentialsHeading")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* IELTS Examiner */}
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4" style={{ color: "#E89B2C" }} />
              <h3 className="text-xl font-serif font-bold mb-3 text-white">
                {t("sergioCredentialExaminer")}
              </h3>
              <p className="text-gray-300">
                {t("sergioCredentialExaminerDesc")}
              </p>
            </div>

            {/* ELT Experience */}
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "#E89B2C" }} />
              <h3 className="text-xl font-serif font-bold mb-3 text-white">
                {t("sergioCredentialExperience")}
              </h3>
              <p className="text-gray-300">
                {t("sergioCredentialExperienceDesc")}
              </p>
            </div>

            {/* Specialist */}
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "#E89B2C" }} />
              <h3 className="text-xl font-serif font-bold mb-3 text-white">
                {t("sergioCredentialSpecialist")}
              </h3>
              <p className="text-gray-300">
                {t("sergioCredentialSpecialistDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-12 text-center" style={{ color: "#1F3A5F" }}>
            {t("sergioTestimonialsHeading")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {(t("sergioTestimonials") as unknown as Array<{ text: string; author: string }>).map(
              (testimonial: { text: string; author: string }, idx: number) => (
                <Card
                  key={`testimonial-${idx}`}
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
            {t("sergioCTAHeading")}
          </h2>
          <p className="text-gray-300 mb-8">
            {t("sergioCTAText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-white font-semibold"
              style={{ backgroundColor: "#E89B2C", color: "#1F3A5F" }}
              onClick={() => setShowBookingForm(true)}
            >
              {t("sergioBookTrialBtn")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900 font-semibold"
              onClick={() => setShowAvailability(true)}
            >
              {t("sergioCheckAvailabilityBtn")}
            </Button>
          </div>
        </div>
      </section>

      {/* Availability Calendar Modal */}
      <Dialog open={showAvailability} onOpenChange={setShowAvailability}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: "#1F3A5F" }}>
              {language === "en" ? "Check Availability" : "查看可用时间"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Select a date and time for your trial lesson"
                : "为您的试课选择日期和时间"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Calendar */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold" style={{ color: "#1F3A5F" }}>
                  {calendarMonth.toLocaleDateString(language === "en" ? "en-US" : "zh-CN", {
                    month: "long",
                    year: "numeric"
                  })}
                </h3>
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="aspect-square"></div>;
                  }

                  const isAvailable = isDateAvailable(date);
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toDateString()}
                      onClick={() => handleDateSelect(date)}
                      disabled={!isAvailable}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "text-white"
                          : isAvailable
                          ? "hover:bg-gray-100 cursor-pointer"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                      style={{
                        backgroundColor: isSelected ? "#1F3A5F" : isToday ? "#f0f0f0" : "transparent",
                        opacity: isAvailable ? 1 : 0.5
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <h4 className="font-semibold mb-3" style={{ color: "#1F3A5F" }}>
                  {language === "en" 
                    ? `Select a time (Beijing Time - ${selectedDate.toLocaleDateString("en-US", { weekday: "long" })}):` 
                    : `选择时间（北京时间 - ${selectedDate.toLocaleDateString("zh-CN", { weekday: "long" })}）：`}
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  {selectedDate.getDay() === 0 || selectedDate.getDay() === 6
                    ? (language === "en" ? "Weekend: 9:00 AM - 5:00 PM" : "周末：上午9:00 - 下午5:00")
                    : (language === "en" ? "Weekday: 5:30 PM - 10:00 PM" : "工作日：下午5:30 - 晚上10:00")}
                </p>
                <p className="text-xs text-blue-600 mb-3 italic">
                  {language === "en" 
                    ? "Times shown in Beijing Time (your local time shown below each slot)"
                    : "时间以北京时间显示（您的本地时间显示在每个时间槽下方）"}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {getTimeSlots(selectedDate).map(time => {
                    const localTime = convertBeijingTimeToLocal(time);
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                          selectedTime === time
                            ? "text-white"
                            : "border border-gray-300 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor: selectedTime === time ? "#1F3A5F" : "transparent"
                        }}
                        title={`Beijing: ${time} | Your local time: ${localTime}`}
                      >
                        <div className="font-semibold">{time}</div>
                        <div className="text-xs opacity-75">({localTime})</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAvailability(false)}
              >
                {language === "en" ? "Cancel" : "取消"}
              </Button>
              <Button
                onClick={handleBookFromCalendar}
                disabled={!selectedDate || !selectedTime}
                style={{ backgroundColor: "#1F3A5F" }}
                className="text-white"
              >
                {language === "en" ? "Book This Slot" : "预约此时间"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Form Modal */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "#1F3A5F" }}>
              {language === "en" ? "Book Your Free Trial" : "预约您的免费试课"}
            </DialogTitle>
            <DialogDescription>
              {language === "en" 
                ? "Schedule a 30-minute session with Sergio. No commitment required."
                : "与 Sergio 安排 30 分钟的课程。无需承诺。"}
            </DialogDescription>
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
                required
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
              {isSubmitting ? "Submitting..." : language === "en" ? "Book Trial" : "预约试课"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-center gap-6 mb-4 text-sm">
            <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a href="/terms-of-service" className="text-blue-600 hover:text-blue-800 underline">
              Terms of Service
            </a>
            <span className="text-gray-400">|</span>
            <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              Contact
            </a>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>© 2026 SoundReady English-IELTSTutor.com All rights reserved. Reproduction without permission is prohibited.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
