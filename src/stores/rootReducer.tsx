import { combineReducers } from "@reduxjs/toolkit";
import athleteReducer from "@stores/slices/athleteSlice";
import disciplineReducer from "@stores/slices/disciplineSlice";
import performanceRecordingReducer from "@stores/slices/performanceRecordingSlice";
import trainerReducer from "@stores/slices/trainerSlice";
import adminReducer from "@stores/slices/adminSlice";
import disciplineMetricsReducer from "@stores/slices/disciplineRatingMetricSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from ".";

const appReducer = combineReducers({
  athletes: athleteReducer,
  performanceRecordings: performanceRecordingReducer,
  disciplines: disciplineReducer,
  trainers: trainerReducer,
  admins: adminReducer,
  disciplineMetrics: disciplineMetricsReducer,
});

const rootReducer = appReducer;

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
export default rootReducer;
