"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getMySpinHistory } from "@/services/boxes/spin-game";
import { useRouter } from "next/navigation";
import { toastError } from "@/lib/toast";
import {
  Calendar,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Box,
  Clock,
  Hash,
  ExternalLink,
  CheckCircle,
  Zap,
  TrendingUp,
  DollarSign,
} from "lucide-react";

// Pagination Component
const SpinPagination = ({ page, limit, loading, pagination, onPageChange }) => {
  if (!pagination) return <></>;

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: summary */}
      <div className="text-sm text-gray-700">
        Showing {(page - 1) * limit + 1} to{" "}
        {Math.min(page * limit, pagination.total)} of {pagination.total} spins
      </div>

      {/* Right: pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous */}
        <button
          disabled={page === 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                  page === pageNum
                    ? "bg-slate-900 text-[#0ED9D3] font-medium"
                    : "text-[#0ED9D3] bg-slate-600 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={loading}
              >
                {pageNum}
              </button>
            );
          })}

          {pagination.pages > 5 && page < pagination.pages - 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </div>

        {/* Next */}
        <button
          disabled={page === pagination.pages || loading}
          onClick={() => onPageChange(page + 1)}
          className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Details Modal Component
const SpinDetailsModal = ({
  isOpen,
  onClose,
  spin,
  formatDate,
  formatTime,
  formatAmount,
}) => {
  if (!isOpen || !spin) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Spin Details
              </h2>
              <p className="text-xs text-gray-500">
                {spin.boxDetails?.name || "Unknown Box"} •{" "}
                {formatDate(spin.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Main Spin Summary */}
            <div className="relative bg-gradient-to-br from-[#13192c] via-[#0C2539] to-[#13192c] rounded-2xl p-6 shadow-xl overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-15">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #11F2EB 1px, transparent 1.5px), radial-gradient(circle at 75% 75%, #11F2EB 1px, transparent 1.5px)`,
                    backgroundSize: "32px 32px",
                  }}
                ></div>
              </div>

              {/* Content */}
              <div className="relative text-center">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full shadow-lg inline-flex mb-4 ring-2 ring-[#11F2EB]/30">
                  <Trophy className="w-8 h-8 text-[#11F2EB]" />
                </div>
                <div className="text-3xl font-bold mb-2 text-white">
                  ${formatAmount(spin.boxDetails?.priceSale || 0)}
                </div>
                <p className="text-white font-semibold mb-3 text-base">
                  Spin Cost
                </p>
                <div className="flex justify-center items-center gap-4">
                  <span className="text-sm text-gray-600 bg-[#11F2EB] backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
                    {(spin.winningItem?.odd * 100).toFixed(4)}% win chance
                  </span>
                </div>
              </div>
            </div>

            {/* Resell Information Card */}
            {spin.processedForResell && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Item Resold
                    </h3>
                  </div>
                  {spin.resellTransactionRef && (
                    <a
                      href={`/account?tab=transactions&txn=${spin.resellTransactionRef}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
                    >
                      View Transaction
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="text-sm text-gray-700">
                  <p>This item has been successfully resold for credits.</p>
                  {spin.resellTransactionRef && (
                    <p className="mt-1 text-xs">
                      Transaction Ref:{" "}
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                        {spin.resellTransactionRef}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Winning Item Card */}
            {spin.winningItem && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Winning Item
                  </h3>
                </div>
                <div className="flex gap-4">
                  {spin.winningItem.images?.[0]?.url && (
                    <div className="flex-shrink-0">
                      <img
                        src={
                          spin.winningItem.images[0].url || "/placeholder.svg"
                        }
                        alt={spin.winningItem.name}
                        className="w-16 h-16 object-cover rounded-lg border border-amber-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {spin.winningItem.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Weight:</span>
                        <p className="font-medium">
                          {spin.winningItem.weight}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Odds:</span>
                        <p className="font-medium">
                          {(spin.winningItem.odd * 100).toFixed(4)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Box Details Card */}
            {spin.boxDetails && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Box className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Box Details
                  </h3>
                </div>
                <div className="flex gap-4">
                  {spin.boxDetails.images?.[0]?.url && (
                    <div className="flex-shrink-0">
                      <img
                        src={
                          spin.boxDetails.images[0].url || "/placeholder.svg"
                        }
                        alt={spin.boxDetails.name}
                        className="w-16 h-16 object-cover rounded-lg border border-blue-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {spin.boxDetails.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <p className="font-semibold text-slate-700">
                          ${formatAmount(spin.boxDetails.priceSale)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <p className="font-medium">
                          {spin.boxDetails.items?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Spin Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Spin Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Spin Info
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Spin Cost</span>
                      <span className="font-semibold text-slate-700">
                        ${formatAmount(spin.boxDetails?.priceSale || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Normalized Result</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                        {parseFloat(spin.normalized).toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Nonce</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs">
                        {spin.nonce}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Vendor Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {formatDate(spin.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">
                        {formatTime(spin.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Client Seed</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-xs truncate max-w-[120px]">
                        {spin.clientSeed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Details */}
            {/* <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  Spin Verification
                </h3>
                <a
                  href={`/verify-spin?clientSeed=${
                    spin.clientSeed
                  }&serverSeed=${spin.serverSeed}&serverSeedHash=${
                    spin.serverSeedHash
                  }&nonce=${spin.nonce}&createdAt=${encodeURIComponent(
                    spin.createdAt
                  )}&normalized=${spin.normalized}&boxSlug=${
                    spin.boxDetails?.slug || ""
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
                >
                  View Full Verification
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-600">Server Seed Hash:</span>
                  <p className="font-mono text-xs bg-white p-2 rounded mt-1 truncate">
                    {spin.serverSeedHash}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Final Hash:</span>
                  <p className="font-mono text-xs bg-white p-2 rounded mt-1 truncate">
                    {spin.hash}
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-[#11F2EB] to-[#0ED9D3] text-slate-800 font-semibold rounded-xl hover:from-[#0ED9D3] hover:to-[#0BC5BF] transition-all duration-200 shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loaders
const SpinPageSkeletonLoader = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        {/* <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div> */}

        {/* Stats Card Skeleton */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gray-400/30 rounded-lg mr-3"></div>
                  <div className="h-4 bg-gray-400/30 rounded w-24"></div>
                </div>
                <div className="h-8 bg-gray-400/30 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-400/30 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Section Skeleton */}
        <div className="bg-white rounded-xl p-4 mb-5">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="w-full lg:w-80 h-10 bg-gray-200 rounded"></div>
            <div className="flex-1 flex justify-end">
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* List Skeleton */}
        <div className="bg-white rounded-xl p-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center py-4 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SpinListSkeletonLoader = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="px-6 py-4 border-b border-gray-100 animate-pulse"
        >
          <div className="flex items-start">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Component
const SpinListing = () => {
  const router = useRouter();
  const [spinHistory, setSpinHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpin, setSelectedSpin] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [pendingDateRange, setPendingDateRange] = useState({
    from: null,
    to: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const spinsRef = useRef(null);

  const fetchSpinHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit, page };

      // Add date range filters if they exist
      if (dateRange.from) {
        params.fromDate = dateRange.from.toISOString();
      }
      if (dateRange.to) {
        params.toDate = dateRange.to.toISOString();
      }

      const response = await getMySpinHistory(params);

      if (!response.success) {
        throw new Error("Failed to fetch spin history");
      }

      setSpinHistory(response);
    } catch (err) {
      setError("Error fetching spin history");
      if (
        err?.response &&
        err.response.status === 401
        //  &&
        // err.response.statusText === "Unauthorized"
      ) {
        toastError(
          err.response?.data?.message ||
            "Session Expired. Please login to continue"
        );
        router.replace("/login");
      }
    } finally {
      setLoading(false);
      setLoadingHistory(false);
      setShouldRefetch(false);
    }
  }, [limit, page, dateRange]);

  useEffect(() => {
    fetchSpinHistory();
  }, [fetchSpinHistory]);

  useEffect(() => {
    if (shouldRefetch) {
      fetchSpinHistory();
    }
  }, [shouldRefetch, fetchSpinHistory]);

  useEffect(() => {
    setPendingDateRange(dateRange);
  }, [dateRange]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getSpinIcon = (spin) => {
    return (
      <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
        <Trophy className="w-5 h-5 text-purple-600" />
      </div>
    );
  };

  const getResellStatusBadge = (spin) => {
    if (spin.processedForResell) {
      return (
        <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Resold
        </span>
      );
    }
    return null;
  };

  const getStatusBadge = (spin) => {
    return (
      <>
        <span className="px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Won
        </span>
        {getResellStatusBadge(spin)}
      </>
    );
  };

  const handleSpinClick = (spin) => {
    setSelectedSpin(spin);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedSpin(null);
  };

  const handlePredefinedDateRange = (from, to) => {
    setDateRange({ from, to });
    setPendingDateRange({ from, to });
    setPage(1);
    setShouldRefetch(true);
    setShowDatePicker(false);
    setLoadingHistory(true);
  };

  const clearDateFilter = () => {
    setDateRange({ from: null, to: null });
    setPendingDateRange({ from: null, to: null });
    setPage(1);
    setShouldRefetch(true);
    setLoadingHistory(true);
  };

  const applyDateFilter = () => {
    setDateRange(pendingDateRange);
    setPage(1);
    setShouldRefetch(true);
    setShowDatePicker(false);
    setLoadingHistory(true);
  };

  // Predefined date ranges
  const predefinedDateRanges = [
    {
      label: "Last 7 days",
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    {
      label: "Last 30 days",
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    {
      label: "Last 90 days",
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    {
      label: "This month",
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  ];

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      if (spinsRef.current) {
        spinsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    if (spinsRef.current) {
      spinsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setLimit(Number(newLimit));
    setPage(1);
  };

  // Calculate statistics
  const totalSpins = spinHistory?.pagination?.total || 0;
  const resoldSpins =
    spinHistory?.data?.filter((spin) => spin.processedForResell).length || 0;
  const rarestWin = spinHistory?.data?.reduce((rarest, spin) => {
    if (!rarest || spin.winningItem?.odd < rarest.winningItem?.odd) {
      return spin;
    }
    return rarest;
  }, null);

  if (loading) {
    return <SpinPageSkeletonLoader />;
  }

  if (error) {
    return (
      <div className="bg-gray-50 text-black min-h-screen flex flex-col">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex-grow">
          <div className="flex items-center justify-center h-96">
            <div className="bg-white rounded-xl shadow-sm p-6 max-w-md w-full">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">
                    Error Loading Spin History
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 text-sm font-medium text-[#11F2EB] hover:text-[#0ED9D3] transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-black min-h-screen flex flex-col">
      <main className="container mx-auto pt-0 pb-16 flex-grow">
        {/* Header Section */}
        <div className="mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            View your spin history and achievements
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#11F2EB]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#11F2EB]/10 to-transparent rounded-full -translate-x-12 translate-y-12"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-[#11F2EB]/5 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Spins */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="w-4 h-4 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-white text-sm font-medium">
                    Total Spins
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {totalSpins}
                </div>
                <p className="text-white/60 text-xs mt-1">All-time spins</p>
              </div>

              {/* Items Resold */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                    <DollarSign className="w-4 h-4 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-white text-sm font-medium">
                    Items Resold
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {resoldSpins}
                </div>
                <p className="text-white/60 text-xs mt-1">
                  Converted to credits
                </p>
              </div>

              {/* Rarest Win */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-white text-sm font-medium">Rarest Win</h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {rarestWin
                    ? `${(rarestWin.winningItem?.odd * 100).toFixed(4)}%`
                    : "N/A"}
                </div>
                <p className="text-white/60 text-xs mt-1">
                  Lowest probability win
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={spinsRef}
          className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Date Range Filter - Fixed width */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <button
                  className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB] text-left flex items-center justify-between transition-colors"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span className="truncate">
                    {dateRange.from && dateRange.to
                      ? `${formatDate(dateRange.from)} - ${formatDate(
                          dateRange.to
                        )}`
                      : "Select date range"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${
                      showDatePicker ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                {/* Date Picker Dropdown */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Predefined ranges
                      </h4>
                      <div className="space-y-2">
                        {predefinedDateRanges.map((range, index) => (
                          <button
                            key={index}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-[#11F2EB]/10 hover:text-[#11F2EB] rounded-md transition-colors"
                            onClick={() =>
                              handlePredefinedDateRange(range.from, range.to)
                            }
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Custom range
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            From
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB]"
                            value={
                              pendingDateRange.from
                                ? new Date(pendingDateRange.from)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setPendingDateRange({
                                ...pendingDateRange,
                                from: e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            To
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB]"
                            value={
                              pendingDateRange.to
                                ? new Date(pendingDateRange.to)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setPendingDateRange({
                                ...pendingDateRange,
                                to: e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                      <button
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={clearDateFilter}
                      >
                        Clear
                      </button>
                      <button
                        className="px-4 py-1.5 text-sm bg-[#11F2EB] text-slate-800 font-medium rounded-md hover:bg-[#0ED9D3] transition-colors"
                        onClick={applyDateFilter}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Spin count and pagination controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end lg:justify-end gap-3 flex-1">
              {/* Spin count - hidden on mobile, visible on sm+ */}
              <p className="hidden sm:block text-sm text-gray-500 whitespace-nowrap">
                {spinHistory?.data?.length || 0} of{" "}
                {spinHistory?.pagination?.total || 0} spins
              </p>

              {/* Records per page selector */}
              <div className="relative flex-shrink-0 w-full sm:w-auto">
                <select
                  className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB] bg-white transition-colors"
                  value={limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Spin count for mobile - visible only on mobile */}
              <p className="block sm:hidden text-sm text-gray-500 text-center">
                {spinHistory?.data?.length || 0} of{" "}
                {spinHistory?.pagination?.total || 0} spins
              </p>
            </div>
          </div>

          {/* Active date filter display */}
          {dateRange.from && dateRange.to && (
            <div className="mt-3 flex items-center">
              <span className="text-xs text-gray-500 mr-2">Date filter:</span>
              <div className="bg-[#11F2EB]/10 text-[#11F2EB] text-xs px-2 py-1 rounded-full flex items-center border border-[#11F2EB]/20">
                {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                <button
                  className="ml-1 text-[#11F2EB] hover:text-[#0ED9D3]"
                  onClick={clearDateFilter}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <h3 className="text-lg font-semibold text-gray-900 justify-self-start">
                    Spin History
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {loadingHistory ? (
            <SpinListSkeletonLoader />
          ) : spinHistory?.data?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {spinHistory.data.map((spin) => (
                <div
                  key={spin._id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleSpinClick(spin)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Spin Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getSpinIcon(spin)}
                    </div>

                    {/* Spin Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col space-y-2 sm:space-y-0">
                        {/* Top row: Item and Cost */}
                        <div className="flex items-start justify-between">
                          <div className="flex-grow min-w-0 pr-2">
                            <h4 className="text-base font-medium text-gray-900 truncate leading-tight">
                              {spin.winningItem?.name || "No win"}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {spin.boxDetails?.name}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-lg font-semibold text-slate-700">
                              ${formatAmount(spin.boxDetails?.priceSale || 0)}
                            </p>
                            <p className="text-sm text-purple-600">
                              {(spin.winningItem?.odd * 100).toFixed(4)}% odds
                            </p>
                          </div>
                        </div>

                        {/* Second row: Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(spin)}
                          </div>
                        </div>

                        {/* Third row: Date/Time */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <span>{formatDate(spin.createdAt)}</span>
                            <span>•</span>
                            <span>{formatTime(spin.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No spins found
              </h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                {dateRange.from && dateRange.to
                  ? "Try adjusting your filter criteria"
                  : "Your spin history will appear here once you make your first spin."}
              </p>
            </div>
          )}
        </div>

        {spinHistory?.pagination &&
          spinHistory.pagination.pages > 1 &&
          spinHistory.data?.length > 0 && (
            <SpinPagination
              page={page}
              limit={limit}
              loading={loadingHistory}
              pagination={spinHistory.pagination}
              onPageChange={handlePageChange}
            />
          )}
      </main>

      {showDetailsModal && selectedSpin && (
        <SpinDetailsModal
          isOpen={!!selectedSpin}
          onClose={closeModal}
          spin={selectedSpin}
          formatDate={formatDate}
          formatTime={formatTime}
          formatAmount={formatAmount}
        />
      )}
    </div>
  );
};

export default SpinListing;
