"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchWalletBalanceAndHistory,
  getTransactionByRefId,
} from "@/services/profile"; // Add fetchTransactionById
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams
import TransactionDetailsModal from "@/components/_main/Transactions/TransactionDetailsModal";
import SkeletonLoader from "@/components/_main/Transactions/TransactionPageSkeletonLoader";
import TransactionsPagination from "@/components/_main/Transactions/TransactionsPagination";
import TransactionsListSkeletonLoader from "@/components/_main/Transactions/TransactionListSkeleton";
import { toastError } from "@/lib/toast";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Filter,
  Calendar,
  X,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { useCurrencyFormatter } from "@/hooks/formatCurrency";
import { useCurrencyConvert } from "@/hooks/convertCurrency";

const TransactionsListing = () => {
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params
  const [transactionsData, setTransactionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
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
  const [loadingSpecificTransaction, setLoadingSpecificTransaction] =
    useState(false);
  const transactionsRef = useRef(null);

  // Check for txn query parameter
  const txnId = searchParams?.get("txn");

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit, page };
      if (filterStatus && filterStatus !== "all") params.status = filterStatus;

      if (dateRange.from) params.fromDate = dateRange.from.toISOString();
      if (dateRange.to) params.toDate = dateRange.to.toISOString();

      const response = await fetchWalletBalanceAndHistory(params);

      if (!response.success) {
        throw new Error("Failed to fetch balance data");
      }

      const data = response.data;
      setTransactionsData(data);

      // After loading transactions, check if we need to open a specific transaction
      if (txnId) {
        // First check if it's in the current list
        const transactionInList = data.transactions?.find(
          (txn) => txn.referenceId === txnId || txn._id === txnId
        );

        if (transactionInList) {
          setSelectedTransaction(transactionInList);
          setShowDetailsModal(true);
        } else {
          // If not in current list, fetch it separately
          fetchSpecificTransaction(txnId);
        }
      }
    } catch (err) {
      setError("Error fetching balance");
      if (err?.response?.status === 401) {
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
  }, [limit, page, filterStatus, dateRange, txnId, router]);

  // Function to fetch specific transaction
  const fetchSpecificTransaction = async (transactionId) => {
    try {
      setLoadingSpecificTransaction(true);
      const response = await getTransactionByRefId(transactionId);

      if (response.success) {
        setSelectedTransaction(response.data);
        setShowDetailsModal(true);
      } else {
        toastError("Transaction not found");
        // Remove the txn parameter from URL if transaction not found
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("txn");
        router.replace(`/account?tab=transactions&${newParams.toString()}`);
      }
    } catch (err) {
      toastError("Error loading transaction details");
      // Remove the txn parameter from URL on error
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("txn");
      router.replace(`/account?tab=transactions&${newParams.toString()}`);
    } finally {
      setLoadingSpecificTransaction(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Handle manual refetch triggers
  useEffect(() => {
    if (shouldRefetch) {
      fetchBalance();
    }
  }, [shouldRefetch, fetchBalance]);

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
    return fCurrency(cCurrency(amount));
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
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-50 text-yellow-700",
      failed: "bg-red-50 text-red-700",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-sm font-medium ${
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

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedTransaction(null);

    // Remove the txn parameter from URL when modal is closed
    if (txnId) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("txn");
      router.replace(`/account?tab=transactions&${newParams.toString()}`);
    }
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

  const handleStatusChange = (newStatus) => {
    setFilterStatus(newStatus);
    setPage(1);
    setShouldRefetch(true);
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
      if (transactionsRef.current) {
        transactionsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    if (transactionsRef.current) {
      transactionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setLimit(Number(newLimit));
    setPage(1);
  };

  if (loading) {
    return <SkeletonLoader />;
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
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-black min-h-screen flex flex-col">
      <main className="container mx-auto pt-0 pb-16 flex-grow">
        {/* Header Section */}
        <div className="mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            View and manage your account transactions
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden">
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
              <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                {formatAmount(transactionsData?.balance?.availableBalance || 0)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
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

        <div
          ref={transactionsRef}
          className="bg-white rounded-xl shadow-sm p-4 mb-5 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side - Filters */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              {/* Status Filter */}
              <div className="relative flex-1 min-w-0">
                <select
                  className="w-full pl-10 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#11F2EB]/50 focus:border-[#11F2EB] transition-colors"
                  value={filterStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Date Range Filter */}
              <div className="relative flex-1 min-w-0">
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

            {/* Right side - Transaction count and pagination controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end lg:justify-end gap-3 lg:min-w-max">
              {/* Transaction count - hidden on mobile, visible on sm+ */}
              <p className="hidden sm:block text-sm text-gray-500 whitespace-nowrap">
                {transactionsData?.transactions?.length || 0} of{" "}
                {transactionsData.pagination.totalCount || 0} transactions
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

              {/* Transaction count for mobile - visible only on mobile */}
              <p className="block sm:hidden text-sm text-gray-500 text-center">
                {transactionsData?.transactions?.length || 0} of{" "}
                {transactionsData.pagination.totalCount || 0} transactions
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
                    Recent Transactions
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {loadingHistory ? (
            <TransactionsListSkeletonLoader />
          ) : transactionsData?.transactions?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transactionsData?.transactions.map((transaction) => (
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
                              {formatAmount(transaction.amount)}
                            </p>
                          </div>
                        </div>

                        {/* Second row: Badges and Balance */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(transaction.status)}
                            {getCategoryBadge(transaction.category)}
                          </div>
                          <div className="text-left sm:text-right sm:ml-4">
                            <p className="text-sm font-medium text-gray-700 sm:font-normal sm:text-gray-500">
                              Balance:{" "}
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
          transactionsData.pagination.totalPages > 1 &&
          transactionsData?.transactions?.length > 0 && (
            <TransactionsPagination
              page={page}
              limit={limit}
              loading={loadingHistory}
              pagination={transactionsData.pagination}
              onPageChange={handlePageChange}
            />
          )}
      </main>

      {showDetailsModal && selectedTransaction && (
        <TransactionDetailsModal
          isOpen={!!selectedTransaction}
          onClose={closeModal}
          transaction={selectedTransaction}
          getTransactionIcon={getTransactionIcon}
          getStatusBadge={getStatusBadge}
          formatAmount={formatAmount}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}

      {/* Loading overlay for specific transaction */}
      {loadingSpecificTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11F2EB] mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600">
              Loading transaction details...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsListing;
