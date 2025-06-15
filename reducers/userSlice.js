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
      // Si user onBoardé , renvoie le token
      if (action.payload.token) {
        state.value.token = action.payload.token;
        state.value.provToken = "";
        // Si user pas onBoardé , renvoie le provtoken
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
