import { useSelector } from "react-redux";
import { selectCart, selectIsPostSpinOrder } from "@/redux/slices/cartOrder";
import { Package } from "lucide-react";

// Review Step Component
const ReviewStep = ({ cCurrency, fCurrency }) => {
  const cart = useSelector(selectCart);
  const isPostSpinOrder = useSelector(selectIsPostSpinOrder);

  // Function to truncate long descriptions
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isPostSpinOrder ? "Your Won Item" : "Order Items"}
        </h2>
        {isPostSpinOrder && (
          <div className="bg-[#11F2EB] bg-opacity-10 text-[#11F2EB] px-3 py-1 rounded-full text-sm font-medium">
            🎉 Won Item
          </div>
        )}
      </div>

      <div className="space-y-6">
        {cart.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            {/* Image Section */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="text-gray-400" size={28} />
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              {/* Item Name */}
              <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                {item.name}
              </h3>

              {/* Item Description */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {truncateDescription(item.description)}
                </p>
                {item.description && item.description.length > 120 && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const desc = e.target.previousElementSibling;
                      if (desc.textContent.includes("...")) {
                        desc.textContent = item.description;
                        e.target.textContent = "Show less";
                      } else {
                        desc.textContent = truncateDescription(
                          item.description
                        );
                        e.target.textContent = "Read more";
                      }
                    }}
                    className="text-[#11F2EB] text-xs font-medium hover:text-[#0DD4CE] transition-colors mt-1"
                  >
                    Read more
                  </button>
                )}
              </div>

              {/* Price and Quantity */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  {!isPostSpinOrder ? (
                    <span className="font-bold text-gray-900 text-lg">
                      {/* ${item.value?.toFixed(2) || "0.00"} */}
                      {fCurrency(cCurrency(item?.value || 0))}
                    </span>
                  ) : (
                    <span className="bg-[#11F2EB] bg-opacity-10 text-[#11F2EB] px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                      🎉 FREE - Won in spin!
                    </span>
                  )}

                  <div className="flex items-center text-xs md:text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    <span className="font-medium">Qty:</span>
                    <span className="ml-1 font-semibold">
                      {item.quantity || 1}
                    </span>
                  </div>
                </div>

                {/* Total for this item (only for direct purchases) */}
                {!isPostSpinOrder && item.quantity > 1 && (
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Total: </span>
                    <span className="font-semibold text-gray-900">
                      {/* ${((item.value || 0) * (item.quantity || 1)).toFixed(2)} */}
                      {fCurrency(
                        cCurrency((item.value || 0) * (item.quantity || 1))
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary for multiple items */}
      {cart.items.length > 1 && !isPostSpinOrder && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Items total ({cart.items.length})
            </span>
            <span className="font-semibold text-gray-900">
              {/* $
              {cart.items
                .reduce(
                  (total, item) =>
                    total + (item.value || 0) * (item.quantity || 1),
                  0
                )
                .toFixed(2)} */}
              {fCurrency(
                cCurrency(
                  cart.items.reduce(
                    (total, item) =>
                      total + (item.value || 0) * (item.quantity || 1),
                    0
                  )
                )
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
