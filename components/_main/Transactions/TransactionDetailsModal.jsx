// // components/TransactionDetailsModal.jsx
// import { X } from "lucide-react";

// export default function TransactionDetailsModal({
//   isOpen,
//   onClose,
//   transaction,
//   getTransactionIcon,
//   getStatusBadge,
//   formatAmount,
//   formatDate,
//   formatTime,
// }) {
//   if (!isOpen || !transaction) return null;

//   console.log("TNXXXX____", transaction);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
//       <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Transaction Details
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-6">
//           <div className="flex justify-center mb-6">
//             {getTransactionIcon(
//               transaction.transactionType,
//               transaction.category
//             )}
//           </div>

//           <div className="text-center mb-6">
//             <p
//               className={`text-2xl font-bold ${
//                 transaction.transactionType === "credit"
//                   ? "text-green-600"
//                   : "text-red-600"
//               }`}
//             >
//               {transaction.transactionType === "credit" ? "+" : "-"}$
//               {formatAmount(transaction.amount)}
//             </p>
//             <p className="text-gray-600 mt-1">{transaction.description}</p>
//             <div className="mt-3 flex justify-center">
//               {getStatusBadge(transaction.status)}
//             </div>
//           </div>

//           <div className="space-y-4 border-t border-gray-200 pt-4">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Reference ID</span>
//               <span className="font-medium font-mono text-sm">
//                 {transaction.referenceId}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Category</span>
//               <span className="font-medium capitalize">
//                 {transaction.category}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Payment Method</span>
//               <span className="font-medium capitalize">
//                 {transaction.paymentMethod}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Date & Time</span>
//               <span className="font-medium">
//                 {formatDate(transaction.transactionDate)} at{" "}
//                 {formatTime(transaction.transactionDate)}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Status</span>
//               <span className="font-medium capitalize">
//                 {transaction.status}
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="text-gray-600">Balance After</span>
//               <span className="font-medium">
//                 ${formatAmount(transaction.availableBalance)}
//               </span>
//             </div>
//           </div>

//           {transaction.metadata && (
//             <div className="mt-6 pt-4 border-t border-gray-200">
//               <h4 className="font-medium text-gray-900 mb-2">
//                 Additional Information
//               </h4>
//               {transaction.metadata.initiatedBy && (
//                 <div className="text-sm text-gray-600">
//                   Initiated by: {transaction.metadata.initiatedBy.firstName}{" "}
//                   {transaction.metadata.initiatedBy.lastName}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="w-full py-3 bg-[#11F2EB] text-slate-800 font-medium rounded-lg hover:bg-[#0ED9D3] transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/TransactionDetailsModal.jsx
import {
  X,
  Trophy,
  Package,
  Hash,
  Calendar,
  CreditCard,
  User,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

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

  console.log("MMM::", transaction);

  const winningItem = transaction.metadata?.spinResult?.winningItem;
  const boxDetails = transaction.metadata?.boxDetails;
  const initiatedBy = transaction.metadata?.initiatedBy;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-50 to-gray-50 px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Transaction Details
              </h2>
              <p className="text-xs text-gray-500 font-mono">
                {transaction.referenceId}
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
            {/* Main Transaction Summary - Updated with dark blue gradient */}
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
                  {getTransactionIcon(
                    transaction.transactionType,
                    transaction.category
                  )}
                </div>
                <div
                  className={`text-3xl font-bold mb-2 ${
                    transaction.transactionType === "credit"
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {transaction.transactionType === "credit" ? "+" : "-"}$
                  {formatAmount(transaction.amount)}
                </div>
                <p className="text-white font-semibold mb-3 text-base">
                  {transaction.description}
                </p>
                <div className="flex justify-center items-center gap-4">
                  <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    {getStatusBadge(transaction.status)}
                  </div>
                  <span className="text-sm text-gray-600 bg-[#11F2EB] backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
                    {formatDate(transaction.transactionDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Winning Item Card - Compact */}
            {winningItem && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Winning Item
                  </h3>
                </div>
                <div className="flex gap-3">
                  {winningItem.images?.[0]?.url && (
                    <div className="flex-shrink-0">
                      <img
                        src={winningItem.images[0].url || "/placeholder.svg"}
                        alt={winningItem.name}
                        className="w-12 h-12 object-cover rounded-lg border border-amber-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">
                      {winningItem.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="font-medium text-emerald-600">
                        ${winningItem.value}
                      </span>
                      <span>Weight: {winningItem.weight}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Box Details Card - Compact */}
            {boxDetails && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-gray-900">
                    Box Details
                  </h3>
                </div>
                <div className="flex gap-3">
                  {boxDetails.images?.[0]?.url && (
                    <div className="flex-shrink-0">
                      <img
                        src={boxDetails.images[0].url || "/placeholder.svg"}
                        alt={boxDetails.name}
                        className="w-12 h-12 object-cover rounded-lg border border-blue-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">
                      {boxDetails.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="font-medium text-blue-600">
                        ${boxDetails.priceSale}
                      </span>
                      <span>{boxDetails.items?.length || 0} items</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Information Grid - Equal Heights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Details */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Transaction Info
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 h-[140px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Type</span>
                      <span
                        className={`font-medium capitalize bg-white px-2 py-1 rounded-full text-xs ${
                          transaction.transactionType === "credit"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.transactionType}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium capitalize bg-white px-2 py-1 rounded-full text-xs">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize bg-white px-2 py-1 rounded-full text-xs">
                        {transaction.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Balance After</span>
                    <span className="font-semibold text-emerald-600">
                      ${formatAmount(transaction.availableBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & User Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 h-[140px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {formatDate(transaction.transactionDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">
                        {formatTime(transaction.transactionDate)}
                      </span>
                    </div>
                    {initiatedBy ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Initiated By</span>
                        <div className="text-right">
                          <div className="font-medium text-xs">
                            {initiatedBy.firstName} {initiatedBy.lastName}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-sm opacity-0">
                        <span className="text-gray-600">Placeholder</span>
                        <span className="text-xs">-</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Status</span>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      <span className="font-medium capitalize text-emerald-600 text-xs">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Details - Simplified with link */}
            {transaction.metadata?.spinResult?.verification && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    Spin Verification
                  </h3>
                  <a
                    href={`/verify-spin?clientSeed=${
                      transaction.metadata.spinResult.verification.clientSeed
                    }&serverSeed=${
                      transaction.metadata.spinResult.verification.serverSeed
                    }&serverSeedHash=${
                      transaction.metadata.spinResult.verification.hash
                    }&nonce=${
                      transaction.metadata.spinResult.verification.nonce
                    }
                    &createdAt=${encodeURIComponent(
                      transaction.transactionDate
                    )}&normalized=${
                      transaction.metadata.spinResult.verification.normalized
                    }&boxSlug=${transaction.metadata?.boxDetails?.slug || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    View Full Verification
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Client Seed:</span>
                    <p className="font-mono text-xs bg-white p-2 rounded mt-1 truncate">
                      {transaction.metadata.spinResult.verification.clientSeed}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Result:</span>
                    <p className="font-mono text-xs bg-white p-2 rounded mt-1">
                      {transaction.metadata.spinResult.verification.normalized.toFixed(
                        6
                      )}
                    </p>
                  </div>
                </div>
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
}
