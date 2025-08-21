import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "../../lib/api"

export const fetchAmbassadors = createAsyncThunk("ambassadors/fetchAmbassadors", async (_, { rejectWithValue }) => {
  try {
    const data = await apiService.fetchAmbassadors()
    return data
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message)
  }
})

const ambassadorsSlice = createSlice({
  name: "ambassadors",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearAmbassadors: (state) => {
      state.items = []
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmbassadors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAmbassadors.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.lastFetched = Date.now()
      })
      .addCase(fetchAmbassadors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAmbassadors, clearError } = ambassadorsSlice.actions
export default ambassadorsSlice.reducer
