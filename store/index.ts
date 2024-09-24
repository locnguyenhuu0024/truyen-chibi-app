import { configureStore } from "@reduxjs/toolkit";
import comicsReducer from "./comicsSlice";
import chaptersReducer from "./chaptersSlice";
import categoriesSlice from "./categoriesSlice";
import authReducer from "./authSlice";
import historiesReducer from "./historiesSlice";

export const store = configureStore({
  reducer: {
    comics: comicsReducer,
    chapters: chaptersReducer,
    categories: categoriesSlice,
    auth: authReducer,
    histories: historiesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Increase the threshold to 100ms
        warnAfter: 100,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
