import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function PrivacyPolicy() {
  const [, navigate] = useLocation();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: "SoundReady English Academy (\"we\", \"us\", \"our\", or \"Company\") operates the SoundReady English Academy website and the Your tutor service. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data."
    },
    {
      id: "data-collection",
      title: "2. Information Collection and Use",
      content: "We collect several different types of information for various purposes to provide and improve our Service to you.\n\nTypes of Data Collected:\n• Personal Data: Name, email address, phone number, WeChat ID, exam target, and any messages you provide when booking a trial lesson.\n• Usage Data: Information about how you access and use our website, including browser type, pages visited, and time spent on pages.\n• Cookies: We use cookies to enhance your experience on our website."
    },
    {
      id: "data-usage",
      title: "3. Use of Data",
      content: "SoundReady English Academy uses the collected data for various purposes:\n• To provide and maintain our Service\n• To notify you about changes to our Service\n• To allow you to participate in interactive features of our Service\n• To provide customer support\n• To gather analysis or valuable information so that we can improve our Service\n• To monitor the usage of our Service\n• To detect, prevent and address technical and security issues"
    },
    {
      id: "security",
      title: "4. Security of Data",
      content: "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security."
    },
    {
      id: "third-parties",
      title: "5. Third-Party Services",
      content: "Our Service may contain links to third-party websites and services that are not operated by us. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party service before providing your personal information or using the service."
    },
    {
      id: "children",
      title: "6. Children's Privacy",
      content: "Our Service does not address anyone under the age of 13 (\"Children\"). We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove such information and terminate the child's account."
    },
    {
      id: "changes",
      title: "7. Changes to This Privacy Policy",
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date at the top of this Privacy Policy."
    },
    {
      id: "contact",
      title: "8. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at: sergio@sound-ready.com or through the contact form on our website."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
            Privacy Policy
          </h1>
          <Button variant="outline" onClick={() => navigate("/")} className="text-sm">
            ← Back to Home
          </Button>
        </div>
        <p className="text-gray-600 text-sm mb-8">Last updated: April 3, 2026</p>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8">
            Your privacy is important to us. This Privacy Policy explains how SoundReady English Academy collects, uses, discloses, and safeguards your information when you visit our website and use our services.
          </p>

          {/* Accordion Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h2 className="text-lg font-semibold text-left" style={{ color: "#1F3A5F" }}>
                    {section.title}
                  </h2>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedSections[section.id] ? "rotate-180" : ""
                    }`}
                    style={{ color: "#F4A261" }}
                  />
                </button>

                {expandedSections[section.id] && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700 whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info Box */}
          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Your Rights</h3>
            <p className="text-blue-800 text-sm">
              You have the right to access, update, or delete your personal information at any time by contacting us. We will respond to your request within 30 days.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 SoundReady English-IELTSTutor.com All rights reserved. Reproduction without permission is prohibited.</p>
        </div>
      </footer>
    </div>
  );
}
