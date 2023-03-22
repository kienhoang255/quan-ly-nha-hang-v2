import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: [],
  foodType: [],
  foodTypeCalled: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setFoodType: (state, action) => {
      state.foodType = action.payload;
    },
    setFoodTypeCalled: (state, action) => {
      state.foodTypeCalled.push(action.payload);
    },
    setMenu: (state, action) => {
      state.menu.push(...action.payload);
    },
  },
});

export const { setFoodType, setFoodTypeCalled, setMenu } = menuSlice.actions;

export default menuSlice.reducer;
