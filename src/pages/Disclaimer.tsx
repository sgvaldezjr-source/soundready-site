import { useLanguage } from "../contexts/LanguageContext";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-white py-16 px-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Disclaimer</h1>
      <p className="text-gray-700 mb-4">
        The information on this site is for informational purposes only.
      </p>
      <p className="text-gray-700 mb-4">
        IELTS is a registered trademark of the University of Cambridge, the British Council, and IDP Education Australia. This site and its owners are not affiliated with, approved by, or endorsed by the University of Cambridge ESOL, the British Council, or IDP Education Australia.
      </p>
      <p className="text-gray-700">
        For full information please refer to our{" "}
        <a href="/terms-of-service" className="text-blue-600 underline">Terms of Service</a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
