// components/TransactionDetailsModal.jsx
import { X } from "lucide-react";

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
  getTransactionIcon,
  getStatusBadge,
  formatAmount,
  formatDate,
  formatTime,
}) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            {getTransactionIcon(
              transaction.transactionType,
              transaction.category
            )}
          </div>

          <div className="text-center mb-6">
            <p
              className={`text-2xl font-bold ${
                transaction.transactionType === "credit"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.transactionType === "credit" ? "+" : "-"}$
              {formatAmount(transaction.amount)}
            </p>
            <p className="text-gray-600 mt-1">{transaction.description}</p>
            <div className="mt-3 flex justify-center">
              {getStatusBadge(transaction.status)}
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference ID</span>
              <span className="font-medium font-mono text-sm">
                {transaction.referenceId}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Category</span>
              <span className="font-medium capitalize">
                {transaction.category}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium capitalize">
                {transaction.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">
                {formatDate(transaction.transactionDate)} at{" "}
                {formatTime(transaction.transactionDate)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium capitalize">
                {transaction.status}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Balance After</span>
              <span className="font-medium">
                ${formatAmount(transaction.availableBalance)}
              </span>
            </div>
          </div>

          {transaction.metadata && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">
                Additional Information
              </h4>
              {transaction.metadata.initiatedBy && (
                <div className="text-sm text-gray-600">
                  Initiated by: {transaction.metadata.initiatedBy.firstName}{" "}
                  {transaction.metadata.initiatedBy.lastName}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#11F2EB] text-slate-800 font-medium rounded-lg hover:bg-[#0ED9D3] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
