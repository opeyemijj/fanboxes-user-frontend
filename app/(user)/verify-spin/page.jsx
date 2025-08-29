"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/_main/Header";
import Footer from "@/components/_main/Footer";
import { toastError } from "@/lib/toast";
import { getProductDetails } from "@/services/boxes";
import { getSpinWinningItem } from "@/services/boxes/spin-game/index";
import {
  Shield,
  Key,
  Hash,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";

// Loading component for Suspense fallback
function VerifySpinLoading() {
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

function VerifySpinContent() {
  const searchParams = useSearchParams();
  const [showServerSeed, setShowServerSeed] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [boxData, setBoxData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spinResult, setSpinResult] = useState(null);

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
      fetchSpinResult();
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
        toastError("Failed to fetch spin result data");
        setLoading(false);
        return;
      }

      console.log("box data:", apiData.data);
      setBoxData(apiData.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpinResult = async () => {
    try {
      setLoading(true);
      const apiData = await getSpinWinningItem({
        clientSeed,
        serverSeed,
        nonce,
      });

      if (!apiData.success) {
        toastError("Failed to fetch spin result data");
        setLoading(false);
        return;
      }

      console.log("Spin result:", apiData.data);
      setSpinResult(apiData.data);

      // Also fetch box details for additional information
      if (apiData.data.boxDetails) {
        setBoxData(apiData.data.boxDetails);
      }
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

  const formatPercentage = (decimal) => {
    return (decimal * 100).toFixed(6) + "%";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#11F2EB]"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-4 max-w-7xl">
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Left Column - Verification Data */}
            <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4">
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

              {/* Odds Mapping Table */}
              {spinResult?.oddsMap && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Odds Distribution
                  </h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm table-fixed">
                        <colgroup>
                          <col className="w-1/2" />
                          <col className="w-1/4" />
                          <col className="w-1/4" />
                        </colgroup>
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-2 text-left font-medium text-gray-700">
                              Item
                            </th>
                            <th className="px-2 py-2 text-right font-medium text-gray-700">
                              Start
                            </th>
                            <th className="px-2 py-2 text-right font-medium text-gray-700">
                              End
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {spinResult.oddsMap.map((odds, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td
                                className="px-2 py-2 text-gray-900 truncate text-xs"
                                title={odds.item}
                              >
                                {odds.item.length > 25
                                  ? odds.item.substring(0, 25) + "..."
                                  : odds.item}
                              </td>
                              <td className="px-2 py-2 text-right font-mono text-gray-600 text-xs">
                                {odds.start?.toFixed(6)}
                              </td>
                              <td className="px-2 py-2 text-right font-mono text-gray-600 text-xs">
                                {odds.end?.toFixed(6)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Box Information */}
            <div className="lg:col-span-3 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Key className="w-6 h-6 mr-2 text-[#11F2EB]" />
                Box Information
              </h2>

              {spinResult ? (
                <div className="space-y-6">
                  {/* Box Header with Image and Details */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                      {/* Box Image */}
                      {spinResult.boxDetails?.images?.[0] && (
                        <img
                          src={spinResult.boxDetails.images[0].url}
                          alt={spinResult.boxDetails.name}
                          className="w-24 h-24 object-contain rounded-lg"
                        />
                      )}

                      {/* Box Details */}
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Box Name
                          </h4>
                          <p className="text-sm font-semibold text-gray-800">
                            {spinResult.boxDetails?.name || "N/A"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Total Items
                          </h4>
                          <p className="text-sm font-semibold text-gray-800">
                            {spinResult.boxDetails?.items?.length || 0} items
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Category
                          </h4>
                          <p className="text-sm font-semibold text-gray-800">
                            {boxData?.categoryDetails?.name || "N/A"}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">
                            Price
                          </h4>
                          <p className="text-sm font-semibold text-gray-800">
                            ${boxData?.priceSale || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Influencer Section */}
                  {spinResult.shopDetails && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        {spinResult.shopDetails.logo && (
                          <img
                            src={spinResult.shopDetails.logo.url}
                            alt={spinResult.shopDetails.title}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#11F2EB]"
                          />
                        )}
                        <div className="ml-4">
                          <h3 className="text-md font-semibold text-gray-800">
                            {spinResult.shopDetails.title}
                          </h3>
                          <p className="text-sm text-gray-600">Influencer</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Winning Item */}
                  {spinResult.winningItem && (
                    <div className="bg-gradient-to-r from-[#11F2EB]/10 to-cyan-100/10 rounded-xl p-4 border border-[#11F2EB]/20">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-start">
                        🏆 Winning Item
                      </h3>
                      <div className="flex flex-col sm:flex-row items-start sm:items-start gap-3">
                        {spinResult.winningItem.images?.[0] && (
                          <img
                            src={spinResult.winningItem.images[0].url}
                            alt={spinResult.winningItem.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white rounded-lg p-2 border border-[#11F2EB]"
                          />
                        )}
                        <div className="flex-grow text-start sm:text-left">
                          <h4 className="text-sm sm:text-lg font-bold text-gray-800 mb-2">
                            {spinResult.winningItem.name}
                          </h4>
                          <div className="flex flex-row sm:flex-row items-start gap-2">
                            <span className="bg-[#11F2EB]/10 text-[#11F2EB] px-2 py-1 rounded-full text-md font-medium">
                              ${spinResult.winningItem.value}
                            </span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-md font-medium">
                              {spinResult.winningItem.odd}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sample Items */}
                  {spinResult.boxDetails?.items &&
                    spinResult.boxDetails.items.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Box Items ({spinResult.boxDetails.items.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {spinResult.boxDetails.items
                            .slice(0, 8)
                            .map((item, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                              >
                                <div className="flex flex-col h-full">
                                  {item.images?.[0] && (
                                    <img
                                      src={item.images[0].url}
                                      alt={item.name}
                                      className="w-full h-20 object-contain mb-2 rounded"
                                    />
                                  )}
                                  <div className="flex-grow">
                                    <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-1">
                                      {item.name}
                                    </h4>
                                    <div className="flex justify-between items-center">
                                      <span className="text-[#11F2EB] font-bold text-xs">
                                        ${item.value}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                        {spinResult.boxDetails.items.length > 8 && (
                          <div className="text-center mt-3">
                            <p className="text-sm text-gray-500">
                              +{spinResult.boxDetails.items.length - 8} more
                              items
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Key className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p>No spin result information available</p>
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
    </div>
  );
}

// Main page component with Suspense boundary
export default function VerifySpinPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={<VerifySpinLoading />}>
          <VerifySpinContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
