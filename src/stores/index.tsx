import { configureStore, Middleware, Store } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { addAthlete } from "./slices/athleteSlice";
import { Athlete } from "@types/bffTypes";

const crossSliceMiddleware: Middleware = () => (next) => (action: any) => {
  const result = next(action);
  return result;
};

const store: Store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crossSliceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
