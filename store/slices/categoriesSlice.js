import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "../../lib/api"

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const data = await apiService.fetchCategories()
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearCategories: (state) => {
      state.items = []
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCategories, clearError } = categoriesSlice.actions
export default categoriesSlice.reducer
