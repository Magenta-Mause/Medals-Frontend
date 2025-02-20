import { Athlete } from "@customTypes/bffTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TrainerSliceState {
  data: Athlete[];
  state: "idle" | "loading" | "failed";
  error: string | null;
}

const trainerSlice = createSlice({
  name: "athleteSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as TrainerSliceState,
  reducers: {
    addTrainer(state, action: PayloadAction<Athlete>) {
      state.data.push(action.payload);
    },
    updateTrainer(state, action: PayloadAction<Athlete>) {
      const index = state.data.findIndex(
        (athlete) => athlete.id == action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    removeTrainer(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setTrainers(state, action: PayloadAction<Athlete[]>) {
      state.data = action.payload;
    },
  },
});

const { addTrainer, updateTrainer, removeTrainer, setTrainers } =
  trainerSlice.actions;

export { addTrainer, removeTrainer, setTrainers, updateTrainer };
export default trainerSlice.reducer;
