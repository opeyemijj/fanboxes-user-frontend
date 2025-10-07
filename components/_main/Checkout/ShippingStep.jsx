import AddressManager from "@/components/_main/AddressDetails/AddressManager";
import { Loader2 } from "lucide-react";

// Shipping Step Component
const ShippingStep = ({
  cCurrency,
  fCurrency,
  onShowAddressModal,
  shippingLoading,
  userData,
  cart,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <AddressManager user={userData} showHeader={true} compact={true} />

      {/* Shipping fee display */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Shipping Fee:</span>
          {shippingLoading ? (
            <div className="flex items-center text-gray-500">
              <Loader2 className="animate-spin mr-2" size={16} />
              Calculating...
            </div>
          ) : (
            <span className="font-medium text-gray-900">
              {/* ${cart.shippingFee?.toFixed(2)} */}
              {fCurrency(cCurrency(cart.shippingFee || 0))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingStep;
