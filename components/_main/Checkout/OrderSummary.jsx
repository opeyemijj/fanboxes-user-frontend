"use client";
import { useState } from "react";
import { Hexagon, Loader2, Info, Tag, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCurrencyConvert } from "@/hooks/convertCurrency";
import { useCurrencyFormatter } from "@/hooks/formatCurrency";

// Order Summary Component
const OrderSummary = ({
  activeStep,
  setActiveStep,
  shippingLoading,
  onCompleteOrder,
  isSubmitting,
  setShowChoiceStep,
  isCartEmpty,
  cart,
  isPostSpinOrder,
  paymentMethod,
  resellDataLoading,
  platformFee = { percentage: "4%", amount: 0 },
  // New discount props
  discountApplied = {
    type: "none",
    amount: 0,
    codeUsed: "",
    name: "",
    discountValue: 0,
  },
  discountError = "",
  isApplyingDiscount = false,
  onApplyDiscount,
}) => {
  if (isCartEmpty) {
    return null;
  }

  const router = useRouter();
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const [discountCode, setDiscountCode] = useState("");

  const itemsTotal = cart.items.reduce((total, item) => {
    if (isPostSpinOrder) return 0;
    return total + (item.value || 0) * (item.quantity || 1);
  }, 0);

  // Calculate total incurred amount (base for platform fee calculation)
  const calculateIncurredAmount = () => {
    if (isPostSpinOrder) {
      return cart.shippingFee || 0;
    } else {
      return itemsTotal + (cart.shippingFee || 0);
    }
  };

  const incurredAmount = calculateIncurredAmount();

  // Calculate subtotal (items + shipping + platform fee)
  const calculateSubtotal = () => {
    return incurredAmount + (platformFee.amount || 0);
  };

  const subtotal = calculateSubtotal();

  // Calculate total including discount
  const calculateTotal = () => {
    let total = subtotal;

    // Subtract discount (only for regular orders)
    if (!isPostSpinOrder) {
      total -= discountApplied.amount || 0;
    }

    return total;
  };

  const totalAmount = calculateTotal();

  const canProceed = () => {
    if (activeStep === 1) return cart.items.length > 0;
    if (activeStep === 2) return cart.user?.shippingAddress && !shippingLoading;
    return true;
  };

  const handleNext = () => {
    if (canProceed() && activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }

    if (activeStep === 1 && isPostSpinOrder) {
      setShowChoiceStep(true);
      setActiveStep(0);
    }

    if (activeStep === 1 && !isPostSpinOrder) {
      router.back();
    }
  };

  // Handle discount code application
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    await onApplyDiscount(discountCode);
    setDiscountCode(""); // Clear input after applying
  };

  // Helper function to format price based on payment method
  const formatPrice = (amount, showMinus = false) => {
    const numAmount =
      typeof amount === "number" ? amount : parseFloat(amount) || 0;

    const formattedAmount = numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const prefix = showMinus && numAmount > 0 ? "-" : "";

    if (paymentMethod === "wallet") {
      return (
        <span className="flex items-center">
          {prefix}
          <Hexagon className="w-4 h-4 mr-1 text-[#11F2EB]" />
          {formattedAmount}
        </span>
      );
    } else {
      return `${prefix}${fCurrency(cCurrency(formattedAmount))}`;
    }
  };

  // Format discount display text - FIXED: Use discountValue for percentage
  const formatDiscountText = () => {
    if (discountApplied.type === "percent") {
      // Use discountValue from API response for percentage display
      const percentageValue = discountApplied.discountValue || 0;
      return `-${percentageValue}% off`;
    } else {
      return formatPrice(discountApplied.amount, true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-2.5 mb-4">
        {/* Discount Code Input - Only show for regular orders */}
        {!isPostSpinOrder && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label
              htmlFor="discount-code"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Discount Code
            </label>
            <div className="space-y-1.5">
              <input
                type="text"
                id="discount-code"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                }}
                placeholder="Enter discount code"
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent"
                disabled={isApplyingDiscount}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleApplyDiscount();
                  }
                }}
              />

              {/* Success message display */}
              {discountApplied.amount > 0 && (
                <div className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded border border-green-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span className="font-medium">
                    {discountApplied.name} applied! {formatDiscountText()}
                  </span>
                </div>
              )}

              {/* Error message display */}
              {discountError && (
                <div className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded border border-red-200">
                  {discountError}
                </div>
              )}

              <button
                onClick={handleApplyDiscount}
                disabled={!discountCode.trim() || isApplyingDiscount}
                className="w-full px-3 py-1.5 bg-[#11F2EB] text-black text-sm font-medium rounded hover:bg-[#0DD4CE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isApplyingDiscount ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Tag className="w-3.5 h-3.5" />
                    Apply Discount
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Items total - only show for regular orders */}
        {!isPostSpinOrder && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items ({cart.items.length})</span>
            <span>{formatPrice(itemsTotal)}</span>
          </div>
        )}

        {/* Shipping fee */}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          {shippingLoading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-1" size={12} />
              <span className="text-xs">Calculating...</span>
            </div>
          ) : (
            <span>{formatPrice(cart.shippingFee || 0)}</span>
          )}
        </div>

        {/* Platform Fee - Always show if there's any incurred amount */}
        {platformFee.amount > 0 && (
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center">
              Platform Fee ({platformFee.percentage})
              <div className="group relative ml-1">
                <Info size={12} className="text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded w-40 text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {platformFee.percentage} of total incurred amount
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </span>
            <span>{formatPrice(platformFee.amount)}</span>
          </div>
        )}

        {/* Subtotal */}
        {!isPostSpinOrder && (
          <div className="flex justify-between text-sm font-medium text-gray-700 border-t border-gray-200 pt-2">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        )}

        {/* Discount - only for regular orders */}
        {!isPostSpinOrder && discountApplied.amount > 0 && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>Discount</span>
            <span className="flex items-center">
              {paymentMethod === "wallet" ? (
                <>
                  -
                  <Hexagon className="w-3.5 h-3.5 mx-0.5 text-green-600" />
                  {discountApplied.amount.toFixed(2)}
                </>
              ) : (
                formatPrice(discountApplied.amount, true)
              )}
            </span>
          </div>
        )}

        <hr className="my-1.5" />

        <div className="flex justify-between text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>

        {isPostSpinOrder && (
          <div className="text-center text-xs text-[#11F2EB] bg-[#11F2EB] bg-opacity-10 p-1.5 rounded">
            🎉 You only pay for shipping + platform fee!
          </div>
        )}

        {/* Payment method indicator */}
        <div className="pt-1.5 border-t border-gray-200">
          <div className="flex items-center justify-center text-xs text-gray-500">
            {paymentMethod === "wallet" ? (
              <>
                <Hexagon className="w-3.5 h-3.5 mr-1 text-[#11F2EB]" />
                <span>Prices in wallet credits</span>
              </>
            ) : (
              <span></span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {activeStep < 3 && (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors text-sm ${
              canProceed()
                ? "bg-[#11F2EB] hover:bg-[#0DD4CE] text-black"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {activeStep === 2 ? "Continue to Payment" : "Continue"}
          </button>
        )}

        {activeStep === 3 && (
          <button
            onClick={onCompleteOrder}
            disabled={isSubmitting || !canProceed()}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center text-sm ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#11F2EB] hover:bg-[#0DD4CE] text-black"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Processing...
              </>
            ) : paymentMethod === "wallet" ? (
              <>
                <Hexagon className="w-4 h-4 mr-1.5" />
                Pay with Credits
              </>
            ) : (
              "Complete Order"
            )}
          </button>
        )}

        {activeStep > 0 && (
          <button
            onClick={handleBack}
            disabled={isSubmitting || resellDataLoading}
            className="w-full border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
