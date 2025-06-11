import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: "",
    provToken: "",
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserToStore: (state, action) => {
      if (action.payload.token) {
        state.value.token = action.payload.token;
        state.value.provToken = "";
      } else if (action.payload.provToken) {
        state.value.provToken = action.payload.provToken;
        state.value.token = "";
      }
    },
    removeUserToStore: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { addUserToStore, removeUserToStore } = userSlice.actions;
export default userSlice.reducer;
