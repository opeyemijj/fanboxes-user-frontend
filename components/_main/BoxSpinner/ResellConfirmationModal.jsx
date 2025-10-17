// components/_main/ResellConfirmationModal.jsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./GameDialogues";
import { Button } from "@/components/Button";
import { Loader, Hexagon } from "lucide-react";
import { useCurrencyConvert } from "@/hooks/convertCurrency";
import { useCurrencyFormatter } from "@/hooks/formatCurrency";

const ResellConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  winningItem,
  resellRule,
  cashToCreditConvRate,
  isLoading = false,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();

  // Helper function to calculate resell amount (self-contained)
  const calculateResellAmount = (originalValue, resellRule) => {
    if (!resellRule) return originalValue * 0.8; // Fallback to 80%

    if (resellRule.valueType === "percentage") {
      return originalValue * (resellRule.value / 100);
    } else {
      return resellRule.value || 0;
    }
  };

  // Helper function to get resell display text (self-contained)
  const getResellDisplayText = (originalValue, resellRule) => {
    if (!resellRule)
      return `Based on 80% resell value of ${fCurrency(
        cCurrency(originalValue)
      )}`;

    if (resellRule.valueType === "percentage") {
      return `Based on ${resellRule.value}% resell value of ${fCurrency(
        cCurrency(originalValue)
      )}`;
    } else {
      return `Fixed resell price of ${fCurrency(
        cCurrency(resellRule.value || 0)
      )}`;
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error in resell confirmation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading && !isProcessing) {
      onClose();
    }
  };

  if (!winningItem) return null;

  const originalValue = winningItem.value;
  const conversionRate = cashToCreditConvRate?.value || 1;
  const finalAmount = calculateResellAmount(originalValue, resellRule);
  const creditsAmount = finalAmount / conversionRate;
  const displayText = getResellDisplayText(originalValue, resellRule);

  return (
    <Dialog open={isOpen} onOpenChange={handleBackdropClick}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] bg-white z-[10000] fixed p-0 overflow-hidden rounded-2xl shadow-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="px-6 py-16">
          {/* Close Button - Disabled during loading */}
          <button
            onClick={() => !isLoading && onClose()}
            disabled={isLoading || isProcessing}
            className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full ${
              isLoading || isProcessing
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-white/80 hover:bg-white"
            } transition-colors z-20 shadow-sm`}
          >
            <svg
              className={`w-5 h-5 ${
                isLoading || isProcessing ? "text-gray-400" : "text-gray-700"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-center text-gray-800">
              Confirm Token Claim
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Review the conversion details before proceeding
            </DialogDescription>
          </DialogHeader>

          {/* Conversion Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-5">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Original Value</div>
                <div className="text-lg font-bold text-gray-800">
                  {fCurrency(cCurrency(originalValue))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  {resellRule?.valueType === "percentage"
                    ? "Resell Rate"
                    : "Fixed Price"}
                </div>
                <div className="text-lg font-bold text-amber-600">
                  {resellRule?.valueType === "percentage"
                    ? `${resellRule.value}%`
                    : `${fCurrency(cCurrency(resellRule?.value))}`}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">You will receive:</span>
                <span className="text-lg font-bold text-green-600">
                  {fCurrency(cCurrency(finalAmount))}
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">
                  Credits equivalent:
                </span>
                <span className="text-lg font-bold text-gray-800 flex items-center">
                  <Hexagon
                    className="h-4 w-4 ml-1.5 text-[#FFD700]"
                    fill="#FFD700"
                  />
                  {creditsAmount.toFixed(0).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {displayText} • 1 Credit ={" "}
                {fCurrency(cCurrency(conversionRate))}
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-5">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-500 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm text-yellow-700">
                This action cannot be undone. The item will be converted to
                tokens at the current resell rate.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="w-full h-11 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              onClick={onClose}
              disabled={isLoading || isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="w-full h-11 bg-gradient-to-r from-[#11F2EB] to-cyan-600 
                     hover:from-cyan-500 hover:to-[#11F2EB] text-slate-800 font-medium rounded-lg shadow-sm flex items-center justify-center"
              onClick={handleConfirm}
              disabled={isLoading || isProcessing}
            >
              {isLoading || isProcessing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Claim"
              )}
            </Button>
          </div>

          {/* Loading Overlay */}
          {(isLoading || isProcessing) && (
            <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-cyan-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">
                  Processing your claim...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Please wait while we process your credits
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResellConfirmationModal;
