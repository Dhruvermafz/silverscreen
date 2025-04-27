import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../actions/authApi";
import { userApi } from "../actions/userApi";
import { listApi } from "../actions/listApi";
import { reviewApi } from "../actions/reviewApi";
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      listApi.middleware,
      reviewApi.middleware
    ),
});

export default store;
