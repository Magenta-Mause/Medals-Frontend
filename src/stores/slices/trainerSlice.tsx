import { Trainer } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TrainerSliceState {
  data: Trainer[];
  state: "idle" | "loading" | "failed";
  error: string | null;
}

const trainerSlice = createSlice({
  name: "trainerSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as TrainerSliceState,
  reducers: {
    addTrainer(state, action: PayloadAction<Trainer>) {
      state.data.push(action.payload);
    },
    removeTrainer(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setTrainers(state, action: PayloadAction<Trainer[]>) {
      state.data = action.payload;
    },
  },
});

const { addTrainer, removeTrainer, setTrainers } = trainerSlice.actions;

export { addTrainer, removeTrainer, setTrainers };
export default trainerSlice.reducer;
