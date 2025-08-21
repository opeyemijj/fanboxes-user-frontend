import { sum, map, filter, uniqBy } from "lodash"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAllProducts, getFeaturedProducts, getBestSellingProducts } from "../../services/index"

export const fetchProducts = createAsyncThunk("product/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const [allProducts, featuredProducts, bestSellingProducts] = await Promise.all([
      getAllProducts(),
      getFeaturedProducts(),
      getBestSellingProducts(),
    ])

    return {
      all: allProducts?.data || [],
      featured: featuredProducts?.data || [],
      bestSelling: bestSellingProducts?.data || [],
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ----------------------------------------------------------------------

const shippingFee = Number.parseInt(process.env.SHIPPING_FEE)
const initialState = {
  products: [],
  loading: false,
  error: null,
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: shippingFee,
    billing: null,
  },
  boxAndItemData: {},
  spinData: {},
}

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload

      const subtotal = sum(cart.map((product) => (product.priceSale || product.price) * product.quantity))
      const discount = cart.length === 0 ? 0 : state.checkout.discount
      const shipping = cart.length === 0 ? 0 : shippingFee
      const billing = cart.length === 0 ? null : state.checkout.billing

      state.checkout.cart = cart
      state.checkout.discount = discount
      state.checkout.shipping = shipping
      state.checkout.billing = billing
      state.checkout.subtotal = subtotal
      state.checkout.total = subtotal + (Number.parseInt(shipping) || 0)
    },

    addCart(state, action) {
      const product = action.payload
      const updatedProduct = {
        ...product,
        sku: `${product.sku}-${product.size}-${product.color}`,
      }
      const isEmptyCart = state.checkout.cart.length === 0
      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, updatedProduct]
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product.sku === updatedProduct.sku
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + product.quantity,
            }
          }
          return _product
        })
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, updatedProduct], "sku")
    },

    selectBoxAndItem: (state, action) => {
      state.boxAndItemData = action.payload
    },

    selectSpinItem: (state, action) => {
      state.spinData = action.payload
    },

    clearCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.sku !== action.payload)

      state.checkout.cart = updateCart
    },
    deleteCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.sku !== action.payload)

      state.checkout.cart = updateCart
    },

    resetCart(state) {
      state.checkout.activeStep = 0
      state.checkout.cart = []
      state.checkout.total = 0
      state.checkout.subtotal = 0
      state.checkout.discount = 0
      state.checkout.billing = null
    },

    increaseQuantity(state, action) {
      const productSku = action.payload
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity + 1,
          }
        }
        return product
      })

      state.checkout.cart = updateCart
    },

    decreaseQuantity(state, action) {
      const productSku = action.payload
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity - 1,
          }
        }
        return product
      })

      state.checkout.cart = updateCart
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload
    },

    applyDiscount(state, action) {
      const discount = action.payload
      state.checkout.discount = discount
      state.checkout.total = state.checkout.subtotal - discount
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = [...action.payload.all, ...action.payload.featured, ...action.payload.bestSelling]
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Reducer
export default slice.reducer

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  clearCart,
  deleteCart,
  createBilling,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  selectBoxAndItem,
  selectSpinItem,
} = slice.actions
