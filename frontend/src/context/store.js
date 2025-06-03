import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../actions/authApi";
import { userApi } from "../actions/userApi";
import { listApi } from "../actions/listApi";
import { reviewApi } from "../actions/reviewApi";
import { movieApi } from "../actions/movieApi";
import { newsroomApi } from "../actions/newsroomApi";
import { groupApi } from "../actions/groupApi";
import authReducer from "../actions/slices/authSlices";
import { adminApi } from "../actions/adminApi";
import { flagApi } from "../actions/flagApi";
const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [newsroomApi.reducerPath]: newsroomApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [flagApi.reducerPath]: flagApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      listApi.middleware,
      reviewApi.middleware,
      movieApi.middleware,
      groupApi.middleware,
      newsroomApi.middleware,
      adminApi.middleware,
      flagApi.middleware
    ),
});

export default store;
