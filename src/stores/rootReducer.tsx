import { Action, combineReducers, Reducer } from "@reduxjs/toolkit";
import athleteReducer from "@stores/slices/athleteSlice";
import disciplineReducer from "@stores/slices/disciplineSlice";
import performanceRecordingReducer from "@stores/slices/performanceRecordingSlice";
import trainerReducer from "@stores/slices/trainerSlice";
import disciplineMetricsReducer from "@stores/slices/disciplineRatingMetricSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from ".";

const appReducer = combineReducers({
  athletes: athleteReducer,
  performanceRecordings: performanceRecordingReducer,
  disciplines: disciplineReducer,
  trainers: trainerReducer,
  disciplineMetrics: disciplineMetricsReducer,
});

const rootReducer: Reducer = (state, action: Action) => {
  const intermediateState = appReducer(state, action);

  return intermediateState;
};

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
export default rootReducer;
