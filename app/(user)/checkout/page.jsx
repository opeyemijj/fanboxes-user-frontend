"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import TokenVerifier from "@/components/TokenVerifier";
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

  // Critical: Initialize state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [orderNote, setOrderNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New states for resell functionality
  const [resellDataLoading, setResellDataLoading] = useState(true);
  const [userChoice, setUserChoice] = useState(null);
  const [showChoiceStep, setShowChoiceStep] = useState(false);
  const [showResellModal, setShowResellModal] = useState(false);
  const [resellData, setResellData] = useState({
    winningItem: null,
    resellRule: null,
    cashToCreditConvRate: null,
  });

  // Check if cart is empty - but only after mounted
  const isCartEmpty = mounted ? !cart.items || cart.items.length === 0 : true;

  // Use functional updates to prevent stale closure issues
  const updateResellData = useCallback((updater) => {
    setResellData((prevData) => {
      const newData =
        typeof updater === "function" ? updater(prevData) : updater;
      console.log("Updating resell data:", { prevData, newData });
      return newData;
    });
  }, []);

  // Better state update functions
  const setResellRule = useCallback(
    (rr) => {
      updateResellData((prevData) => ({
        ...prevData,
        resellRule: rr,
      }));
    },
    [updateResellData]
  );

  const setConversionRate = useCallback(
    (cr) => {
      updateResellData((prevData) => ({
        ...prevData,
        cashToCreditConvRate: cr,
      }));
    },
    [updateResellData]
  );

  // Improved data fetching with better error handling
  const fetchCashToCreditConversionRate = useCallback(async () => {
    try {
      console.log("Fetching cash to credit conversion rate...");
      const res = await getCashToCreditConversionRate();
      if (res?.success && res?.data) {
        const { _id, value, valueType, slug } = res.data;
        const conversionData = { _id, value, valueType, slug };
        console.log("Conversion rate fetched:", conversionData);
        setConversionRate(conversionData);
        return conversionData;
      } else {
        console.warn("Failed to fetch conversion rate:", res);
        return null;
      }
    } catch (error) {
      console.error("Error fetching cash to credit conversion rate:", error);
      return null;
    }
  }, [setConversionRate]);

  const fetchCurrentResellPercentage = useCallback(async () => {
    try {
      console.log("Fetching resell percentage...");
      const res = await getResellPercentage();
      if (res?.success && res?.data) {
        const { _id, value, valueType, slug } = res.data;
        const resellRuleData = { _id, value, valueType, slug };
        console.log("Resell percentage fetched:", resellRuleData);
        setResellRule(resellRuleData);
        return resellRuleData;
      } else {
        console.warn("Failed to fetch resell percentage:", res);
        return null;
      }
    } catch (error) {
      console.error("Error fetching resell percentage:", error);
      return null;
    }
  }, [setResellRule]);

  // Main initialization effect with improved sequencing
  useEffect(() => {
    const initializeComponent = async () => {
      console.log("Initializing checkout component...");
      setMounted(true);
      setOrderNote(cart.note || "");

      // Start fetching data but don't wait for it to complete before setting up post-spin logic
      const dataPromises = Promise.all([
        fetchCashToCreditConversionRate(),
        fetchCurrentResellPercentage(),
      ]);

      // Handle URL params and post-spin logic immediately
      if (cart.items && cart.items.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get("action");
        const firstItem = cart.items[0];

        if (isPostSpinOrder) {
          // Set winning item immediately
          updateResellData((prevData) => ({
            ...prevData,
            winningItem: firstItem,
          }));

          if (action === "ship") {
            setUserChoice("ship");
            setShowChoiceStep(false);
            setActiveStep(1);
          } else if (action === "resell") {
            setUserChoice("resell");
            setShowChoiceStep(true);
            // Don't show resell modal until data is loaded
            setResellDataLoading(true);
          } else {
            setShowChoiceStep(true);
            setActiveStep(0);
          }
        } else {
          setUserChoice("ship");
          setShowChoiceStep(false);
          setActiveStep(1);
        }
      }

      // Wait for data to complete and then finish initialization
      try {
        const [conversionRate, resellRule] = await dataPromises;
        console.log("Data fetching completed:", { conversionRate, resellRule });

        // If user chose resell and we were waiting for data, now show the modal
        const urlParams = new URLSearchParams(window.location.search);
        if (
          isPostSpinOrder &&
          urlParams.get("action") === "resell" &&
          conversionRate &&
          resellRule
        ) {
          setShowResellModal(true);
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
      } finally {
        setResellDataLoading(false);
      }
    };

    initializeComponent();
  }, [
    fetchCashToCreditConversionRate,
    fetchCurrentResellPercentage,
    updateResellData,
    cart.items,
    isPostSpinOrder,
  ]);

  // Scroll to top when step changes
  useEffect(() => {
    if (mounted && activeStep) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeStep, mounted]);

  // Listen for error changes and show toast
  useEffect(() => {
    if (mounted && error) {
      toastError(error);
      dispatch(clearError());
    }
  }, [error, dispatch, mounted]);

  // Update user details when userData changes
  useEffect(() => {
    if (mounted && userData) {
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
  }, [userData, mounted, dispatch]);

  // Calculate shipping fee when needed
  useEffect(() => {
    if (mounted && !isCartEmpty && userChoice === "ship") {
      calculateShipping();
    }
  }, [mounted, cart.items, userChoice, isCartEmpty]);

  // Improved resell value calculation with better fallbacks
  const calculateResellValue = useCallback(() => {
    if (isCartEmpty) return 0;

    const itemValue = cart.items.reduce(
      (total, item) => total + (item.value || 0),
      0
    );

    console.log("Calculating resell value:", {
      itemValue,
      resellRule: resellData.resellRule,
      resellPercentage: resellData.resellRule?.value,
    });

    if (resellData.resellRule?.value != null) {
      const resellPercentage = resellData.resellRule.value;
      const calculatedValue = Math.round((itemValue * resellPercentage) / 100);
      console.log(
        `Using fetched resell percentage: ${resellPercentage}% = $${calculatedValue}`
      );
      return calculatedValue;
    }

    // Fallback to 75%
    const fallbackValue = Math.round(itemValue * 0.75);
    console.warn(`Using fallback resell percentage: 75% = $${fallbackValue}`);
    return fallbackValue;
  }, [isCartEmpty, cart.items, resellData.resellRule]);

  // Improved credits calculation
  const calculateCreditsFromResell = useCallback(() => {
    const resellValue = calculateResellValue();

    console.log("Calculating credits from resell:", {
      resellValue,
      conversionRate: resellData.cashToCreditConvRate?.value,
    });

    if (resellData.cashToCreditConvRate?.value != null) {
      const conversionRate = resellData.cashToCreditConvRate.value;
      const credits = resellValue * conversionRate;
      console.log(
        `Using fetched conversion rate: ${conversionRate} = ${credits} credits`
      );
      return credits;
    }

    // Default 1:1 conversion
    console.warn(
      `Using fallback conversion rate: 1:1 = ${resellValue} credits`
    );
    return resellValue;
  }, [calculateResellValue, resellData.cashToCreditConvRate]);

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

  // Separate function to handle user choice changes
  const handleUserChoice = useCallback(
    (choice) => {
      console.log("User choice:", choice);
      setUserChoice(choice);
      setShowChoiceStep(false);

      if (choice === "ship") {
        setActiveStep(1);
      } else if (choice === "resell") {
        // Ensure we have the winning item in resell data
        const firstItem = cart.items[0];
        updateResellData((prevData) => ({
          ...prevData,
          winningItem: firstItem || prevData.winningItem,
        }));
        setShowResellModal(true);
      }
    },
    [cart.items, updateResellData]
  );

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

  // CRITICAL: Don't render anything until component is mounted on client
  if (!mounted) {
    return null; // This prevents hydration mismatch
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
    <TokenVerifier>
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
          {showChoiceStep &&
            isPostSpinOrder &&
            (resellDataLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2
                  className="animate-spin text-[#11F2EB] mr-2"
                  size={24}
                />
                <span>Loading resell options...</span>
              </div>
            ) : (
              <ChoiceStep
                onChoice={handleUserChoice}
                cart={cart}
                resellValue={calculateResellValue()}
                resellPercentage={resellData.resellRule?.value || 75}
              />
            ))}

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
                    const isFirst = index === 0;
                    const isLast = index === steps.length - 1;

                    return (
                      <div
                        key={step.id}
                        className="flex flex-col items-center relative z-10"
                        style={{
                          flex: isFirst || isLast ? "0 0 auto" : "1",
                        }}
                      >
                        <div className="flex items-center w-full justify-center">
                          {/* Left connector line - only show after first step */}
                          {index > 0 && (
                            <div
                              className={`flex-1 h-0.5 ${
                                isCompleted || isActive
                                  ? "bg-[#11F2EB]"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}

                          {/* Step icon */}
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

                          {/* Right connector line - only show before last step */}
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

                        {/* Step name - positioned directly below the icon */}
                        <span
                          className={`mt-3 text-sm font-medium text-center whitespace-nowrap ${
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
                    resellDataLoading={resellDataLoading}
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
              // if (!userChoice) {
              //   setShowChoiceStep(true);
              //   setUserChoice(null);
              // }
            }}
            onConfirm={handleResellConfirm}
            winningItem={resellData.winningItem || cart.items?.[0]}
            resellRule={resellData.resellRule}
            cashToCreditConvRate={resellData.cashToCreditConvRate}
            isLoading={isSubmitting || resellDataLoading}
            resellValue={calculateResellValue()}
            creditsValue={calculateCreditsFromResell()}
          />

          {/* Loading Overlay */}
          {isSubmitting && <LoadingOverlay />}
        </div>
      </div>
      <Footer />
    </TokenVerifier>
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

export default CheckoutScreen;
