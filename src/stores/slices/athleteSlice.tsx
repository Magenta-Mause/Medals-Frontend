import { Athlete } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "..";

const athleteSlice = createSlice({
  name: "athleteSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as SliceState<Athlete>,
  reducers: {
    addAthlete(state, action: PayloadAction<Athlete>) {
      state.data.push(action.payload);
    },
    updateAthlete(state, action: PayloadAction<Athlete>) {
      const index = state.data.findIndex(
        (athlete) => athlete.id == action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    removeAthlete(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setAthletes(state, action: PayloadAction<Athlete[]>) {
      state.data = action.payload;
    },
  },
});

const { addAthlete, updateAthlete, removeAthlete, setAthletes } =
  athleteSlice.actions;

export { addAthlete, removeAthlete, setAthletes, updateAthlete };
export default athleteSlice.reducer;
