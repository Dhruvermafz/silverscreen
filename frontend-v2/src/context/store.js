import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../actions/authApi";
import { userApi } from "../actions/userApi";
import { listApi } from "../actions/listApi";
import { reviewApi } from "../actions/reviewApi";
import { movieApi } from "../actions/movieApi";
import { newsroomApi } from "../actions/newsroomApi";
import { groupApi } from "../actions/groupApi";
import { contactApi } from "../actions/contactApi";
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [groupApi.reducerPath]: groupApi.reducer,
    [newsroomApi.reducerPath]: newsroomApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
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
      contactApi.middleware
    ),
});

export default store;
