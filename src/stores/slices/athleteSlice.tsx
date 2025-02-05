import { Athlete } from "@customTypes/bffTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AthleteSliceState {
  data: Athlete[];
  state: "idle" | "loading" | "failed";
  error: string | null;
}

const athleteSlice = createSlice({
  name: "athleteSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as AthleteSliceState,
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
    setAthltes(state, action: PayloadAction<Athlete[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialState.pending, (state) => {
        state.state = "loading";
      })
      .addCase(
        fetchInitialState.fulfilled,
        (state, action: PayloadAction<Athlete[] | undefined>) => {
          state.state = "idle";
          if (action.payload == undefined) {
            console.error("Error while fetching ");
          } else {
            state.data = action.payload ?? [];
          }
        },
      );
  },
});

const { addAthlete, updateAthlete, removeAthlete, setAthltes } =
  athleteSlice.actions;

export {
  addAthlete,
  fetchInitialState,
  removeAthlete,
  setAthltes,
  updateAthlete,
};
export default athleteSlice.reducer;
