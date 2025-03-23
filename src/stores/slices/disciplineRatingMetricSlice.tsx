import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DisciplineRatingMetric } from "@customTypes/backendTypes";

interface DisciplineMetricsState {
  data: DisciplineRatingMetric[];
  state: "idle" | "loading" | "error";
  error: string | null;
}

const initialState: DisciplineMetricsState = {
  data: [],
  state: "idle",
  error: null,
};

const disciplineMetricsSlice = createSlice({
  name: "disciplineMetrics",
  initialState,
  reducers: {
    setDisciplineMetrics(state, action: PayloadAction<DisciplineRatingMetric[]>) {
      state.data = action.payload;
      state.state = "idle";
    },
  },
});

export const { setDisciplineMetrics } = disciplineMetricsSlice.actions;
export default disciplineMetricsSlice.reducer;
