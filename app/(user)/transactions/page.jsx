"use client";
import { useState, useEffect, useRef } from "react";
import { fetchWalletBalanceAndHistory } from "@/services/profile";
import Footer from "@/components/_main/Footer";
import Header from "@/components/_main/Header";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Filter,
  Calendar,
  X,
  Wallet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Transactions = () => {
  const [transactionsData, setTransactionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const transactionsRef = useRef(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        console.log("fetch history called...");
        setLoading(true);
        const response = await fetchWalletBalanceAndHistory(limit, page);
        console.log("Wallet balance response:", response);

        if (!response.success) {
          throw new Error("Failed to fetch balance data");
        }

        const data = response.data;
        setTransactionsData(data);
      } catch (err) {
        setError("Error fetching balance");
        console.error("Error fetching balance:", err);
      } finally {
        setLoading(false);
        setLoadingHistory(false);
      }
    };

    fetchBalance();
  }, [limit, page]);

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

  const getTransactionIcon = (type, category) => {
    if (type === "credit") {
      return (
        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
          <ArrowUp className="w-5 h-5 text-green-600" />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
        <ArrowDown className="w-5 h-5 text-red-600" />
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-green-50 text-green-700",
      pending: "bg-yellow-50 text-yellow-700",
      failed: "bg-red-50 text-red-700",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryStyles = {
      deposit: "bg-blue-50 text-blue-700",
      withdrawal: "bg-purple-50 text-purple-700",
      payment: "bg-amber-50 text-amber-700",
      transfer: "bg-indigo-50 text-indigo-700",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          categoryStyles[category] || "bg-gray-100 text-gray-700"
        }`}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  // Filter transactions based on status and date range
  const filteredTransactions = transactionsData?.transactions?.filter(
    (transaction) => {
      const matchesStatus =
        filterStatus === "all" || transaction.status === filterStatus;

      // Date range filtering
      let matchesDateRange = true;
      if (dateRange.from && dateRange.to) {
        const transactionDate = new Date(transaction.transactionDate);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // Include entire end date

        matchesDateRange =
          transactionDate >= fromDate && transactionDate <= toDate;
      }

      return matchesStatus && matchesDateRange;
    }
  );

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedTransaction(null);
  };

  const handleDateRangeSelect = (from, to) => {
    setDateRange({ from, to });
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setDateRange({ from: null, to: null });
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
      setLoadingHistory(true);
      setPage(newPage);

      // Store the scroll position reference before the update
      const scrollTarget = transactionsRef.current;

      // Use a slight delay and check if element exists
      setTimeout(() => {
        if (scrollTarget) {
          scrollTarget.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 300); // Increased delay to ensure content is rendering
    }
  };

  const handleLimitChange = (newLimit) => {
    setLoadingHistory(true);
    setLimit(Number(newLimit));
    setPage(1); // Reset to first page when changing limit
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="bg-gray-50 text-black min-h-screen">
      <Header />
      <main className="container mx-auto px-3 sm:px-6 lg:px-8 pt-20 pb-16 flex-grow">
        {/* Balance Card Skeleton */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-600/50 rounded-lg animate-pulse mr-3"></div>
              <div className="h-4 w-32 bg-gray-600/50 rounded animate-pulse"></div>
            </div>

            <div className="flex items-baseline mb-6">
              <div className="h-8 w-6 bg-gray-600/50 rounded animate-pulse mr-1"></div>
              <div className="h-12 w-48 bg-gray-600/50 rounded-lg animate-pulse"></div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="h-6 w-24 bg-gray-600/50 rounded-full animate-pulse"></div>
              <div className="h-10 w-28 bg-gray-600/50 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 h-11 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="relative flex-1 h-11 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Transactions List Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2 sm:mb-0"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Transaction Items Skeleton */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="px-4 sm:px-6 py-4 border-b border-gray-100"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Icon Skeleton */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col space-y-3">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Middle row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-1 sm:mt-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );

  const TransactionsListSkeletonLoader = () => (
    <div className="bg-gray-50 text-black min-h-screen">
      <main className="container mx-auto px-3 sm:px-6 lg:px-8 pt-20 pb-16 flex-grow">
        {/* Transactions List Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2 sm:mb-0"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Transaction Items Skeleton */}
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="px-4 sm:px-6 py-4 border-b border-gray-100"
            >
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Icon Skeleton */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col space-y-3">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Middle row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-1 sm:mt-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className="bg-gray-50 text-black min-h-screen flex flex-col">
        <Header />
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
                    Error Loading Transactions
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-black min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-3 sm:px-6 lg:px-8 pt-20 pb-16 flex-grow">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Transaction History
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            View and manage your account transactions
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          {/* Decorative elements with primary color accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#11F2EB]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#11F2EB]/10 to-transparent rounded-full -translate-x-12 translate-y-12"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-[#11F2EB]/5 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                <Wallet className="w-4 h-4 text-[#11F2EB]" />
              </div>
              <h2 className="text-white text-sm font-medium">
                Current Balance
              </h2>
            </div>

            <div className="flex items-baseline mb-6">
              <span className="text-white/80 text-xl sm:text-2xl font-semibold mr-1">
                $
              </span>
              <span className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
                {formatAmount(transactionsData?.balance?.availableBalance || 0)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                {/* <div className="text-white/70 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                  {transactionsData?.transactions?.length || 0} transactions
                </div> */}
                <div className="text-white/70 text-xs bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                  {transactionsData?.pagination?.totalCount || 0} total
                  transactions
                </div>
              </div>

              <button className="flex items-center justify-center sm:justify-start px-4 py-2 text-sm font-medium text-slate-800 bg-[#11F2EB] rounded-lg hover:bg-[#0ED9D3] transition-all duration-200 shadow-lg hover:shadow-xl">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <select
                  className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB] transition-colors"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <div className="relative flex-1">
                <button
                  className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB] text-left flex items-center justify-between transition-colors"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span>
                    {dateRange.from && dateRange.to
                      ? `${formatDate(dateRange.from)} - ${formatDate(
                          dateRange.to
                        )}`
                      : "Select date range"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
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
                              handleDateRangeSelect(range.from, range.to)
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
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            From
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB]"
                            value={
                              dateRange.from
                                ? new Date(dateRange.from)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
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
                              dateRange.to
                                ? new Date(dateRange.to)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
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
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                        onClick={clearDateFilter}
                      >
                        Clear
                      </button>
                      <button
                        className="px-4 py-1.5 text-sm bg-[#11F2EB] text-slate-800 font-medium rounded-md hover:bg-[#0ED9D3] transition-colors"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

        <div
          ref={transactionsRef}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              {/* <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">
                Recent Transactions
              </h3>
              <p className="text-sm text-gray-500">
                {filteredTransactions?.length || 0} of{" "}
                {transactionsData?.transactions?.length || 0} transactions
              </p> */}

              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0 mr-2">
                    Recent Transactions
                  </h3>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500">
                      {filteredTransactions?.length || 0} of{" "}
                      {transactionsData?.transactions?.length || 0} transactions
                    </p>

                    {/* Records per page selector */}
                    <div className="relative">
                      <select
                        className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB] bg-white"
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loadingHistory ? (
            <TransactionsListSkeletonLoader />
          ) : filteredTransactions?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Transaction Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getTransactionIcon(
                        transaction.transactionType,
                        transaction.category
                      )}
                    </div>

                    {/* Transaction Details - Enhanced mobile layout */}
                    <div className="flex-grow min-w-0">
                      {/* Mobile: Stack everything vertically, Desktop: Side by side */}
                      <div className="flex flex-col space-y-2 sm:space-y-0">
                        {/* Top row: Title and Amount */}
                        <div className="flex items-start justify-between">
                          <div className="flex-grow min-w-0 pr-2">
                            <h4 className="text-base font-medium text-gray-900 truncate leading-tight">
                              {transaction.description}
                            </h4>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p
                              className={`text-lg font-semibold ${
                                transaction.transactionType === "credit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.transactionType === "credit"
                                ? "+"
                                : "-"}
                              ${formatAmount(transaction.amount)}
                            </p>
                          </div>
                        </div>

                        {/* Second row: Badges and Balance (mobile stacked, desktop inline) */}
                        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(transaction.status)}
                            {getCategoryBadge(transaction.category)}
                          </div>
                          <div className="text-right sm:ml-4">
                            <p className="text-sm text-gray-500">
                              Balance: $
                              {formatAmount(transaction.availableBalance)}
                            </p>
                          </div>
                        </div> */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(transaction.status)}
                            {getCategoryBadge(transaction.category)}
                          </div>
                          {/* Mobile: Balance aligned to left and emphasized */}
                          <div className="text-left sm:text-right sm:ml-4">
                            <p className="text-sm font-medium text-gray-700 sm:font-normal sm:text-gray-500">
                              Balance: $
                              {formatAmount(transaction.availableBalance)}
                            </p>
                          </div>
                        </div>

                        {/* Third row: Date/Time and Reference */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <span>
                              {formatDate(transaction.transactionDate)}
                            </span>
                            <span>•</span>
                            <span>
                              {formatTime(transaction.transactionDate)}
                            </span>
                          </div>
                          <div className="truncate sm:ml-4">
                            <span className="font-mono">
                              Ref: {transaction.referenceId}
                            </span>
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
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No transactions found
              </h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                {filterStatus !== "all" || (dateRange.from && dateRange.to)
                  ? "Try adjusting your filter criteria"
                  : "Your transaction history will appear here once you make your first transaction."}
              </p>
            </div>
          )}
        </div>

        {transactionsData?.pagination &&
          transactionsData.pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, transactionsData.pagination.totalCount)}{" "}
                of {transactionsData.pagination.totalCount} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={
                    !transactionsData.pagination.hasPrev || loadingHistory
                  }
                  onClick={() => handlePageChange(page - 1)}
                  className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        transactionsData.pagination.totalPages
                      ),
                    },
                    (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (transactionsData.pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (
                        page >=
                        transactionsData.pagination.totalPages - 2
                      ) {
                        pageNum =
                          transactionsData.pagination.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                            page === pageNum
                              ? "bg-slate-900 text-[#0ED9D3] font-medium"
                              : "text-[#0ED9D3] bg-slate-600 border border-gray-300 hover:bg-gray-50"
                          }`}
                          disabled={loadingHistory}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  {transactionsData.pagination.totalPages > 5 &&
                    page < transactionsData.pagination.totalPages - 2 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                </div>

                <button
                  disabled={
                    !transactionsData.pagination.hasNext || loadingHistory
                  }
                  onClick={() => handlePageChange(page + 1)}
                  className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
      </main>
      <Footer />

      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-9999">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Transaction Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-center mb-6">
                {getTransactionIcon(
                  selectedTransaction.transactionType,
                  selectedTransaction.category
                )}
              </div>

              <div className="text-center mb-6">
                <p
                  className={`text-2xl font-bold ${
                    selectedTransaction.transactionType === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedTransaction.transactionType === "credit" ? "+" : "-"}
                  ${formatAmount(selectedTransaction.amount)}
                </p>
                <p className="text-gray-600 mt-1">
                  {selectedTransaction.description}
                </p>
                <div className="mt-3 flex justify-center">
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference ID</span>
                  <span className="font-medium font-mono text-sm">
                    {selectedTransaction.referenceId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">
                    {selectedTransaction.category}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {selectedTransaction.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">
                    {formatDate(selectedTransaction.transactionDate)} at{" "}
                    {formatTime(selectedTransaction.transactionDate)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize">
                    {selectedTransaction.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Balance After</span>
                  <span className="font-medium">
                    ${formatAmount(selectedTransaction.availableBalance)}
                  </span>
                </div>
              </div>

              {selectedTransaction.metadata && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Additional Information
                  </h4>
                  {selectedTransaction.metadata.initiatedBy && (
                    <div className="text-sm text-gray-600">
                      Initiated by:{" "}
                      {selectedTransaction.metadata.initiatedBy.firstName}{" "}
                      {selectedTransaction.metadata.initiatedBy.lastName}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-[#11F2EB] text-slate-800 font-medium rounded-lg hover:bg-[#0ED9D3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
