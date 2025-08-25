import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  ambassadors: [],
  loading: false,
  error: null,
}

const ambassadorsSlice = createSlice({
  name: "ambassadors",
  initialState,
  reducers: {
    setAmbassadors: (state, action) => {
      state.ambassadors = action.payload
      state.loading = false
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    clearAmbassadors: (state) => {
      state.ambassadors = []
      state.loading = false
      state.error = null
    },
  },
})

export const { setAmbassadors, setLoading, setError, clearAmbassadors } = ambassadorsSlice.actions
export default ambassadorsSlice.reducer
