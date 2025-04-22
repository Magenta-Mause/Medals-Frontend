import { Admin } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "..";

const adminSlice = createSlice({
  name: "adminSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as SliceState<Admin>,
  reducers: {
    addAdmin(state, action: PayloadAction<Admin>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.data.push(action.payload);
    },
    removeAdmin(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setAdmins(state, action: PayloadAction<Admin[]>) {
      state.data = action.payload;
    },
  },
});

const { addAdmin, removeAdmin, setAdmins } = adminSlice.actions;

export { addAdmin, removeAdmin, setAdmins };
export default adminSlice.reducer;
