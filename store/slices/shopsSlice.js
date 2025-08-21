import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "../../lib/api"

export const fetchShops = createAsyncThunk("shops/fetchShops", async (_, { rejectWithValue }) => {
  try {
    const data = await apiService.fetchShops()
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

const shopsSlice = createSlice({
  name: "shops",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearShops: (state) => {
      state.items = []
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearShops, clearError } = shopsSlice.actions
export default shopsSlice.reducer
