import { createSlice } from "@reduxjs/toolkit";

// ----------------------------------------------------------------------

// initial state
const initialState = {
  cart: {
    items: [],
    shippingFee: 0,
    totalAmountPaid: 0,
    discountApplied: {
      amount: 0,
      type: "none",
    },
    note: "",
    user: null,
    spinData: null,
    orderType: "direct",
  },
  isLoading: false,
  error: null,
  checkoutStep: "cart",
};

// slice
const slice = createSlice({
  name: "cartOrder",
  initialState,

  reducers: {
    addItemToCart(state, action) {
      const { item, quantity = 1 } = action.payload;

      const existingItem = state.cart.items.find(
        (cartItem) => cartItem.slug === item.slug
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + quantity;
      } else {
        state.cart.items.push({
          ...item,
          quantity,
        });
      }

      state.cart.totalAmountPaid = calculateTotal(state.cart);
      state.cart.orderType = "direct";
    },

    addItemToCart2(state, action) {
      const { item, quantity = 1, shop } = action.payload;

      const existingItem = state.cart.items.find(
        (cartItem) => cartItem.slug === item.slug
      );

      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + quantity;
      } else {
        //reset entire cart to only contain newly added item
        state.cart.items = [
          {
            ...item,
            quantity,
          },
        ];
      }

      state.cart.totalAmountPaid = calculateTotal(state.cart);
      state.cart.orderType = "direct";
      state.cart.shop = shop;
    },

    addWonItemToCart(state, action) {
      const { item, spinData } = action.payload;

      state.cart.items = [
        {
          ...item,
          quantity: 1,
          isWonItem: true,
        },
      ];

      state.cart.spinData = spinData;
      state.cart.shippingFee = 0;
      state.cart.totalAmountPaid = 0;
      state.cart.orderType = "post-spin";
    },

    removeItemFromCart(state, action) {
      const { itemSlug } = action.payload;
      state.cart.items = state.cart.items.filter(
        (item) => item.slug !== itemSlug
      );

      state.cart.totalAmountPaid = calculateTotal(state.cart);

      if (state.cart.items.length === 0) {
        state.cart.orderType = "direct";
        state.cart.spinData = null;
      }
    },

    updateItemQuantity(state, action) {
      const { itemSlug, quantity } = action.payload;
      const item = state.cart.items.find(
        (cartItem) => cartItem.slug === itemSlug
      );

      if (item && quantity > 0) {
        item.quantity = quantity;
        state.cart.totalAmountPaid = calculateTotal(state.cart);
      }
    },

    updateShippingFee(state, action) {
      state.cart.shippingFee = action.payload;
      state.cart.totalAmountPaid = calculateTotal(state.cart);
    },

    applyDiscount(state, action) {
      const { amount, type } = action.payload;
      state.cart.discountApplied = { amount, type };
      state.cart.totalAmountPaid = calculateTotal(state.cart);
    },

    removeDiscount(state) {
      state.cart.discountApplied = { amount: 0, type: "none" };
      state.cart.totalAmountPaid = calculateTotal(state.cart);
    },

    updateUserDetails(state, action) {
      state.cart.user = action.payload;
    },

    updateOrderNote(state, action) {
      state.cart.note = action.payload;
    },

    setCheckoutStep(state, action) {
      state.checkoutStep = action.payload;
    },

    clearCart(state) {
      state.cart = {
        items: [],
        shippingFee: 0,
        totalAmountPaid: 0,
        discountApplied: {
          amount: 0,
          type: "none",
        },
        note: "",
        user: null,
        spinData: null,
        orderType: "direct",
        shop: null,
      };
      state.checkoutStep = "cart";
      state.error = null;
    },

    setLoading(state, action) {
      state.isLoading = action.payload;
    },

    setError(state, action) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },
});

// Helper function to calculate total amount
const calculateTotal = (cart) => {
  let itemsTotal = 0;

  if (cart.orderType === "direct") {
    itemsTotal = cart.items.reduce((total, item) => {
      const itemValue = item.value || 0;
      const quantity = item.quantity || 1;
      return total + itemValue * quantity;
    }, 0);
  }

  const totalBeforeDiscount = itemsTotal + cart.shippingFee;

  let finalTotal = totalBeforeDiscount;
  if (cart.discountApplied.type !== "none") {
    if (cart.discountApplied.type === "percentage-off") {
      const discountAmount =
        (totalBeforeDiscount * cart.discountApplied.amount) / 100;
      finalTotal = totalBeforeDiscount - discountAmount;
    } else if (cart.discountApplied.type === "price-slash") {
      finalTotal = totalBeforeDiscount - cart.discountApplied.amount;
    }
  }

  return Math.max(0, finalTotal);
};

// Reducer
export default slice.reducer;

// Actions
export const {
  addItemToCart,
  addItemToCart2,
  addWonItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  updateShippingFee,
  applyDiscount,
  removeDiscount,
  updateUserDetails,
  updateOrderNote,
  setCheckoutStep,
  clearCart,
  setLoading,
  setError,
  clearError,
} = slice.actions;

// ----------------------------------------------------------------------

// Selectors
export const selectCart = (state) => state.cartOrder.cart;
export const selectCartItems = (state) => state.cartOrder.cart.items;
export const selectCartTotal = (state) => state.cartOrder.cart.totalAmountPaid;
export const selectIsPostSpinOrder = (state) =>
  state.cartOrder.cart.orderType === "post-spin";
export const selectSpinData = (state) => state.cartOrder.cart.spinData;
export const selectShippingFee = (state) => state.cartOrder.cart.shippingFee;
export const selectDiscountApplied = (state) =>
  state.cartOrder.cart.discountApplied;
export const selectCheckoutStep = (state) => state.cartOrder.checkoutStep;
export const selectIsLoading = (state) => state.cartOrder.isLoading;
export const selectError = (state) => state.cartOrder.error;
export const selectCartItemsCount = (state) =>
  state.cartOrder.cart.items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
export const selectDirectBuyItems = (state) =>
  state.cartOrder.cart.orderType === "direct" ? state.cartOrder.cart.items : [];
