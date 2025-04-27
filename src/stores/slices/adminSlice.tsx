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
    updateAdmin(state, action: PayloadAction<Admin>) {
      const index = state.data.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...action.payload,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
        };
      }
    },
    removeAdmin(state, action: PayloadAction<{ id: number }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setAdmins(state, action: PayloadAction<Admin[]>) {
      state.data = action.payload;
    },
  },
});

const { addAdmin, updateAdmin, removeAdmin, setAdmins } = adminSlice.actions;

export { addAdmin, updateAdmin, removeAdmin, setAdmins };
export default adminSlice.reducer;
