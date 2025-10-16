// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getShops, getHomeShops } from "../../services/index";

// export const fetchShops = createAsyncThunk(
//   "shops/fetchShops",
//   async (_, { rejectWithValue }) => {
//     try {
//       // console.log("fetching shops...");
//       const [allShops, homeShops] = await Promise.all([getShops()]);

//       return {
//         all: allShops?.data || [],
//         home: homeShops?.data || [],
//       };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// // ----------------------------------------------------------------------

// const initialState = {
//   shops: [],
//   loading: false,
//   error: null,
// };

// const slice = createSlice({
//   name: "shops",
//   initialState,
//   reducers: {
//     setShops(state, action) {
//       state.shops = action.payload;
//       state.loading = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchShops.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchShops.fulfilled, (state, action) => {
//         // console.log("Fetched shops successfully:", action.payload);
//         state.loading = false;
//         state.shops = [...action.payload.all, ...action.payload.home];
//         state.error = null;
//       })
//       .addCase(fetchShops.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Reducer
// export default slice.reducer;

// // Actions
// export const { setShops } = slice.actions;

// // ----------------------------------------------------------------------

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getShops, getHomeShops } from "../../services/index";

export const fetchShops = createAsyncThunk(
  "shops/fetchShops",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔄 fetchShops thunk started");

      // ✅ FIX: Call both functions if they both exist
      const promises = [getShops()];
      if (getHomeShops) {
        promises.push(getHomeShops());
      }

      const [allShops, homeShops] = await Promise.all(promises);

      console.log(
        "✅ Shops fetched - all:",
        allShops?.data?.length,
        "home:",
        homeShops?.data?.length
      );

      return {
        all: allShops?.data || [],
        home: homeShops?.data || [], // This will be empty array if homeShops is undefined
      };
    } catch (error) {
      console.error("❌ fetchShops error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ----------------------------------------------------------------------

const initialState = {
  shops: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setShops(state, action) {
      state.shops = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        console.log("🔄 fetchShops pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        console.log("✅ fetchShops fulfilled - merging shops");
        state.loading = false;
        // ✅ Safe merging
        state.shops = [
          ...(action.payload.all || []),
          // ...(action.payload.home || []),
        ];
        console.log("📊 Total shops after merge:", state.shops.length);
        state.error = null;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        console.log("❌ fetchShops rejected:", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setShops } = slice.actions;
