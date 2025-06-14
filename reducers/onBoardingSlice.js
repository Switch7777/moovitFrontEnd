import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};
// Redux afin d'enregister l'avancement de l'onboarding
export const onBoardingSlice = createSlice({
  name: "onBoarding",
  initialState,
  reducers: {
    addInfoToStore: (state, action) => {
      state.value = action.payload;
    },
    removeAllInfoToStore: (state, action) => {
      state.value = initialState.value;
    },
  },
});

export const { addInfoToStore, removeAllInfoToStore } = onBoardingSlice.actions;
export default onBoardingSlice.reducer; // Export des fonction reducers
