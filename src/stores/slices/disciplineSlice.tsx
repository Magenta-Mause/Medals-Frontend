import { Discipline } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DisciplineSliceState {
  data: Discipline[];
  state: "idle" | "loading" | "failed";
  error: string | null;
}

const disciplineSlice = createSlice({
  name: "disciplineSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as DisciplineSliceState,
  reducers: {
    addDiscipline(state, action: PayloadAction<Discipline>) {
      state.data.push(action.payload);
    },
    updateDiscipline(state, action: PayloadAction<Discipline>) {
      const index = state.data.findIndex(
        (athlete) => athlete.id == action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    removeDiscipline(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setDisciplines(state, action: PayloadAction<Discipline[]>) {
      state.data = action.payload;
    },
  },
});

const { addDiscipline, removeDiscipline, setDisciplines, updateDiscipline } =
  disciplineSlice.actions;

export { addDiscipline, removeDiscipline, setDisciplines, updateDiscipline };
export default disciplineSlice.reducer;
