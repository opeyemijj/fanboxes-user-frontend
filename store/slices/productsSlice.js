import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "../../lib/api"

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const data = await apiService.fetchProducts()
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = []
      state.error = null
    },
    clearError: (state) => {
      state.error = null
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
        state.items = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProducts, clearError } = productsSlice.actions
export default productsSlice.reducer
