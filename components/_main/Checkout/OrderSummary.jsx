"use client";
import { useCurrencyConvert } from "@/hooks/convertCurrency";
import { useCurrencyFormatter } from "@/hooks/formatCurrency";
import { Hexagon, Loader2, Info, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  platformFee = { percentage: "4%", amount: 0 }, // Platform fee object with default values
}) => {
  if (isCartEmpty) {
    return null;
  }

  const router = useRouter();
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const [discountCode, setDiscountCode] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const itemsTotal = cart.items.reduce((total, item) => {
    if (isPostSpinOrder) return 0;
    return total + (item.value || 0) * (item.quantity || 1);
  }, 0);

  // Calculate total incurred amount (base for platform fee calculation)
  const calculateIncurredAmount = () => {
    if (isPostSpinOrder) {
      // For post-spin orders, only shipping is charged
      return cart.shippingFee || 0;
    } else {
      // For regular orders, items total + shipping
      return itemsTotal + (cart.shippingFee || 0);
    }
  };

  const incurredAmount = calculateIncurredAmount();

  // Calculate total including platform fee and discount
  const calculateTotal = () => {
    let total = incurredAmount;

    // Add platform fee
    total += platformFee.amount || 0;

    // Subtract discount (only for regular orders)
    if (!isPostSpinOrder) {
      total -= cart.discountApplied.amount || 0;
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

    setIsApplyingDiscount(true);

    // Simulate API call delay
    setTimeout(() => {
      console.log("Applying discount code:", discountCode);
      // TODO: Add actual discount code validation and application logic here
      setIsApplyingDiscount(false);
      setDiscountCode(""); // Clear input after "applying"
      // For now, we'll just show a console log and reset the loading state
    }, 1000);
  };

  // Helper function to format price based on payment method
  const formatPrice = (amount) => {
    const numAmount =
      typeof amount === "number" ? amount : parseFloat(amount) || 0;

    // Format number with commas and 2 decimal places
    const formattedAmount = numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (paymentMethod === "wallet") {
      return (
        <span className="flex items-center">
          <Hexagon className="w-4 h-4 mr-1 text-[#11F2EB]" />
          {formattedAmount}
        </span>
      );
    } else {
      return `${fCurrency(cCurrency(formattedAmount))}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-4">
        {/* Discount Code Input - Only show for regular orders */}
        {!isPostSpinOrder && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label
              htmlFor="discount-code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Discount Code
            </label>
            <div className="space-y-2">
              <input
                type="text"
                id="discount-code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter discount code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#11F2EB] focus:border-transparent"
                disabled={isApplyingDiscount}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleApplyDiscount();
                  }
                }}
              />
              <button
                onClick={handleApplyDiscount}
                disabled={!discountCode.trim() || isApplyingDiscount}
                className="w-full px-4 py-2 bg-[#11F2EB] text-black text-sm font-medium rounded-md hover:bg-[#0DD4CE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isApplyingDiscount ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Tag className="w-4 h-4" />
                    Apply Discount Code
                  </>
                )}
              </button>
            </div>
            {/* Optional: Add discount code validation message area */}
            {/* <div className="mt-2 text-xs text-gray-500">
              Enter your discount code to save on your order
            </div> */}
          </div>
        )}

        {/* Items total - only show for regular orders */}
        {!isPostSpinOrder && (
          <div className="flex justify-between text-gray-600">
            <span>Items ({cart.items.length})</span>
            <span>{formatPrice(itemsTotal)}</span>
          </div>
        )}

        {/* Shipping fee */}
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          {shippingLoading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-1" size={14} />
              <span className="text-xs">Calculating...</span>
            </div>
          ) : (
            <span>{formatPrice(cart.shippingFee || 0)}</span>
          )}
        </div>

        {/* Platform Fee - Always show if there's any incurred amount */}
        {platformFee.amount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center">
              Platform Fee ({platformFee.percentage})
              <div className="group relative ml-1">
                <Info size={14} className="text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded w-48 text-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {platformFee.percentage} of total incurred amount
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </span>
            <span>{formatPrice(platformFee.amount)}</span>
          </div>
        )}

        {/* Discount - only for regular orders */}
        {!isPostSpinOrder && cart.discountApplied.amount > 0 && (
          <div className="flex justify-between text-[#11F2EB]">
            <span>Discount</span>
            <span className="flex items-center">
              {paymentMethod === "wallet" ? (
                <Hexagon className="w-4 h-4 mr-1 text-[#11F2EB]" />
              ) : (
                "-$"
              )}
              {cart.discountApplied.amount.toFixed(2)}
            </span>
          </div>
        )}

        {/* VAT Section - Commented out for now */}
        {/* 
        <div className="flex justify-between text-gray-600">
          <span>V.A.T ({isPostSpinOrder ? "0%" : "10%"})</span>
          <span>{formatPrice(isPostSpinOrder ? 0 : 20)}</span>
        </div>
        */}

        <hr className="my-2" />

        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>

        {isPostSpinOrder && (
          <div className="text-center text-sm text-[#11F2EB] bg-[#11F2EB] bg-opacity-10 p-2 rounded">
            🎉 You only pay for shipping + platform fee!
          </div>
        )}

        {/* Payment method indicator */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center text-sm text-gray-500">
            {paymentMethod === "wallet" ? (
              <>
                <Hexagon className="w-4 h-4 mr-1 text-[#11F2EB]" />
                <span>Prices in wallet credits</span>
              </>
            ) : (
              <span></span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {activeStep < 3 && (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
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
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#11F2EB] hover:bg-[#0DD4CE] text-black"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Processing...
              </>
            ) : paymentMethod === "wallet" ? (
              <>
                <Hexagon className="w-5 h-5 mr-2" />
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
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
