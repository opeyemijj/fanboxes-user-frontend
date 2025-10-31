"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader, AlertCircle } from "lucide-react"

export default function PrivacyPolicyClient() {
  const [policyData, setPolicyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPolicyData()
  }, [])

  const fetchPolicyData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/static-pages/our_policy_nr9mf7`)
      const result = await response.json()

      if (result.success) {
        setPolicyData(result.data)
      } else {
        setError(result.message || "Failed to load policy")
      }
    } catch (err) {
      console.error("Error fetching policy:", err)
      setError("Failed to load policy. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const HtmlContent = ({ content, className = "" }) => {
    return <div className={`policy-content ${className}`} dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* <Header /> */}
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-[#11F2EB] mx-auto mb-4" />
            <p className="text-gray-600">Loading policy...</p>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        {/* <Header /> */}
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchPolicyData}
              className="bg-[#0DD4C7] hover:bg-[#11F2EB] text-white font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* <Header /> */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: "Fanboxes privacy policy and data protection information",
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/privacy-policy`,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Privacy Policy",
                  item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fanboxes.com"}/privacy-policy`,
                },
              ],
            },
          }),
        }}
      />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{policyData?.title || "Privacy Policy"}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Last updated:{" "}
              {policyData?.updatedAt
                ? new Date(policyData.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Main Policy Content */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100">
            {policyData?.htmlContent ? (
              <HtmlContent content={policyData.htmlContent} />
            ) : (
              <div className="text-center text-gray-500 py-8">No policy content available.</div>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 mb-12 text-white">
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-slate-300 mb-2">For policy-related inquiries:</p>
                <p className="font-medium">
                  Email:{" "}
                  <a
                    href="mailto:privacy@fanboxes.com"
                    className="text-[#11F2EB] hover:text-[#0ED9D3] transition-colors"
                  >
                    privacy@fanboxes.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-slate-300 mb-2">For general customer support:</p>
                <p className="font-medium">
                  Email:{" "}
                  <a
                    href="mailto:support@fanboxes.com"
                    className="text-[#11F2EB] hover:text-[#0ED9D3] transition-colors"
                  >
                    support@fanboxes.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h3>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/terms-and-conditions"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors flex items-center group"
                >
                  <span className="w-2 h-2 bg-[#0DD4C7] rounded-full mr-2 group-hover:bg-[#11F2EB] transition-colors"></span>
                  Terms of Service
                </Link>
                <Link
                  href="/faqs"
                  className="text-[#0DD4C7] hover:text-[#11F2EB] font-medium transition-colors flex items-center group"
                >
                  <span className="w-2 h-2 bg-[#0DD4C7] rounded-full mr-2 group-hover:bg-[#11F2EB] transition-colors"></span>
                  FAQs
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

      {/* Comprehensive CSS for ALL possible HTML elements from text editors */}
      <style jsx global>{`
        .policy-content {
          color: #374151;
          line-height: 1.75;
          font-size: 1.125rem;
        }

        /* ===== TYPOGRAPHY ===== */
        .policy-content h1,
        .policy-content h2,
        .policy-content h3,
        .policy-content h4,
        .policy-content h5,
        .policy-content h6 {
          color: #111827;
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .policy-content h1 {
          font-size: 2rem;
          border-bottom: 2px solid #0dd4c7;
          padding-bottom: 0.5rem;
          margin-top: 0;
        }

        .policy-content h2 {
          font-size: 1.75rem;
          color: #1f2937;
          padding-left: 1rem;
          border-left: 4px solid #11f2eb;
        }

        .policy-content h3 {
          font-size: 1.5rem;
          color: #374151;
        }

        .policy-content h4 {
          font-size: 1.25rem;
          color: #4b5563;
        }

        .policy-content h5 {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .policy-content h6 {
          font-size: 1rem;
          color: #6b7280;
          font-style: italic;
        }

        /* Paragraphs and text formatting */
        .policy-content p {
          margin-bottom: 1.5rem;
          line-height: 1.75;
        }

        .policy-content strong {
          font-weight: 700;
          color: #111827;
        }

        .policy-content em {
          font-style: italic;
          color: #6b7280;
        }

        .policy-content u {
          text-decoration: underline;
          text-decoration-color: #0dd4c7;
        }

        .policy-content s,
        .policy-content strike {
          text-decoration: line-through;
          color: #6b7280;
        }

        .policy-content mark {
          background-color: #fef3c7;
          color: #92400e;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }

        .policy-content small {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .policy-content sub,
        .policy-content sup {
          font-size: 0.75rem;
          line-height: 0;
        }

        /* ===== LISTS ===== */
        .policy-content ul,
        .policy-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }

        .policy-content ul {
          list-style-type: disc;
        }

        .policy-content ol {
          list-style-type: decimal;
        }

        .policy-content li {
          margin-bottom: 0.75rem;
          line-height: 1.75;
          padding-left: 0.5rem;
        }

        .policy-content ul li::marker {
          color: #0dd4c7;
        }

        .policy-content ol li::marker {
          color: #0dd4c7;
          font-weight: 600;
        }

        /* Nested lists - multiple levels */
        .policy-content ul ul,
        .policy-content ol ul {
          list-style-type: circle;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .policy-content ul ul ul,
        .policy-content ol ul ul {
          list-style-type: square;
        }

        .policy-content ul ul ul ul,
        .policy-content ol ul ul ul {
          list-style-type: disc;
        }

        .policy-content ol ol,
        .policy-content ul ol {
          list-style-type: lower-alpha;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .policy-content ol ol ol,
        .policy-content ul ol ol {
          list-style-type: lower-roman;
        }

        /* Definition lists */
        .policy-content dl {
          margin-bottom: 1.5rem;
        }

        .policy-content dt {
          font-weight: 700;
          color: #111827;
          margin-top: 1rem;
        }

        .policy-content dd {
          margin-left: 1.5rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        /* ===== LINKS ===== */
        .policy-content a {
          color: #0dd4c7;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-bottom: 1px solid transparent;
        }

        .policy-content a:hover {
          color: #11f2eb;
          border-bottom-color: #11f2eb;
        }

        /* ===== BLOCKQUOTES & PULL QUOTES ===== */
        .policy-content blockquote {
          border-left: 4px solid #0dd4c7;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .policy-content blockquote p:last-child {
          margin-bottom: 0;
        }

        /* ===== CODE & PRE ===== */
        .policy-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: "Courier New", Monaco, monospace;
          font-size: 0.875rem;
          color: #dc2626;
          border: 1px solid #e5e7eb;
        }

        .policy-content pre {
          background-color: #1f2937;
          color: #e5e7eb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: "Courier New", Monaco, monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          border: 1px solid #374151;
        }

        .policy-content pre code {
          background: none;
          color: inherit;
          padding: 0;
          border: none;
          font-size: inherit;
        }

        /* ===== TABLES ===== */
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          background: white;
        }

        .policy-content th,
        .policy-content td {
          padding: 1rem;
          text-align: left;
          border: 1px solid #e5e7eb;
        }

        .policy-content th {
          background: linear-gradient(135deg, #0dd4c7, #11f2eb);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
        }

        .policy-content tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .policy-content tr:hover {
          background-color: #f3f4f6;
        }

        .policy-content caption {
          caption-side: bottom;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.5rem;
          font-style: italic;
        }

        /* ===== MEDIA & EMBEDS ===== */
        .policy-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .policy-content figure {
          margin: 2rem 0;
          text-align: center;
        }

        .policy-content figcaption {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.5rem;
          font-style: italic;
        }

        .policy-content iframe,
        .policy-content video,
        .policy-content audio {
          max-width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        /* ===== HORIZONTAL RULES ===== */
        .policy-content hr {
          border: none;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            #0dd4c7,
            transparent
          );
          margin: 2.5rem 0;
        }

        /* ===== FORMS & INPUTS ===== */
        .policy-content input[type="text"],
        .policy-content input[type="email"],
        .policy-content input[type="password"],
        .policy-content textarea,
        .policy-content select {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
          margin: 0.25rem 0;
        }

        .policy-content button {
          background-color: #0dd4c7;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }

        .policy-content button:hover {
          background-color: #11f2eb;
        }

        /* ===== SPECIAL ELEMENTS ===== */
        .policy-content details {
          margin: 1rem 0;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .policy-content summary {
          padding: 1rem;
          background-color: #f9fafb;
          cursor: pointer;
          font-weight: 600;
          color: #374151;
        }

        .policy-content details[open] summary {
          border-bottom: 1px solid #e5e7eb;
        }

        .policy-content details > div {
          padding: 1rem;
        }

        .policy-content kbd {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          padding: 0.125rem 0.375rem;
          font-size: 0.875rem;
          font-family: inherit;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .policy-content abbr[title] {
          border-bottom: 1px dotted #6b7280;
          cursor: help;
          text-decoration: none;
        }

        .policy-content address {
          font-style: italic;
          color: #6b7280;
          margin: 1rem 0;
        }

        /* ===== ALIGNMENT & FLOATS ===== */
        .policy-content .align-left {
          float: left;
          margin-right: 1.5rem;
          margin-bottom: 1rem;
        }

        .policy-content .align-right {
          float: right;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .policy-content .align-center {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .policy-content .text-left {
          text-align: left;
        }
        .policy-content .text-center {
          text-align: center;
        }
        .policy-content .text-right {
          text-align: right;
        }
        .policy-content .text-justify {
          text-align: justify;
        }

        /* ===== RESPONSIVE DESIGN ===== */
        @media (max-width: 768px) {
          .policy-content {
            font-size: 1rem;
          }

          .policy-content h1 {
            font-size: 1.75rem;
          }

          .policy-content h2 {
            font-size: 1.5rem;
            padding-left: 0.75rem;
          }

          .policy-content h3 {
            font-size: 1.25rem;
          }

          .policy-content ul,
          .policy-content ol {
            padding-left: 1.5rem;
          }

          .policy-content table {
            font-size: 0.875rem;
          }

          .policy-content th,
          .policy-content td {
            padding: 0.75rem 0.5rem;
          }

          .policy-content .align-left,
          .policy-content .align-right {
            float: none;
            margin: 1rem 0;
          }
        }

        /* ===== PRINT STYLES ===== */
        @media print {
          .policy-content {
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
          }

          .policy-content a {
            color: #000;
            text-decoration: underline;
          }

          .policy-content h1,
          .policy-content h2,
          .policy-content h3 {
            color: #000;
            page-break-after: avoid;
          }

          .policy-content table {
            page-break-inside: avoid;
          }

          .policy-content img {
            max-width: 100% !important;
            height: auto !important;
          }
        }
      `}</style>

      {/* <Footer /> */}
    </div>
  )
}
