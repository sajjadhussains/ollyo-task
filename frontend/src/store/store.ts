import { configureStore } from "@reduxjs/toolkit";
import { deviceApi } from "./api/deviceApi";

export const store = configureStore({
  reducer: {
    [deviceApi.reducerPath]: deviceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types for serialization checks
          "deviceApi/executeQuery/pending",
          "deviceApi/executeQuery/fulfilled",
          "deviceApi/executeQuery/rejected",
        ],
      },
    }).concat(deviceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

