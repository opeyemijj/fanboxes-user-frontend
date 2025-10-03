"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/_main/Header";
import Footer from "@/components/_main/Footer";
import { ChevronDown, ChevronUp, Loader, AlertCircle } from "lucide-react";

export default function PrivacyPolicy() {
  const [openSections, setOpenSections] = useState({});
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrivacyPolicyData();
  }, []);

  const fetchPrivacyPolicyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/privacy-policy`
      );
      const result = await response.json();

      if (result.success) {
        setPrivacyData(result.data);
      } else {
        setError(result.message || "Failed to load privacy policy");
      }
    } catch (err) {
      console.error("Error fetching privacy policy:", err);
      setError("Failed to load privacy policy. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-[#11F2EB] mx-auto mb-4" />
            <p className="text-gray-600">Loading privacy policy...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Unable to Load
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchPrivacyPolicyData}
              className="bg-[#0DD4C7] hover:bg-[#11F2EB] text-white font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { sections = [], settings = {} } = privacyData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated:{" "}
              {new Date(settings.lastUpdated || Date.now()).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to {settings.companyName || "FanBoxes"}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At {settings.companyName || "FanBoxes"}, we are committed to
              protecting your privacy and ensuring the security of your personal
              information. This Privacy Policy explains how we collect, use, and
              safeguard your data when you use our platform, including our
              unique spin-to-win feature, direct purchases, and credit system.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our services, you agree to the collection and use of
              information in accordance with this policy. We encourage you to
              read this policy carefully to understand our practices regarding
              your personal data.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-12 text-white">
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 mb-2">
                  For privacy-related inquiries or to exercise your rights:
                </p>
                <p className="font-medium">
                  Email:{" "}
                  <a
                    href={`mailto:${
                      settings.contactEmail || "privacy@fanboxes.com"
                    }`}
                    className="text-[#11F2EB] hover:text-[#0ED9D3] transition-colors"
                  >
                    {settings.contactEmail || "privacy@fanboxes.com"}
                  </a>
                </p>
              </div>
              <div>
                <p className="text-slate-300 mb-2">
                  For general customer support:
                </p>
                <p className="font-medium">
                  Email:{" "}
                  <a
                    href={`mailto:${
                      settings.supportEmail || "support@fanboxes.com"
                    }`}
                    className="text-[#11F2EB] hover:text-[#0ED9D3] transition-colors"
                  >
                    {settings.supportEmail || "support@fanboxes.com"}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div
                key={section.sectionId}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.sectionId)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {section.title}
                  </h3>
                  {openSections[section.sectionId] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {openSections[section.sectionId] && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Last updated:{" "}
                        {new Date(section.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Links */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Additional Resources
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/terms"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/shipping"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors"
                >
                  Shipping Policy
                </Link>
                <Link
                  href="/returns"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors"
                >
                  Returns Policy
                </Link>
                <Link
                  href="/contact"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
