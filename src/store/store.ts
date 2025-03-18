import { alertApi } from "./api/alertApi";
import { authApi } from "./api/authApi";
import { configureStore } from "@reduxjs/toolkit";
import { entityApi } from "@/features/entities/api/entityApi";
import { transactionApi } from "@/features/transactions/api/transactionApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    // [alertApi.reducerPath]: alertApi.reducer,
    // [entityApi.reducerPath]: entityApi.reducer,
    // [transactionApi.reducerPath]: transactionApi.reducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware)
  // .concat(alertApi.middleware)
  // .concat(transactionApi.middleware)
  // .concat(entityApi.middleware)
})
