"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Header from "@/components/_main/Header";
import Footer from "@/components/_main/Footer";
import AddressManager from "@/components/_main/AddressDetails/AddressManager";
import EmptyCartState from "@/components/_main/Checkout/EmptyCartState";
import ChoiceStep from "@/components/_main/Checkout/ChoiceStep";
import ReviewStep from "@/components/_main/Checkout/ReviewStep";
import ShippingStep from "@/components/_main/Checkout/ShippingStep";
import PaymentStep from "@/components/_main/Checkout/PaymentStep";
import OrderSummary from "@/components/_main/Checkout/OrderSummary";
import {
  getCashToCreditConversionRate,
  getResellPercentage,
} from "@/services/boxes";
import {
  getShippingFeePercentage,
  createOrder,
  resellWonItem,
} from "@/services/order/index";
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
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Home,
} from "lucide-react";
import ResellConfirmationModal from "@/components/_main/BoxSpinner/ResellConfirmationModal";
import { resellSpinForCredits } from "@/services/boxes";
import { updateUserAvailableBalance } from "@/redux/slices/user";

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

  // New states for resell functionality
  const [userChoice, setUserChoice] = useState(null); // 'ship' or 'resell'
  const [showChoiceStep, setShowChoiceStep] = useState(false);
  const [showResellModal, setShowResellModal] = useState(false);
  const [resellData, setResellData] = useState({
    winningItem: null,
    resellRule: null,
    cashToCreditConvRate: null,
  });

  // Check if cart is empty
  const isCartEmpty = !cart.items || cart.items.length === 0;

  // Check URL params or state to determine if we should show choice or skip to shipping
  useEffect(() => {
    if (isCartEmpty) return;

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get("action"); // 'ship' or 'resell' or null

    if (isPostSpinOrder) {
      if (action === "ship") {
        setUserChoice("ship");
        setShowChoiceStep(false);
        setActiveStep(1); // Start with review step
      } else if (action === "resell") {
        setUserChoice("resell");
        setShowChoiceStep(false);
        // Prepare resell data
        const firstItem = cart.items[0];
        setResellData({
          ...resellData,
          winningItem: firstItem,
        });
        setShowResellModal(true);
      } else {
        // Show choice step if no specific action is specified
        setShowChoiceStep(true);
        setActiveStep(0);
      }
    } else {
      // Regular order, skip choice step
      setUserChoice("ship");
      setShowChoiceStep(false);
      setActiveStep(1);
    }
  }, [isPostSpinOrder, cart.items, isCartEmpty]);

  useEffect(() => {
    scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  // Wait for component to mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    // Initialize order note from cart after mount
    setOrderNote(cart.note || "");
    fetchCashToCreditConversionRate();
    fetchCurrentResellPercentage();
  }, []);

  // Listen for error changes and show toast
  useEffect(() => {
    if (error) {
      toastError(error);
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
    if (mounted && !isCartEmpty && userChoice === "ship") {
      calculateShipping();
    }
  }, [mounted, cart.items, userChoice, isCartEmpty]);

  function setResellRule(rr) {
    setResellData({ ...resellData, resellRule: rr });
  }

  function setConversionRate(rr) {
    setResellData({ ...resellData, cashToCreditConvRate: rr });
  }

  async function fetchCashToCreditConversionRate() {
    try {
      const res = await getCashToCreditConversionRate();
      if (res?.success) {
        const { _id, value, valueType, slug } = res.data;
        setConversionRate({ _id, value, valueType, slug });
      }
    } catch (error) {
      console.error("err fetching cash to credit conversion rate:", error);
    }
  }

  async function fetchCurrentResellPercentage() {
    try {
      const res = await getResellPercentage();
      if (res?.success) {
        const { _id, value, valueType, slug } = res.data;
        setResellRule({ _id, value, valueType, slug });
      }
    } catch (error) {
      console.error("err fetching resell perc:", error);
    }
  }

  // Calculate resell value based on actual resell percentage
  const calculateResellValue = () => {
    if (isCartEmpty) return 0;

    const itemValue = cart.items.reduce(
      (total, item) => total + (item.value || 0),
      0
    );

    if (resellData.resellRule && resellData.resellRule.value) {
      const resellPercentage = resellData.resellRule.value;
      return Number(((itemValue * resellPercentage) / 100).toFixed(0));
    }

    // Default to 75% if no resell rule is available
    return Number(itemValue * (0.75).toFixed(0));
  };

  // Calculate credits from resell value using conversion rate
  const calculateCreditsFromResell = () => {
    const resellValue = calculateResellValue();

    if (
      resellData.cashToCreditConvRate &&
      resellData.cashToCreditConvRate.value
    ) {
      const conversionRate = resellData.cashToCreditConvRate.value;
      return resellValue * conversionRate;
    }

    // Default conversion rate of 1:1 if no rate is available
    return resellValue;
  };

  const calculateShipping = async () => {
    if (!mounted || isCartEmpty) return;

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
          return total + (item.value || 0) * (item.quantity || 1);
        }, 0);

        shippingFee = parseInt(
          ((itemsTotal * shippingRule.value) / 100).toFixed(0)
        );
        console.log(
          `Shipping calculation: ${itemsTotal} * ${shippingRule.value}% = ${shippingFee}`
        );
      } else {
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

  const handleUserChoice = (choice) => {
    setUserChoice(choice);
    setShowChoiceStep(false);

    if (choice === "ship") {
      setActiveStep(1);
    } else if (choice === "resell") {
      // Prepare resell data and show modal
      const firstItem = cart.items[0];
      setResellData({
        ...resellData,
        winningItem: firstItem,
      });
      setShowResellModal(true);
    }
  };

  const handleResellConfirm = async () => {
    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const response = await resellSpinForCredits({
        spinId: cart.spinData._id,
      });

      if (response.success) {
        dispatch(clearCart());
        toastSuccess("You have been credited successfully");
        // update balance in redux
        dispatch(
          updateUserAvailableBalance(
            response?.data?.transaction.availableBalance
          )
        );
        setShowResellModal(false);

        setTimeout(() => {
          router.replace("/account?tab=transactions");
        }, 100);
      } else {
        toastError(response.message || "Failed to resell item");
      }
    } catch (error) {
      console.error("Resell error:", error);
      dispatch(
        setError(error.response?.data?.message || "Failed to resell item")
      );
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const handleCompleteOrder = async () => {
    if (isCartEmpty) {
      dispatch(setError("Your cart is empty"));
      return;
    }

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
          amount: isPostSpinOrder ? 0 : 20,
        },
        paymentMethod: paymentMethod,
      };

      console.log("Submitting order:", orderPayload);

      const response = await createOrder(orderPayload);

      if (response.success) {
        dispatch(clearCart());
        console.log("Order created successfully:", response.data);
        dispatch(setError(null));

        toastSuccess("Order created successfully!");

        setTimeout(() => {
          router.replace("/account?tab=orders");
        }, 50);
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

  // Show empty state if cart is empty
  if (isCartEmpty) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-4xl mx-auto">
            <EmptyCartState onGoHome={() => router.push("/")} />
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
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {isPostSpinOrder
                ? userChoice === "resell"
                  ? "Resell Your Won Item"
                  : "Complete Your Won Item Order"
                : "Checkout"}
            </h1>
            <p className="text-gray-600">
              {isPostSpinOrder
                ? userChoice === "resell"
                  ? "Convert your prize to wallet credits instantly"
                  : "Just pay for shipping and get your prize!"
                : "Review your order and complete payment"}
            </p>
          </div>

          {/* Choice Step for Won Items */}
          {showChoiceStep && isPostSpinOrder && (
            <ChoiceStep
              onChoice={handleUserChoice}
              cart={cart}
              resellValue={calculateResellValue()}
              resellPercentage={resellData.resellRule?.value || 75}
            />
          )}

          {/* Regular checkout flow (when userChoice is 'ship' or not a post-spin order) */}
          {(userChoice === "ship" || !isPostSpinOrder) && activeStep >= 1 && (
            <>
              {/* Progress Steps */}
              <div className="mb-8">
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
                        <div className="flex items-center w-full justify-center">
                          {index > 0 && (
                            <div
                              className={`flex-1 h-0.5 ${
                                isCompleted || isActive
                                  ? "bg-[#11F2EB]"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}

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

                <div className="sm:hidden mt-4 text-center">
                  <span className="text-sm font-medium text-gray-600">
                    Step {activeStep} of {steps.length}
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-[#11F2EB] h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((activeStep - 1) / (steps.length - 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {activeStep === 1 && <ReviewStep />}
                  {activeStep === 2 && (
                    <ShippingStep
                      cart={cart}
                      onShowAddressModal={() => setShowAddressModal(true)}
                      shippingLoading={shippingLoading}
                      userData={userData}
                      onBackToChoice={
                        isPostSpinOrder
                          ? () => {
                              setShowChoiceStep(true);
                              setUserChoice(null);
                              setActiveStep(0);
                            }
                          : null
                      }
                    />
                  )}
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
                    setShowChoiceStep={setShowChoiceStep}
                    isCartEmpty={isCartEmpty}
                    isPostSpinOrder={isPostSpinOrder}
                    cart={cart}
                    paymentMethod={paymentMethod}
                  />
                </div>
              </div>
            </>
          )}

          {/* Resell Confirmation Modal */}
          <ResellConfirmationModal
            isOpen={showResellModal}
            onClose={() => {
              setShowResellModal(false);
              setShowChoiceStep(true);
              setUserChoice(null);
            }}
            onConfirm={handleResellConfirm}
            winningItem={resellData.winningItem}
            resellRule={resellData.resellRule}
            cashToCreditConvRate={resellData.cashToCreditConvRate}
            isLoading={isSubmitting}
            resellValue={calculateResellValue()}
            creditsValue={calculateCreditsFromResell()}
          />

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
