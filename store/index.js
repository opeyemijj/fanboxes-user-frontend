import { configureStore } from "@reduxjs/toolkit"
import { persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import logger from "redux-logger"
import productsReducer from "./slices/productsSlice"
import shopsReducer from "./slices/shopsSlice"
import ambassadorsReducer from "./slices/ambassadorsSlice"
import categoriesReducer from "./slices/categoriesSlice"
import { ReturnType } from "react"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["products", "shops", "ambassadors", "categories"], // Only persist these slices
}

const rootReducer = {
  products: productsReducer,
  shops: shopsReducer,
  ambassadors: ambassadorsReducer,
  categories: categoriesReducer,
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== "production",
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
