import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    addUserInfoToStore: (state, action) => {
      state.value = action.payload.user;
    },
    addUserPhotoToStore: (state, action) => {
      state.value.photoUrl = action.payload;
    },
    upUserToStore: (state, action) => {
      state.value.level = action.payload.currentLevelID;
      state.value.subLevel = action.payload.currentSubLevelID;
    },
    removeUserInfoToStore: (state) => {
      state.value = initialState.value;
    },
  },
});

export const {
  addUserInfoToStore,
  removeUserInfoToStore,
  addUserPhotoToStore,
  upUserToStore,
} = userInfoSlice.actions;
export default userInfoSlice.reducer;
