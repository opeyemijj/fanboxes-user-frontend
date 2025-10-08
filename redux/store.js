import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reducer } from "./rootReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "product",
    "categories",
    "shops",
    "user",
    "ambassadors",
    "cartOrder",
    "settings",
  ], // Only persist these slices
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer, // Use persisted reducer instead of plain reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// For TypeScript projects, these would be:
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
