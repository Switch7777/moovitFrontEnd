import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    // Ajout des info user dans le redux ( xp , level , sublelvel , ....)
    addUserInfoToStore: (state, action) => {
      state.value = action.payload.user;
    },
    // Modification de l'user profile pic , securité pour charger la photo avant la modification de la bdd
    addUserPhotoToStore: (state, action) => {
      state.value.photoUrl = action.payload;
    },
    // Up level de l'user sur le redux
    upUserToStore: (state, action) => {
      state.value.level = action.payload.currentLevelID;
      state.value.subLevel = action.payload.currentSubLevelID;
    },
    // Deconnexion de l'user
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
