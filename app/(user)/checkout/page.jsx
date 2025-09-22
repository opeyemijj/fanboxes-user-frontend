"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Header from "@/components/_main/Header";
import Footer from "@/components/_main/Footer";
import AddressManager from "@/components/_main/AddressDetails/AddressManager";
import { getShippingFeePercentage, createOrder } from "@/services/order/index";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  selectCart,
  selectIsPostSpinOrder,
  updateShippingFee,
  updateUserDetails,
  updateOrderNote,
  setLoading,
  setError,
  clearError,
  selectError,
  clearCart,
} from "@/redux/slices/cartOrder";
import {
  Package,
  Truck,
  CreditCard,
  Loader2,
  CheckCircle,
  X,
  User,
  Mail,
  Phone,
  Globe,
  Building,
  Hexagon,
  Bitcoin,
  Wallet,
} from "lucide-react";

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector(selectCart);
  const userData = useSelector((state) => state?.user?.user || null);
  const isPostSpinOrder = useSelector(selectIsPostSpinOrder);
  const error = useSelector(selectError);

  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wait for component to mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    // Initialize order note from cart after mount
    setOrderNote(cart.note || "");
  }, []);

  // Listen for error changes and show toast
  useEffect(() => {
    if (error) {
      toastError(error);
      // Clear error after showing toast
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (userData) {
      const user = {
        _id: userData._id,
        email: userData.email,
        firstName: userData.firtName,
        lastName: userData?.lastName || "",
        phone: userData?.phone || "",
        shippingAddress: userData.shippingAddress || null,
      };
      dispatch(updateUserDetails(user));
    }
  }, [userData]);

  // Calculate shipping fee on component mount and when user details change
  useEffect(() => {
    if (mounted && cart.items.length > 0) {
      calculateShipping();
    }
  }, [mounted, cart.items]);

  const calculateShipping = async () => {
    if (!mounted) return;

    setShippingLoading(true);
    try {
      console.log("Fetching shipping fee...");
      const res = await getShippingFeePercentage();
      console.log({ res });

      if (!res?.success || !res?.data) {
        dispatch(setError("Failed to calculate shipping fee"));
        return;
      }

      const shippingRule = res.data;
      let shippingFee = 0;

      if (shippingRule.valueType === "percentage") {
        const itemsTotal = cart.items.reduce((total, item) => {
          // if (isPostSpinOrder) return 0;
          return total + (item.value || 0) * (item.quantity || 1);
        }, 0);

        // Calculate percentage of items total
        shippingFee = parseInt(
          ((itemsTotal * shippingRule.value) / 100).toFixed(0)
        );
        console.log(
          `Shipping calculation: ${itemsTotal} * ${shippingRule.value}% = ${shippingFee}`
        );
      } else {
        // Fixed amount shipping
        shippingFee = parseInt(shippingRule.value);
        console.log(`Fixed shipping fee: $${shippingFee}`);
      }

      dispatch(updateShippingFee(shippingFee));
    } catch (error) {
      console.error("Error calculating shipping:", error);
      dispatch(setError("Failed to calculate shipping fee"));
    } finally {
      setShippingLoading(false);
    }
  };

  const handleOrderNoteChange = (note) => {
    if (!mounted) return;
    setOrderNote(note);
    dispatch(updateOrderNote(note));
  };

  const handleCompleteOrder = async () => {
    if (!cart.user?.shippingAddress) {
      dispatch(setError("Please add shipping address before completing order"));
      return;
    }

    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const orderPayload = {
        shippingFee: cart.shippingFee,
        totalAmountPaid: cart.totalAmountPaid,
        discountApplied: cart.discountApplied,
        status: "pending",
        items: cart.items,
        note: cart.note,
        user: {
          _id: cart.user._id,
          email: cart.user.email,
          firstName: cart.user.firstName,
          lastName: cart.user.lastName,
          phone: cart.user.phone,
          shippingAddress: cart.user.shippingAddress,
        },
        spinData: cart.spinData,
        taxApplied: {
          percentage: isPostSpinOrder ? "0%" : "10%",
          amount: isPostSpinOrder ? 0 : 20, // This should be calculated properly
        },
        paymentMethod: paymentMethod,
      };

      console.log("Submitting order:", orderPayload);

      const response = await createOrder(orderPayload);

      if (response.success) {
        // Order created successfully
        dispatch(clearCart());
        // You can redirect to success page or show success message
        console.log("Order created successfully:", response.data);
        dispatch(setError(null));

        // For now, just show success alert
        toastSuccess("Order created successfully!");

        // Redirect to orders page or home
        setTimeout(() => {
          router.replace("/");
        }, 100);
      } else {
        toastError(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      if (error.status === 500) {
        dispatch(setError("Failed to complete order"));
      } else {
        dispatch(
          setError(error.response?.data?.message || "Failed to complete order")
        );
      }
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const steps = [
    { id: 1, name: "Review", icon: Package },
    { id: 2, name: "Shipping", icon: Truck },
    { id: 3, name: "Payment", icon: CreditCard },
  ];

  // Don't render anything until component is mounted on client
  if (!mounted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center min-h-96">
              <Loader2 className="animate-spin text-[#11F2EB]" size={32} />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {isPostSpinOrder ? "Complete Your Won Item Order" : "Checkout"}
            </h1>
            <p className="text-gray-600">
              {isPostSpinOrder
                ? "Just pay for shipping and get your prize!"
                : "Review your order and complete payment"}
            </p>
          </div>

          {/* Progress Steps - Refined Responsive Design */}
          <div className="mb-8">
            {/* Desktop View - Fixed Connector Lines */}
            <div className="hidden sm:flex items-center justify-between relative">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep >= step.id;
                const isCompleted = activeStep > step.id;
                const isLast = index === steps.length - 1;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative z-10 flex-1"
                  >
                    {/* Step circle and connectors */}
                    <div className="flex items-center w-full justify-center">
                      {/* Left connector - only show if not first step */}
                      {index > 0 && (
                        <div
                          className={`flex-1 h-0.5 ${
                            isCompleted || isActive
                              ? "bg-[#11F2EB]"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                      {/* Step circle */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 mx-2 ${
                          isCompleted
                            ? "bg-[#11F2EB] border-[#11F2EB] text-white"
                            : isActive
                            ? "border-[#11F2EB] bg-white text-[#11F2EB]"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Icon size={20} />
                        )}
                      </div>

                      {/* Right connector - only show if not last step */}
                      {!isLast && (
                        <div
                          className={`flex-1 h-0.5 ${
                            activeStep > index + 1
                              ? "bg-[#11F2EB]"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>

                    {/* Step label */}
                    <span
                      className={`mt-3 text-sm font-medium text-center px-1 ${
                        isActive || isCompleted
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile step indicator */}
            <div className="sm:hidden mt-4 text-center">
              <span className="text-sm font-medium text-gray-600">
                Step {activeStep} of {steps.length}
              </span>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-[#11F2EB] h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${((activeStep - 1) / (steps.length - 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Review Items */}
              {activeStep === 1 && <ReviewStep />}

              {/* Step 2: Shipping */}
              {activeStep === 2 && (
                <ShippingStep
                  onShowAddressModal={() => setShowAddressModal(true)}
                  shippingLoading={shippingLoading}
                  userData={userData}
                />
              )}

              {/* Step 3: Payment */}
              {activeStep === 3 && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  orderNote={orderNote}
                  onOrderNoteChange={handleOrderNoteChange}
                  userData={userData}
                />
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                shippingLoading={shippingLoading}
                onCompleteOrder={handleCompleteOrder}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>

          {/* Address Modal */}
          {showAddressModal && (
            <AddressModal onClose={() => setShowAddressModal(false)} />
          )}

          {/* Loading Overlay */}
          {isSubmitting && <LoadingOverlay />}
        </div>
      </div>
      <Footer />
    </>
  );
};

// Loading Overlay Component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-xl">
      <Loader2 className="animate-spin text-[#11F2EB] mb-4" size={48} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Processing Order
      </h3>
      <p className="text-gray-600 text-center">
        Please wait while we complete your order...
      </p>
    </div>
  </div>
);

// Review Step Component
const ReviewStep = () => {
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
                      ${item.value?.toFixed(2) || "0.00"}
                    </span>
                  ) : (
                    <span className="bg-[#11F2EB] bg-opacity-10 text-[#11F2EB] px-3 py-1 rounded-full text-sm font-medium">
                      🎉 FREE - Won in spin!
                    </span>
                  )}

                  <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
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
                      ${((item.value || 0) * (item.quantity || 1)).toFixed(2)}
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
              $
              {cart.items
                .reduce(
                  (total, item) =>
                    total + (item.value || 0) * (item.quantity || 1),
                  0
                )
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Shipping Step Component
const ShippingStep = ({ onShowAddressModal, shippingLoading, userData }) => {
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
              $15.00 {/* Replace with actual shipping fee */}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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

// Order Summary Component
const OrderSummary = ({
  activeStep,
  setActiveStep,
  shippingLoading,
  onCompleteOrder,
  isSubmitting,
}) => {
  const cart = useSelector(selectCart);
  const isPostSpinOrder = useSelector(selectIsPostSpinOrder);

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
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Items ({cart.items.length})</span>
          <span>${itemsTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          {shippingLoading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-1" size={14} />
              <span className="text-xs">Calculating...</span>
            </div>
          ) : (
            <span>${cart.shippingFee?.toFixed(2) || "0.00"}</span>
          )}
        </div>

        {cart.discountApplied.amount > 0 && (
          <div className="flex justify-between text-[#11F2EB]">
            <span>Discount</span>
            <span>-${cart.discountApplied.amount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>V.A.T ({isPostSpinOrder ? "0%" : "10%"})</span>
          <span>${isPostSpinOrder ? (0).toFixed(2) : (20).toFixed(2)}</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>${cart.totalAmountPaid?.toFixed(2) || "0.00"}</span>
        </div>

        {isPostSpinOrder && (
          <div className="text-center text-sm text-[#11F2EB] bg-[#11F2EB] bg-opacity-10 p-2 rounded">
            🎉 You only pay for shipping!
          </div>
        )}
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
            ) : (
              "Complete Order"
            )}
          </button>
        )}

        {activeStep > 1 && (
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

// Address Modal Component
const AddressModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const userData = useSelector((state) => state?.user?.user || null);

  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.shippingAddress?.address || "",
    city: userData?.shippingAddress?.city || "",
    state: userData?.shippingAddress?.state || "",
    zip: userData?.shippingAddress?.zip || "",
    country: userData?.shippingAddress?.country || "",
  });

  const handleSubmit = () => {
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
    };

    dispatch(updateUserDetails(userData));
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {userData?.shippingAddress
                ? "Edit Address"
                : "Add Shipping Address"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.zip}
                  onChange={(e) => handleChange("zip", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#11F2EB] focus:border-[#11F2EB]"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-[#11F2EB] hover:bg-[#0DD4CE] text-black rounded-lg font-medium transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
