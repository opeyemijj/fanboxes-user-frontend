// components/TransactionsPagination.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TransactionsPagination({
  page,
  limit,
  loading,
  pagination,
  onPageChange,
}) {
  if (!pagination) return <></>;

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: summary */}
      <div className="text-sm text-gray-700">
        Showing {(page - 1) * limit + 1} to{" "}
        {Math.min(page * limit, pagination.totalCount)} of{" "}
        {pagination.totalCount} transactions
      </div>

      {/* Right: pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous */}
        <button
          disabled={!pagination.hasPrev || loading}
          onClick={() => onPageChange(page - 1)}
          className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
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
            }
          )}

          {pagination.totalPages > 5 && page < pagination.totalPages - 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </div>

        {/* Next */}
        <button
          disabled={!pagination.hasNext || loading}
          onClick={() => onPageChange(page + 1)}
          className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
