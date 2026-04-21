import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function TermsOfService() {
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
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: "By accessing and using the SoundReady English Academy website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      id: "use-license",
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials (information or software) on SoundReady English Academy's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n• Modify or copy the materials\n• Use the materials for any commercial purpose or for any public display\n• Attempt to decompile or reverse engineer any software contained on the website\n• Remove any copyright or other proprietary notations from the materials\n• Transfer the materials to another person or \"mirror\" the materials on any other server"
    },
    {
      id: "disclaimer",
      title: "3. Disclaimer",
      content: "The materials on SoundReady English Academy's website are provided on an 'as is' basis. SoundReady English Academy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
    },
    {
      id: "limitations",
      title: "4. Limitations",
      content: "In no event shall SoundReady English Academy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SoundReady English Academy's website, even if SoundReady English Academy or an authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
      id: "accuracy",
      title: "5. Accuracy of Materials",
      content: "The materials appearing on SoundReady English Academy's website could include technical, typographical, or photographic errors. SoundReady English Academy does not warrant that any of the materials on its website are accurate, complete, or current. SoundReady English Academy may make changes to the materials contained on its website at any time without notice."
    },
    {
      id: "materials-links",
      title: "6. Materials and Links",
      content: "SoundReady English Academy has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SoundReady English Academy of the site. Use of any such linked website is at the user's own risk."
    },
    {
      id: "modifications",
      title: "7. Modifications",
      content: "SoundReady English Academy may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service."
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      content: "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which SoundReady English Academy operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
    },
    {
      id: "tutoring-services",
      title: "9. Tutoring Services Terms",
      content: "By booking a trial lesson or tutoring session with SoundReady English Academy:\n• You acknowledge that tutoring is an educational service and results vary by individual\n• You agree to attend scheduled sessions on time or provide 24-hour notice of cancellation\n• Payment must be completed before the lesson begins\n• Lessons are conducted via Zoom and require a stable internet connection\n• You grant SoundReady English Academy permission to record lessons for your personal reference (with prior consent)\n• Refunds are available only for cancellations made 48 hours in advance"
    },
    {
      id: "intellectual-property",
      title: "10. Intellectual Property Rights",
      content: "All content on the SoundReady English Academy website, including text, graphics, logos, images, and software, is the property of SoundReady English Academy or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, transmit, or display any content without the prior written permission of SoundReady English Academy."
    },
    {
      id: "user-conduct",
      title: "11. User Conduct",
      content: "You agree not to use the website or services for any unlawful purpose or in any way that could damage, disable, or impair the website. Prohibited behavior includes:\n• Harassing or causing distress or inconvenience to any person\n• Obscene or offensive language\n• Disrupting the normal flow of dialogue within the website\n• Attempting to gain unauthorized access to the website or its systems"
    },
    {
      id: "contact",
      title: "12. Contact Information",
      content: "If you have any questions about these Terms of Service, please contact us at: support@soundreadyenglish.com or through the contact form on our website."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold" style={{ color: "#1F3A5F" }}>
              Terms of Service
            </h1>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            Last updated: April 3, 2026
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-8">
            These Terms of Service ("Terms") govern your access to and use of the SoundReady English Academy website and services. Please read these Terms carefully before using our website or booking any tutoring services.
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

          {/* Important Notice Box */}
          <div className="mt-12 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">Important Notice</h3>
            <p className="text-red-800 text-sm">
              By using SoundReady English Academy services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
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
