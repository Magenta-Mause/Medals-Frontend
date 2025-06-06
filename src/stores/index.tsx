import { configureStore, Middleware } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

export interface SliceState<T> {
  data: T[];
  state: "idle" | "loading" | "failed";
  error: string | null;
}

const crossSliceMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);

  return result;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crossSliceMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
