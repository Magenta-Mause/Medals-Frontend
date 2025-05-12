import { combineReducers } from "@reduxjs/toolkit";
import athleteReducer from "@stores/slices/athleteSlice";
import disciplineReducer from "@stores/slices/disciplineSlice";
import performanceRecordingReducer from "@stores/slices/performanceRecordingSlice";
import trainerReducer from "@stores/slices/trainerSlice";
import disciplineMetricsReducer from "@stores/slices/disciplineRatingMetricSlice";
import accessRequestReducer from "@stores/slices/accessRequestSlice";
import managingTrainerSlice from "@stores/slices/managingTrainerSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from ".";

const appReducer = combineReducers({
  athletes: athleteReducer,
  performanceRecordings: performanceRecordingReducer,
  disciplines: disciplineReducer,
  trainers: trainerReducer,
  disciplineMetrics: disciplineMetricsReducer,
  accessRequests: accessRequestReducer,
  managingTrainer: managingTrainerSlice,
});

const rootReducer = appReducer;

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
export default rootReducer;
