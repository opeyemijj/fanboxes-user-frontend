import { Hexagon, Loader2 } from "lucide-react";

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
}) => {
  if (isCartEmpty) {
    return null;
  }

  const itemsTotal = cart.items.reduce((total, item) => {
    if (isPostSpinOrder) return 0;
    return total + (item.value || 0) * (item.quantity || 1);
  }, 0);

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
  };

  // Helper function to format price based on payment method
  const formatPrice = (amount) => {
    if (paymentMethod === "wallet") {
      return (
        <span className="flex items-center">
          <Hexagon className="w-4 h-4 mr-1 text-[#11F2EB]" />
          {amount.toFixed(2)}
        </span>
      );
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Items ({cart.items.length})</span>
          <span>{formatPrice(itemsTotal)}</span>
        </div>

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

        {cart.discountApplied.amount > 0 && (
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

        <div className="flex justify-between text-gray-600">
          <span>V.A.T ({isPostSpinOrder ? "0%" : "10%"})</span>
          <span>{formatPrice(isPostSpinOrder ? 0 : 20)}</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(cart.totalAmountPaid || 0)}</span>
        </div>

        {isPostSpinOrder && (
          <div className="text-center text-sm text-[#11F2EB] bg-[#11F2EB] bg-opacity-10 p-2 rounded">
            🎉 You only pay for shipping!
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
              <span>Prices in USD ($)</span>
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
            disabled={isSubmitting}
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
