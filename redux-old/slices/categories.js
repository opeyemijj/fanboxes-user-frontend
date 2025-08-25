import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAllCategories, getHomeCategories } from "../../services/index"

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const [allCategories, homeCategories] = await Promise.all([getAllCategories(), getHomeCategories()])

    return {
      all: allCategories?.data || [],
      home: homeCategories?.data || [],
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ----------------------------------------------------------------------

const initialState = {
  categories: [],
  newCategories: [],
  loading: false,
  error: null,
}

const slice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload.data
      state.newCategories = action.payload.newCategories
      state.loading = false
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
        state.categories = action.payload.all
        state.newCategories = action.payload.home
        state.error = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Reducer
export default slice.reducer

// Actions
export const { setCategories } = slice.actions

// ----------------------------------------------------------------------
