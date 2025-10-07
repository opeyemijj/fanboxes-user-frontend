"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
// import Header from "@/components/_main/Header";
// import Footer from "@/components/_main/Footer";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
  Loader,
} from "lucide-react";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  selectShippingFee,
  selectDiscountApplied,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  setCheckoutStep,
  updateShippingFee,
  selectDirectBuyItems,
} from "@/redux/slices/cartOrder";
import { useRouter } from "next/navigation";
import { getShippingFeePercentage } from "@/services/order";
import { useDebounce } from "@/hooks/useDebounce";
import { useCurrencyConvert } from "@/hooks/convertCurrency";
import { useCurrencyFormatter } from "@/hooks/formatCurrency";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector(selectDirectBuyItems);
  const cartTotal = useSelector(selectCartTotal);
  const shippingFee = useSelector(selectShippingFee);
  const discountApplied = useSelector(selectDiscountApplied);

  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();

  // Count unique items, not total quantities
  const uniqueItemCount = cartItems.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debounce the cart total value
  const cartTotalValue = cartItems.reduce((total, item) => {
    return total + (item.value || 0) * (item.quantity || 1);
  }, 0);

  const debouncedCartTotal = useDebounce(cartTotalValue, 500); // delay in ms

  useEffect(() => {
    calculateShipping();
  }, [isMounted, debouncedCartTotal]);

  async function calculateShipping() {
    if (!isMounted || cartItems.length < 1) {
      setShippingLoading(false);
      dispatch(updateShippingFee(0));
      return;
    }

    setShippingLoading(true);
    try {
      console.log("Fetching shipping fee...");
      const res = await getShippingFeePercentage();
      console.log({ res });

      let calculatedShippingFee = 0;

      if (res?.success && res?.data) {
        const shippingRule = res.data;

        if (shippingRule.valueType === "percentage") {
          const itemsTotal = cartItems.reduce((total, item) => {
            return total + (item.value || 0) * (item.quantity || 1);
          }, 0);

          calculatedShippingFee = parseInt(
            ((itemsTotal * shippingRule.value) / 100).toFixed(0)
          );
        } else {
          calculatedShippingFee = parseInt(shippingRule.value);
        }
      }

      dispatch(updateShippingFee(calculatedShippingFee));
    } catch (error) {
      console.error("Error calculating shipping:", error);
      dispatch(updateShippingFee(0));
    } finally {
      setShippingLoading(false);
    }
  }

  const handleQuantityUpdate = (itemSlug, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateItemQuantity({ itemSlug, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemSlug) => {
    dispatch(removeItemFromCart({ itemSlug }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout...");
    router.push("/checkout");
  };

  // Calculate subtotal (items only)
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.value * item.quantity;
  }, 0);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <>
        {/* <Header /> */}
        <div className="min-h-screen bg-gray-50 py-8 mt-20">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Header Skeleton */}
            <div className="mb-8 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items Skeleton */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="flex gap-4 mb-6 pb-6 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="flex justify-between">
                          <div className="h-8 bg-gray-200 rounded w-24"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
                  <div className="space-y-3 mb-6">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <>
        {/* <Header /> */}
        <div className="min-h-screen bg-gray-50 py-8 mt-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start
                shopping to fill it up!
              </p>
              <button
                className="bg-[#11F2EB] hover:bg-[#0DD4CE] text-black font-semibold px-8 py-3 rounded-lg transition-colors"
                onClick={() => router.push("/mystery-boxes")}
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

  return (
    <>
      {/* <Header /> */}
      <div className="min-h-screen bg-gray-50 py-8 mt-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-1">
                  {uniqueItemCount} {uniqueItemCount === 1 ? "item" : "items"}{" "}
                  in your cart
                </p>
              </div>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.slug} className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src={item.images?.[0]?.url || "/placeholder.svg"}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
                                {item.name}
                              </h3>
                              {item.brand && (
                                <p className="text-gray-500 text-sm mt-1">
                                  {item.brand}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                <span className="font-bold text-gray-900">
                                  {/* ${item.value?.toLocaleString() || "0"} */}
                                  {fCurrency(cCurrency(item?.value))}
                                </span>
                                {item.weight && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {item.weight}oz
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.slug)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Quantity Controls & Total */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.slug,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.slug,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {/* $
                                {(
                                  (item.value || 0) * item.quantity
                                ).toLocaleString()} */}
                                {fCurrency(
                                  cCurrency((item.value || 0) * item.quantity)
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({uniqueItemCount} items)</span>
                    <span>
                      {/* ${subtotal.toLocaleString()} */}
                      {fCurrency(cCurrency(subtotal))}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingLoading ? (
                        <Loader className="w-4 h-4 animate-spin text-gray-400" />
                      ) : shippingFee > 0 ? (
                        `${fCurrency(cCurrency(shippingFee))}`
                      ) : (
                        "Calculated at checkout"
                      )}
                    </span>
                  </div>

                  {discountApplied.type !== "none" && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Discount (
                        {discountApplied.type === "percentage-off"
                          ? `${discountApplied.amount}%`
                          : "Fixed"}
                        )
                      </span>
                      <span>
                        -$
                        {discountApplied.type === "percentage-off"
                          ? fCurrency(
                              cCurrency(
                                ((subtotal + shippingFee) *
                                  discountApplied.amount) /
                                  100
                              )
                            )
                          : discountApplied.amount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {/* ${cartTotal.toLocaleString()} */}
                        {fCurrency(cCurrency(cartTotal))}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#11F2EB] hover:bg-[#0DD4CE] text-black font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4" />
                  <span>Secure packaging & tracking included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#11F2EB]/10 rounded-full flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-[#11F2EB]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Fast Shipping
                </h3>
                <p className="text-sm text-gray-600">
                  Quick & reliable delivery
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#11F2EB]/10 rounded-full flex items-center justify-center mb-3">
                  <ShoppingCart className="w-6 h-6 text-[#11F2EB]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Secure Checkout
                </h3>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#11F2EB]/10 rounded-full flex items-center justify-center mb-3">
                  <Trash2 className="w-6 h-6 text-[#11F2EB]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Easy Returns
                </h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default CartPage;
