import { Action, combineReducers, Reducer } from "@reduxjs/toolkit";
import athleteReducer from "@stores/slices/athleteSlice";
import disciplineReducer from "@stores/slices/disciplineSlice";
import performanceRecordingReducer from "@stores/slices/performanceRecordingSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from ".";

const appReducer = combineReducers({
  athletes: athleteReducer,
  performanceRecordings: performanceRecordingReducer,
  disciplines: disciplineReducer,
});

const rootReducer: Reducer = (state, action: Action) => {
  const intermediateState = appReducer(state, action);

  return {
    ...intermediateState,
  };
};

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useTypedSelector };
export default rootReducer;
