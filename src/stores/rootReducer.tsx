import { Action, combineReducers, Reducer } from "@reduxjs/toolkit";
import athleteReducer from "@stores/slices/athleteSlice";
<<<<<<< HEAD
import disciplineReducer from "@stores/slices/disciplineSlice";
import performanceRecordingReducer from "@stores/slices/performanceRecordingSlice";
=======
import trainerReducer from "@stores/slices/trainerSlice";
>>>>>>> 7351e3fa4cc808b9954ec3d5596c23a74da03d85
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from ".";

const appReducer = combineReducers({
  athletes: athleteReducer,
<<<<<<< HEAD
  performanceRecordings: performanceRecordingReducer,
  disciplines: disciplineReducer,
=======
  trainers: trainerReducer,
>>>>>>> 7351e3fa4cc808b9954ec3d5596c23a74da03d85
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
