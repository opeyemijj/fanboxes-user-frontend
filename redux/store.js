import { configureStore } from "@reduxjs/toolkit"
import { reducer } from "./rootReducer"
import { ReturnType } from "react"

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
