import { configureStore } from "@reduxjs/toolkit"
import { reducer } from "./rootReducer"

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// For TypeScript projects, these would be:
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
