"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
// import Header from "@/components/_main/Header";
// import Footer from "@/components/_main/Footer";
import {
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  Search,
} from "lucide-react";

export default function FAQs() {
  const [openQuestions, setOpenQuestions] = useState({});
  const [faqData, setFaqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    fetchFaqData();
  }, []);

  useEffect(() => {
    if (allQuestions.length > 0) {
      filterQuestions();
    }
  }, [searchTerm, allQuestions]);

  // Strip HTML tags for search - defined as a function
  const stripHtml = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const fetchFaqData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/static-pages/frequently_asked_questions_faq_29ya66`
      );
      const result = await response.json();

      if (result.success) {
        setFaqData(result.data);
        const questions = parseFAQsFromData(result.data);
        setAllQuestions(questions);

        // Auto-open first question
        if (questions.length > 0) {
          setOpenQuestions({ [questions[0].id]: true });
        }
      } else {
        setError(result.message || "Failed to load FAQs");
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Parse FAQs from any data structure
  const parseFAQsFromData = (data) => {
    // If data already has structured FAQs array
    if (data?.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
      return data.faqs.map((faq, index) => ({
        id: faq.id || `faq-${index}`,
        question: faq.question || "",
        answer: faq.answer || "",
        rawText: `${faq.question || ""} ${stripHtml(
          faq.answer || ""
        )}`.toLowerCase(),
      }));
    }

    // If HTML content needs parsing
    if (data?.htmlContent) {
      return parseHtmlIntoFAQs(data.htmlContent);
    }

    return [];
  };

  // Parse HTML content into FAQs
  const parseHtmlIntoFAQs = (htmlContent) => {
    if (!htmlContent) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const faqs = [];

      let currentQuestion = null;
      let currentAnswer = "";

      // Function to add FAQ if we have both question and answer
      const addFAQ = (question, answer, index) => {
        if (question && answer.trim()) {
          const cleanAnswer = answer.trim();
          faqs.push({
            id: `faq-${index}`,
            question: question.trim(),
            answer: cleanAnswer,
            rawText: `${question.trim()} ${stripHtml(
              cleanAnswer
            )}`.toLowerCase(),
          });
        }
      };

      // Strategy 1: Look for heading patterns
      const elements = doc.body.children;
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const tagName = element.tagName.toLowerCase();

        // If it's a heading or strong element, it might be a question
        if (
          ["h1", "h2", "h3", "h4", "h5", "h6", "strong", "b"].includes(tagName)
        ) {
          const text = element.textContent.trim();
          if (text && text.length > 0 && !text.match(/^\s*$/)) {
            // If we have a previous question, save it
            if (currentQuestion) {
              addFAQ(currentQuestion, currentAnswer, faqs.length);
            }
            // Start new question
            currentQuestion = text;
            currentAnswer = "";
          }
        } else if (currentQuestion) {
          // This is likely answer content
          currentAnswer += element.outerHTML;
        }
      }

      // Don't forget the last FAQ
      if (currentQuestion) {
        addFAQ(currentQuestion, currentAnswer, faqs.length);
      }

      // Strategy 2: If no FAQs found with headings, try paragraph patterns
      if (faqs.length === 0) {
        const paragraphs = doc.querySelectorAll("p");
        paragraphs.forEach((p, index) => {
          const text = p.textContent.trim();
          if (text && text.length > 50) {
            // Likely an answer
            const prevElement = p.previousElementSibling;
            if (
              prevElement &&
              ["strong", "b", "h1", "h2", "h3", "h4", "h5", "h6"].includes(
                prevElement.tagName.toLowerCase()
              )
            ) {
              const question = prevElement.textContent.trim();
              addFAQ(question, p.outerHTML, index);
            }
          }
        });
      }

      // Strategy 3: Final fallback - treat the whole content as one FAQ
      if (faqs.length === 0) {
        const cleanContent = stripHtml(htmlContent);
        if (cleanContent) {
          faqs.push({
            id: "general-info",
            question: "General Information",
            answer: htmlContent,
            rawText: `general information ${cleanContent}`.toLowerCase(),
          });
        }
      }

      return faqs;
    } catch (err) {
      console.error("Error parsing HTML into FAQs:", err);
      // Ultimate fallback
      return [
        {
          id: "fallback",
          question: "FAQ Content",
          answer: htmlContent,
          rawText: `faq content ${stripHtml(htmlContent)}`.toLowerCase(),
        },
      ];
    }
  };

  const filterQuestions = () => {
    if (!searchTerm.trim()) {
      setFilteredQuestions(allQuestions);
      return;
    }

    const searchTerms = searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);

    const filtered = allQuestions.filter((faq) => {
      const searchableText =
        faq.rawText || `${faq.question} ${stripHtml(faq.answer)}`.toLowerCase();

      // Check if all search terms are found
      return searchTerms.every((term) => searchableText.includes(term));
    });

    setFilteredQuestions(filtered);
  };

  const toggleQuestion = (questionId) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const HtmlContent = ({ content, className = "" }) => {
    return (
      <div
        className={`faq-answer-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* <Header /> */}
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-[#11F2EB] mx-auto mb-4" />
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        </main>
        {/* <Footer /> */}
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
              onClick={fetchFaqData}
              className="bg-[#0DD4C7] hover:bg-[#11F2EB] text-white font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }

  const displayFaqs = searchTerm ? filteredQuestions : allQuestions;
  const hasQuestions = displayFaqs.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* <Header /> */}

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {faqData?.title || "Frequently Asked Questions"}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about FanBoxes
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Search Bar - Always show if we have questions */}
          {hasQuestions && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
              <div className="relative max-w-2xl mx-auto">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search FAQs... (try 'shipping', 'returns', 'payment', etc.)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="text-center text-gray-600 mt-4">
                  Found {filteredQuestions.length} result
                  {filteredQuestions.length !== 1 ? "s" : ""} for "{searchTerm}"
                </p>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-4 mb-8">
            {hasQuestions ? (
              /* Accordion Style */
              displayFaqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-8 flex items-start">
                      <span className="bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] w-2 h-6 rounded-full mr-4 mt-1 flex-shrink-0"></span>
                      {faq.question}
                    </h3>
                    {openQuestions[faq.id] ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 group-hover:text-[#0DD4C7] transition-colors" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 group-hover:text-[#0DD4C7] transition-colors" />
                    )}
                  </button>

                  {openQuestions[faq.id] && (
                    <div className="px-6 pb-5 animate-in fade-in duration-200">
                      <div className="border-t border-gray-100 pt-4">
                        <div className="text-gray-700 leading-relaxed">
                          <HtmlContent content={faq.answer} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : searchTerm ? (
              /* No search results */
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any FAQs matching "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors"
                >
                  Clear search and show all FAQs
                </button>
              </div>
            ) : (
              /* No FAQs available */
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No FAQs Available
                </h3>
                <p className="text-gray-600 mb-4">
                  We're currently updating our frequently asked questions.
                </p>
                <p className="text-sm text-gray-500">
                  Please check back later or contact our support team for
                  assistance.
                </p>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-12 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here
              to help you get the information you need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-[#11F2EB] hover:bg-[#0DD4C7] text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@fanboxes.com"
                className="border border-[#11F2EB] text-[#11F2EB] hover:bg-[#11F2EB] hover:text-slate-900 font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>

          {/* Additional Links */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Additional Resources
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/privacy-policy"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors flex items-center group"
                >
                  <span className="w-2 h-2 bg-[#0DD4C7] rounded-full mr-2 group-hover:bg-[#11F2EB] transition-colors"></span>
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-and-conditions"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors flex items-center group"
                >
                  <span className="w-2 h-2 bg-[#0DD4C7] rounded-full mr-2 group-hover:bg-[#11F2EB] transition-colors"></span>
                  Terms & Conditions
                </Link>
                <Link
                  href="/contact"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors flex items-center group"
                >
                  <span className="w-2 h-2 bg-[#0DD4C7] rounded-full mr-2 group-hover:bg-[#11F2EB] transition-colors"></span>
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ-specific CSS */}
      <style jsx global>{`
        .faq-answer-content {
          color: #374151;
          line-height: 1.75;
          font-size: 1.125rem;
        }

        .faq-answer-content h1,
        .faq-answer-content h2,
        .faq-answer-content h3,
        .faq-answer-content h4,
        .faq-answer-content h5,
        .faq-answer-content h6 {
          color: #111827;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .faq-answer-content h1 {
          font-size: 1.5rem;
        }
        .faq-answer-content h2 {
          font-size: 1.375rem;
        }
        .faq-answer-content h3 {
          font-size: 1.25rem;
        }
        .faq-answer-content h4 {
          font-size: 1.125rem;
        }
        .faq-answer-content h5 {
          font-size: 1rem;
        }
        .faq-answer-content h6 {
          font-size: 0.875rem;
        }

        .faq-answer-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }

        .faq-answer-content strong {
          font-weight: 700;
          color: #111827;
        }

        .faq-answer-content em {
          font-style: italic;
          color: #6b7280;
        }

        .faq-answer-content ul,
        .faq-answer-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .faq-answer-content ul {
          list-style-type: disc;
        }
        .faq-answer-content ol {
          list-style-type: decimal;
        }

        .faq-answer-content li {
          margin-bottom: 0.5rem;
          line-height: 1.75;
        }

        .faq-answer-content ul li::marker {
          color: #0dd4c7;
        }

        .faq-answer-content ol li::marker {
          color: #0dd4c7;
          font-weight: 600;
        }

        .faq-answer-content a {
          color: #0dd4c7;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-bottom: 1px solid transparent;
        }

        .faq-answer-content a:hover {
          color: #11f2eb;
          border-bottom-color: #11f2eb;
        }

        .faq-answer-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: "Courier New", Monaco, monospace;
          font-size: 0.875rem;
          color: #dc2626;
          border: 1px solid #e5e7eb;
        }

        .faq-answer-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          background: white;
        }

        .faq-answer-content th,
        .faq-answer-content td {
          padding: 0.75rem;
          text-align: left;
          border: 1px solid #e5e7eb;
        }

        .faq-answer-content th {
          background-color: #0dd4c7;
          color: white;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .faq-answer-content {
            font-size: 1rem;
          }

          .faq-answer-content h1 {
            font-size: 1.375rem;
          }
          .faq-answer-content h2 {
            font-size: 1.25rem;
          }
          .faq-answer-content h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>

      {/* <Footer /> */}
    </div>
  );
}
