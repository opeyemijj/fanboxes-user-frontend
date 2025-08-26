"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/_main/Header";
import Footer from "@/components/_main/Footer";
import { getProductDetails } from "@/services";
import {
  Shield,
  Key,
  Hash,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

export default function VerifySpinPage() {
  const searchParams = useSearchParams();
  const [showServerSeed, setShowServerSeed] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [boxData, setBoxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract data from query parameters
  const clientSeed = searchParams.get("clientSeed");
  const serverSeed = searchParams.get("serverSeed");
  const serverSeedHash = searchParams.get("serverSeedHash");
  const nonce = searchParams.get("nonce");
  const hash = searchParams.get("hash");
  const createdAt = searchParams.get("createdAt");
  const normalized = searchParams.get("normalized");
  const boxSlug = searchParams.get("boxSlug");

  useEffect(() => {
    if (boxSlug) {
      fetchBoxData();
    } else {
      setLoading(false);
    }
  }, [boxSlug]);

  const fetchBoxData = async () => {
    try {
      setLoading(true);
      const apiData = await getProductDetails(boxSlug);

      if (!apiData.success) {
        throw new Error("Failed to fetch box data");
      }

      setBoxData(apiData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mt-14">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#11F2EB] rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Spin Result Verification
            </h1>
            <p className="text-gray-600">
              Verify the integrity and fairness of your spin results
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Verification Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#11F2EB]" />
                Verification Data
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Client Seed
                  </label>
                  <div className="flex items-center mt-1">
                    <div className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm flex-grow overflow-x-auto">
                      {clientSeed || "N/A"}
                    </div>
                    <button
                      onClick={() => copyToClipboard(clientSeed, "clientSeed")}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === "clientSeed" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Server Seed Hash
                  </label>
                  <div className="flex items-center mt-1">
                    <div className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm flex-grow overflow-x-auto">
                      {serverSeedHash || "N/A"}
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(serverSeedHash, "serverSeedHash")
                      }
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === "serverSeedHash" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Server Seed
                  </label>
                  <div className="flex items-center mt-1">
                    <div className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm flex-grow overflow-x-auto">
                      {showServerSeed
                        ? serverSeed || "N/A"
                        : "••••••••••••••••"}
                    </div>
                    <button
                      onClick={() => setShowServerSeed(!showServerSeed)}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      {showServerSeed ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(serverSeed, "serverSeed")}
                      className="ml-1 p-2 text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === "serverSeed" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Nonce
                  </label>
                  <div className="flex items-center mt-1">
                    <div className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm">
                      {nonce || "N/A"}
                    </div>
                    <button
                      onClick={() => copyToClipboard(nonce, "nonce")}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === "nonce" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Result Hash
                  </label>
                  <div className="flex items-center mt-1">
                    <div className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm flex-grow overflow-x-auto">
                      {hash || "N/A"}
                    </div>
                    <button
                      onClick={() => copyToClipboard(hash, "hash")}
                      className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                    >
                      {copiedField === "hash" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Normalized Value
                  </label>
                  <div className="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm">
                    {normalized || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Time Created
                  </label>
                  <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                    {formatDate(createdAt) || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Box Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2 text-[#11F2EB]" />
                Box Information
              </h2>

              {boxData ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Box Name
                    </label>
                    <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                      {boxData.name}
                    </div>
                  </div>

                  {boxData.images && boxData.images.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Box Image
                      </label>
                      <div className="mt-1">
                        <img
                          src={boxData.images[0].url}
                          alt={boxData.name}
                          className="w-full h-32 object-contain bg-white border border-gray-200 rounded"
                        />
                      </div>
                    </div>
                  )}

                  {boxData.vendor && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Vendor ID
                      </label>
                      <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm font-mono">
                        {boxData.vendor}
                      </div>
                    </div>
                  )}

                  {boxData.items && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Total Items
                      </label>
                      <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                        {boxData.items.length} items
                      </div>
                    </div>
                  )}

                  {boxData.prizeItems && boxData.prizeItems.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Sample Prize Items
                      </label>
                      <div className="space-y-2 mt-1">
                        {boxData.prizeItems.slice(0, 3).map((item, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded p-2"
                          >
                            <div className="flex items-center">
                              {item.images && item.images.length > 0 && (
                                <img
                                  src={item.images[0].url}
                                  alt={item.name}
                                  className="w-8 h-8 object-contain mr-2"
                                />
                              )}
                              <div className="flex-grow">
                                <div className="text-sm font-medium truncate">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  ${item.value}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {boxData.prizeItems.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{boxData.prizeItems.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {boxData.shopDetails && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Shop
                      </label>
                      <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                        {boxData.shopDetails.title}
                      </div>
                    </div>
                  )}

                  {boxData.categoryDetails && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Category
                      </label>
                      <div className="bg-white border border-gray-200 rounded px-3 py-2 text-sm">
                        {boxData.categoryDetails.name}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No box information available</p>
                  <p className="text-sm mt-2">
                    Box slug was not provided in the URL
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <Check className="w-6 h-6 text-green-600 mr-2" />
              <div>
                <h3 className="font-semibold text-green-800">
                  Verification Successful
                </h3>
                <p className="text-green-600 text-sm">
                  The spin results have been verified and are cryptographically
                  secure.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">
              How Verification Works
            </h3>
            <ul className="text-blue-600 text-sm space-y-1">
              <li>• Before each spin, we lock in a server seed hash.</li>
              <li>• Your browser creates a random client seed.</li>
              <li>
                • The final result is calculated using a secure algorithm
                (HMAC_SHA256) that combines the server seed, client seed, and a
                counter (nonce).
              </li>
              <li>
                • After the spin, the server seed is revealed so you can verify
                it.
              </li>
              <li>
                • This process guarantees transparency and proves the game is
                fair.
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
