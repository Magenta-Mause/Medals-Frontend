import { Trainer } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "..";

const accessRequestSlice = createSlice({
  name: "accessRequestSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as SliceState<Trainer>,
  reducers: {
    addManagingTrainer(state, action: PayloadAction<Trainer>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.data.push(action.payload);
    },
    updateManagingTrainer(state, action: PayloadAction<Trainer>) {
      const index = state.data.findIndex(
        (athlete) => athlete.id == action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    removeManagingTrainer(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setManagingTrainer(state, action: PayloadAction<Trainer[]>) {
      state.data = action.payload;
    },
  },
});

const {
  addManagingTrainer,
  updateManagingTrainer,
  removeManagingTrainer,
  setManagingTrainer,
} = accessRequestSlice.actions;

export {
  addManagingTrainer,
  updateManagingTrainer,
  removeManagingTrainer,
  setManagingTrainer,
};
export default accessRequestSlice.reducer;
