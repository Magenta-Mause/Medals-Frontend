import { Athlete, PerformanceRecording } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PerformanceRecordingSliceState {
  data: PerformanceRecording[];
  state: "idle" | "loading" | "failed";
  error: string | null;
}

const performanceRecordingSlice = createSlice({
  name: "performanceRecordingSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as PerformanceRecordingSliceState,
  reducers: {
    addPerformanceRecording(state, action: PayloadAction<PerformanceRecording>) {
      state.data.push(action.payload);
    },
    updatePerformanceRecording(state, action: PayloadAction<PerformanceRecording>) {
      const index = state.data.findIndex(
        (athlete) => athlete.id == action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    removePerformanceRecording(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setPerformanceRecordings(state, action: PayloadAction<PerformanceRecording[]>) {
      state.data = action.payload;
    },
  },
});

const {addPerformanceRecording, removePerformanceRecording, setPerformanceRecordings, updatePerformanceRecording} =
  performanceRecordingSlice.actions;

export {addPerformanceRecording, removePerformanceRecording, setPerformanceRecordings, updatePerformanceRecording};
export default performanceRecordingSlice.reducer;
