import { Trainer } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "..";

const trainerSlice = createSlice({
  name: "trainerSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as SliceState<Trainer>,
  reducers: {
    addTrainer(state, action: PayloadAction<Trainer>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.data.push(action.payload);
    },
    updateTrainer(state, action: PayloadAction<Trainer>) {
      const index = state.data.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...action.payload,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name
        };
      }
    },
    removeTrainer(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setTrainers(state, action: PayloadAction<Trainer[]>) {
      state.data = action.payload;
    },
  },
});

const { addTrainer, updateTrainer, removeTrainer, setTrainers } = trainerSlice.actions;

export { addTrainer, updateTrainer, removeTrainer, setTrainers };
export default trainerSlice.reducer;
