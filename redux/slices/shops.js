import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getShops, getHomeShops } from "../../services/index"

export const fetchShops = createAsyncThunk("shops/fetchShops", async (_, { rejectWithValue }) => {
  try {
    const [allShops, homeShops] = await Promise.all([getShops(), getHomeShops()])

    return {
      all: allShops?.data || [],
      home: homeShops?.data || [],
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ----------------------------------------------------------------------

const initialState = {
  shops: [],
  loading: false,
  error: null,
}

const slice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setShops(state, action) {
      state.shops = action.payload
      state.loading = false
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
        state.shops = [...action.payload.all, ...action.payload.home]
        state.error = null
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Reducer
export default slice.reducer

// Actions
export const { setShops } = slice.actions

// ----------------------------------------------------------------------
