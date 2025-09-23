import { CreditCard, Hexagon, Bitcoin, Wallet } from "lucide-react";

// Custom radio button component
const CustomRadio = ({ checked, onChange, disabled, className = "" }) => (
  <div
    className={`relative inline-block h-5 w-5 rounded-full border-2 ${
      checked ? "border-[#11F2EB] bg-[#11F2EB]" : "border-gray-300 bg-white"
    } ${
      disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
    } ${className}`}
    onClick={disabled ? undefined : onChange}
  >
    {checked && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-white"></div>
      </div>
    )}
  </div>
);

// Payment Step Component
const PaymentStep = ({
  paymentMethod,
  setPaymentMethod,
  orderNote,
  onOrderNoteChange,
  userData,
}) => {
  const currentBalance = userData?.availableBalance || 0;

  const paymentMethods = [
    {
      id: "wallet",
      name: "Wallet Balance",
      icon: Wallet,
      enabled: true,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      enabled: false,
      description: "Coming soon",
    },
    {
      id: "crypto",
      name: "Cryptocurrency",
      icon: Bitcoin,
      enabled: false,
      description: "Coming soon",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Payment Method
        </h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = paymentMethod === method.id;

            return (
              <div
                key={method.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isSelected
                    ? "border-[#11F2EB] bg-[#11F2EB] bg-opacity-5"
                    : method.enabled
                    ? "border-gray-200 hover:border-gray-300 cursor-pointer"
                    : "border-gray-100 bg-gray-50 cursor-not-allowed"
                }`}
                onClick={() => method.enabled && setPaymentMethod(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CustomRadio
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method.id)}
                      disabled={!method.enabled}
                    />
                    <Icon
                      className={`ml-3 ${
                        method.enabled ? "text-gray-600" : "text-gray-400"
                      }`}
                      size={20}
                    />
                    <div className="ml-3">
                      <span
                        className={`font-medium ${
                          method.enabled ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {method.name}
                      </span>
                      {method.id === "wallet" ? (
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                          Available balance:
                          <span className="flex items-center ml-1 font-medium">
                            <Hexagon className="w-4 h-4 mr-1 text-[#11F2EB]" />
                            {currentBalance.toFixed(2)}
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">
                          {method.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {!method.enabled && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      Disabled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Wallet balance info */}
        {paymentMethod === "wallet" && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <Wallet className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                Your wallet balance will be used for this purchase
              </span>
            </div>
            <div className="flex items-center mt-2 text-green-700">
              <span className="text-sm">Available: </span>
              <span className="font-medium ml-1 flex items-center">
                <Hexagon className="w-4 h-4 mr-1" />
                {currentBalance.toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Order Note */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Order Note (Optional)
        </h3>
        <textarea
          value={orderNote}
          onChange={(e) => onOrderNoteChange(e.target.value)}
          placeholder="Add any special instructions for your order..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB] resize-none"
        />
      </div>
    </div>
  );
};

export default PaymentStep;
