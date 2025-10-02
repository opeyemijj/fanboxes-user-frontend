"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getMyOrderHistory, getOrderById } from "@/services/order";
import { useRouter, useSearchParams } from "next/navigation";
import { toastError } from "@/lib/toast";
import {
  Calendar,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Box,
  Clock,
  Hash,
  ExternalLink,
  CheckCircle,
  Truck,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

// Pagination Component (same as spin component)
const OrderPagination = ({
  page,
  limit,
  loading,
  pagination,
  onPageChange,
}) => {
  if (!pagination) return <></>;

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: summary */}
      <div className="text-sm text-gray-700">
        Showing {(page - 1) * limit + 1} to{" "}
        {Math.min(page * limit, pagination.total)} of {pagination.total} orders
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

// Details Modal Component for Orders
const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  formatDate,
  formatTime,
  formatAmount,
}) => {
  if (!isOpen || !order) return null;
  console.log("OOOO::", order);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-indigo-100 text-indigo-800",
      shipped: "bg-purple-100 text-purple-800",
      "out-for-delivery": "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
      returned: "bg-pink-100 text-pink-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Order Details
              </h2>
              <p className="text-xs text-gray-500">
                Order #{order.orderNo} • {formatDate(order.createdAt)}
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
            {/* Order Summary */}
            <div className="relative bg-gradient-to-br from-[#13192c] via-[#0C2539] to-[#13192c] rounded-2xl p-6 shadow-xl overflow-hidden">
              <div className="absolute inset-0 opacity-15">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #11F2EB 1px, transparent 1.5px), radial-gradient(circle at 75% 75%, #11F2EB 1px, transparent 1.5px)`,
                    backgroundSize: "32px 32px",
                  }}
                ></div>
              </div>

              <div className="relative text-center">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full shadow-lg inline-flex mb-4 ring-2 ring-[#11F2EB]/30">
                  <Package className="w-8 h-8 text-[#11F2EB]" />
                </div>
                <div className="text-3xl font-bold mb-2 text-white">
                  ${formatAmount(order.totalAmountPaid)}
                </div>
                <p className="text-white font-semibold mb-3 text-base">
                  Total Amount
                </p>
                <div className="flex justify-center items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1).replace(/-/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {order.user?.shippingAddress && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Shipping Address
                  </h3>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{order.user.shippingAddress.address}</p>
                  <p>
                    {order.user.shippingAddress.city},{" "}
                    {order.user.shippingAddress.state}{" "}
                    {order.user.shippingAddress.zip}
                  </p>
                  <p>{order.user.shippingAddress.country}</p>
                  {order.user.phone && (
                    <p className="mt-2">Phone: {order.user.phone}</p>
                  )}
                </div>
              </div>
            )}

            {/* Tracking Information */}
            {order.trackingInfo && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-900">
                      Tracking Information
                    </h3>
                  </div>
                  {order.trackingInfo.trackingNumber && (
                    <span className="text-xs font-mono bg-white px-2 py-1 rounded">
                      #{order.trackingInfo.trackingNumber}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Courier:</span>
                    <p className="font-medium">
                      {order.trackingInfo.courier || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Shipped:</span>
                    <p className="font-medium">
                      {order.trackingInfo.shipped || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected Delivery:</span>
                    <p className="font-medium">
                      {order.trackingInfo.expected || "N/A"}
                    </p>
                  </div>
                  {order.carrier && (
                    <div>
                      <span className="text-gray-600">Carrier:</span>
                      <p className="font-medium">{order.carrier}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Order Items ({order.items?.length || 0})
              </h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex gap-4">
                      {item.images?.[0]?.url && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.images[0].url || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {item.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Value:</span>
                            <p className="font-semibold">
                              ${formatAmount(item.value)}
                            </p>
                          </div>
                          {item.associatedBox && (
                            <div>
                              <span className="text-gray-600">From Box:</span>
                              <p className="font-medium">
                                {item.associatedBox.title}
                              </p>
                            </div>
                          )}
                          {item.weight && (
                            <div>
                              <span className="text-gray-600">Weight:</span>
                              <p className="font-medium">{item.weight}%</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-slate-700">
                        $
                        {formatAmount(
                          order.totalAmountPaid -
                            (order.shippingFee || 0) -
                            (order.taxApplied?.amount || 0)
                        )}
                      </span>
                    </div>
                    {order.shippingFee > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold text-slate-700">
                          ${formatAmount(order.shippingFee)}
                        </span>
                      </div>
                    )}
                    {order.taxApplied?.amount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-semibold text-slate-700">
                          ${formatAmount(order.taxApplied.amount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-2">
                      <span className="text-gray-600 font-semibold">Total</span>
                      <span className="font-bold text-slate-900 text-lg">
                        ${formatAmount(order.totalAmountPaid)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date & Transaction Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Order Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Order Date</span>
                      <span className="font-medium">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Order Time</span>
                      <span className="font-medium">
                        {formatTime(order.createdAt)}
                      </span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Est. Delivery</span>
                        <span className="font-medium">
                          {formatDate(order.estimatedDelivery)}
                        </span>
                      </div>
                    )}
                    {order.transaction && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Payment</span>
                        <span className="font-medium capitalize">
                          {order.transaction.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            {order.transaction && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    Transaction Details
                  </h3>
                  {order.transaction.referenceId && (
                    <span className="text-xs font-mono bg-white px-2 py-1 rounded">
                      Ref: {order.transaction.referenceId}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <p className="font-semibold">
                      ${formatAmount(order.transaction.amount)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Method:</span>
                    <p className="font-medium capitalize">
                      {order.transaction.paymentMethod || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium capitalize">
                      {order.transaction.transactionType}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-medium capitalize">
                      {order.transaction.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Spin Data (if applicable) */}
            {order.spinData && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Box className="w-4 h-4 text-amber-600" />
                    Spin Verification
                  </h3>
                  <a
                    href={`/verify-spin?clientSeed=${
                      order.spinData.clientSeed
                    }&serverSeed=${order.spinData.serverSeed}&serverSeedHash=${
                      order.spinData.serverSeedHash
                    }&nonce=${
                      order.spinData.nonce
                    }&createdAt=${encodeURIComponent(
                      order.createdAt
                    )}&normalized=${order.spinData.normalized}&boxSlug=${
                      order.spinData?.boxDetails?.slug || ""
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Verify Spin
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Winning Item:</span>
                    <p className="font-medium">
                      {order.spinData.winningItem?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Nonce:</span>
                    <p className="font-mono text-xs bg-white p-2 rounded">
                      {order.spinData.nonce}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Normalized Result:</span>
                    <p className="font-mono text-xs bg-white p-2 rounded">
                      {parseFloat(order.spinData.normalized).toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Client Seed:</span>
                    <p className="font-mono text-xs bg-white p-2 rounded truncate">
                      {order.spinData.clientSeed}
                    </p>
                  </div>
                </div>
                {order.spinData.serverSeedHash && (
                  <div className="mt-3">
                    <span className="text-gray-600 text-sm">
                      Server Seed Hash:
                    </span>
                    <p className="font-mono text-xs bg-white p-2 rounded mt-1 truncate">
                      {order.spinData.serverSeedHash}
                    </p>
                  </div>
                )}
              </div>
            )}
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

// Skeleton Loaders (adapted for orders)
const OrderPageSkeletonLoader = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>

        {/* Stats Card Skeleton */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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

const OrderListSkeletonLoader = () => {
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
const OrderListing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderHistory, setOrderHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
  const [loadingSpecificOrder, setLoadingSpecificOrder] = useState(false);
  const ordersRef = useRef(null);
  // Check for order query parameter
  const orderId = searchParams?.get("order");

  // const fetchOrderHistory = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const params = { limit, page };

  //     // Add date range filters if they exist
  //     if (dateRange.from) {
  //       params.fromDate = dateRange.from.toISOString();
  //     }
  //     if (dateRange.to) {
  //       params.toDate = dateRange.to.toISOString();
  //     }

  //     const response = await getMyOrderHistory(params);

  //     if (!response.success) {
  //       throw new Error("Failed to fetch order history");
  //     }

  //     setOrderHistory(response);
  //   } catch (err) {
  //     setError("Error fetching order history");
  //     if (err?.response && err.response.status === 401) {
  //       toastError(
  //         err.response?.data?.message ||
  //           "Session Expired. Please login to continue"
  //       );
  //       router.replace("/login");
  //     }
  //   } finally {
  //     setLoading(false);
  //     setLoadingHistory(false);
  //     setShouldRefetch(false);
  //   }
  // }, [limit, page, dateRange]);

  const fetchOrderHistory = useCallback(async () => {
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

      const response = await getMyOrderHistory(params);

      if (!response.success) {
        throw new Error("Failed to fetch order history");
      }

      setOrderHistory(response);

      // After loading orders, check if we need to open a specific order
      if (orderId) {
        // First check if it's in the current list
        const orderInList = response.data?.find(
          (order) => order._id === orderId || order.orderNo === orderId
        );

        if (orderInList) {
          setSelectedOrder(orderInList);
          setShowDetailsModal(true);
        } else {
          // If not in current list, fetch it separately
          fetchSpecificOrder(orderId);
        }
      }
    } catch (err) {
      setError("Error fetching order history");
      if (err?.response && err.response.status === 401) {
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
  }, [limit, page, dateRange, orderId, router]);

  // Function to fetch specific order
  const fetchSpecificOrder = async (orderId) => {
    try {
      setLoadingSpecificOrder(true);
      const response = await getOrderById(orderId);

      if (response.success) {
        setSelectedOrder(response.data);
        setShowDetailsModal(true);
      } else {
        toastError("Order not found");
        // Remove the order parameter from URL if order not found
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("order");
        router.replace(`/account?tab=orders&${newParams.toString()}`);
      }
    } catch (err) {
      toastError("Error loading order details");
      // Remove the order parameter from URL on error
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("order");
      router.replace(`/account?tab=orders&${newParams.toString()}`);
    } finally {
      setLoadingSpecificOrder(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  useEffect(() => {
    if (shouldRefetch) {
      fetchOrderHistory();
    }
  }, [shouldRefetch, fetchOrderHistory]);

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

  const getOrderIcon = (order) => {
    return (
      <div className="w-10 h-10 bg-[#11F2EB]/20 rounded-full flex items-center justify-center">
        <Package className="w-5 h-5 text-[#11F2EB]" />
      </div>
    );
  };

  const getStatusBadge = (order) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-indigo-100 text-indigo-800",
      shipped: "bg-purple-100 text-purple-800",
      "out-for-delivery": "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
      returned: "bg-pink-100 text-pink-800",
    };

    const statusText = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      "out-for-delivery": "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      refunded: "Refunded",
      returned: "Returned",
    };

    // Determine order type
    const orderType = order.spinData ? "spin" : "direct";
    const orderTypeColors = {
      spin: "bg-purple-100 text-purple-800",
      direct: "bg-green-100 text-green-800",
    };
    const orderTypeText = {
      spin: "From Spin",
      direct: "Direct Buy",
    };

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-sm font-medium ${
            statusColors[order.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusText[order.status] || order.status}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full text-sm font-medium ${orderTypeColors[orderType]}`}
        >
          {orderTypeText[orderType]}
        </span>
        {order.trackingNumber && (
          <span className="px-2 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            Tracked
          </span>
        )}
      </div>
    );
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);

    // Remove the order parameter from URL when modal is closed
    if (orderId) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("order");
      router.replace(`/account?tab=orders&${newParams.toString()}`);
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
      if (ordersRef.current) {
        ordersRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit) => {
    if (ordersRef.current) {
      ordersRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setLimit(Number(newLimit));
    setPage(1);
  };

  // Calculate statistics for orders
  const totalOrders = orderHistory?.pagination?.total || 0;
  const deliveredOrders = orderHistory?.pagination?.totalDelivered || 0;
  const processingOrders = orderHistory?.pagination?.totalProcessing || 0;
  const onTheWayOrders = orderHistory?.pagination?.totalOnTheWay || 0;

  if (loading) {
    return <OrderPageSkeletonLoader />;
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
                    Error Loading Order History
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
            View your order history and tracking information
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#11F2EB]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#11F2EB]/10 to-transparent rounded-full -translate-x-12 translate-y-12"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-[#11F2EB]/5 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2"></div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Orders */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                    <ShoppingCart className="w-4 h-4 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-white text-sm font-medium">
                    Total Orders
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {totalOrders}
                </div>
                <p className="text-white/60 text-xs mt-1">All orders</p>
              </div>

              {/* Processing Orders */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                    <Package className="w-4 h-4 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-white text-sm font-medium">
                    Total Processing
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {processingOrders}
                </div>
                <p className="text-white/60 text-xs mt-1">Being prepared</p>
              </div>

              {/* Shipped Orders */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                    <Truck className="w-4 h-4 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-white text-sm font-medium">
                    Total In Transit
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {onTheWayOrders}
                </div>
                <p className="text-white/60 text-xs mt-1">On the way</p>
              </div>

              {/* Delivered Orders */}
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-[#11F2EB]/20 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircle className="w-4 h-4 text-[#11F2EB]" />
                  </div>
                  <h3 className="text-white text-sm font-medium">
                    Total Delivered
                  </h3>
                </div>
                <div className="text-2xl font-bold text-white">
                  {deliveredOrders}
                </div>
                <p className="text-white/60 text-xs mt-1">
                  Successfully delivered
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={ordersRef}
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

            {/* Right side - Order count and pagination controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end lg:justify-end gap-3 flex-1">
              {/* Order count - hidden on mobile, visible on sm+ */}
              <p className="hidden sm:block text-sm text-gray-500 whitespace-nowrap">
                {orderHistory?.data?.length || 0} of{" "}
                {orderHistory?.pagination?.total || 0} orders
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

              {/* Order count for mobile - visible only on mobile */}
              <p className="block sm:hidden text-sm text-gray-500 text-center">
                {orderHistory?.data?.length || 0} of{" "}
                {orderHistory?.pagination?.total || 0} orders
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
                    Order History
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {loadingHistory ? (
            <OrderListSkeletonLoader />
          ) : orderHistory?.data?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {orderHistory.data.map((order) => (
                <div
                  key={order._id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    {/* Order Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getOrderIcon(order)}
                    </div>

                    {/* Order Details */}
                    <div className="flex-grow min-w-0">
                      <div className="flex flex-col space-y-2 sm:space-y-0">
                        {/* Top row: Order info and Amount */}
                        <div className="flex items-start justify-between">
                          <div className="flex-grow min-w-0 pr-2">
                            <h4 className="text-base font-medium text-gray-900 truncate leading-tight">
                              Order #{order.orderNo}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {order.items?.length || 0} item
                              {order.items?.length !== 1 ? "s" : ""}
                              {order.items?.[0]?.associatedBox?.title &&
                                ` • ${order.items[0].associatedBox.title}`}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-lg font-semibold text-slate-700">
                              ${formatAmount(order.totalAmountPaid)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.items?.length || 0} items
                            </p>
                          </div>
                        </div>

                        {/* Second row: Status and Tracking */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          {getStatusBadge(order)}
                        </div>

                        {/* Third row: Date/Time */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <span>{formatDate(order.createdAt)}</span>
                            <span>•</span>
                            <span>{formatTime(order.createdAt)}</span>
                            {order.estimatedDelivery && (
                              <>
                                <span>•</span>
                                <span>
                                  Est. delivery:{" "}
                                  {formatDate(order.estimatedDelivery)}
                                </span>
                              </>
                            )}
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
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-2 text-gray-600 max-w-md mx-auto">
                {dateRange.from && dateRange.to
                  ? "Try adjusting your filter criteria"
                  : "Your order history will appear here once you make your first purchase."}
              </p>
            </div>
          )}
        </div>

        {orderHistory?.pagination &&
          orderHistory.pagination.pages > 1 &&
          orderHistory.data?.length > 0 && (
            <OrderPagination
              page={page}
              limit={limit}
              loading={loadingHistory}
              pagination={orderHistory.pagination}
              onPageChange={handlePageChange}
            />
          )}
      </main>

      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          isOpen={!!selectedOrder}
          onClose={closeModal}
          order={selectedOrder}
          formatDate={formatDate}
          formatTime={formatTime}
          formatAmount={formatAmount}
        />
      )}

      {/* Loading overlay for specific order */}
      {loadingSpecificOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11F2EB] mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600">
              Loading requested order details...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListing;
