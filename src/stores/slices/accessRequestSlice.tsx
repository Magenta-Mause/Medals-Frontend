import { AccessRequest } from "@customTypes/backendTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SliceState } from "..";

const accessRequestSlice = createSlice({
  name: "accessRequestSlice",
  initialState: {
    data: [],
    state: "idle",
    error: null,
  } as SliceState<AccessRequest>,
  reducers: {
    addAccessRequest(state, action: PayloadAction<AccessRequest>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      state.data.push(action.payload);
    },
    updateAccessRequest(state, action: PayloadAction<AccessRequest>) {
      const index = state.data.findIndex(
        (athlete) => athlete.id == action.payload.id,
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    removeAccessRequest(state, action: PayloadAction<{ id: string }>) {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
    },
    setAccessRequests(state, action: PayloadAction<AccessRequest[]>) {
      state.data = action.payload;
    },
  },
});

const {
  addAccessRequest,
  updateAccessRequest,
  removeAccessRequest,
  setAccessRequests,
} = accessRequestSlice.actions;

export {
  addAccessRequest,
  updateAccessRequest,
  removeAccessRequest,
  setAccessRequests,
};
export default accessRequestSlice.reducer;
