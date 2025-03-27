import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DisciplineRatingMetric } from "@customTypes/backendTypes";
import { SliceState } from "..";

const initialState: SliceState<DisciplineRatingMetric> = {
  data: [],
  state: "idle",
  error: null,
};

const disciplineMetricsSlice = createSlice({
  name: "disciplineMetrics",
  initialState,
  reducers: {
    setDisciplineMetrics(
      state,
      action: PayloadAction<DisciplineRatingMetric[]>,
    ) {
      state.data = action.payload;
      state.state = "idle";
    },
  },
});

export const { setDisciplineMetrics } = disciplineMetricsSlice.actions;
export default disciplineMetricsSlice.reducer;
