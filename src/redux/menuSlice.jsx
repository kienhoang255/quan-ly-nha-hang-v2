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
    addFood: (state, action) => {
      const data = action.payload;
      if (state.foodType.find((type) => type !== data.type)) {
        return {
          ...state,
          menu: [...state.menu, data],
          foodType: [...state.foodType, data.type],
          foodTypeCalled: [...state.foodTypeCalled, data.type],
        };
      } else return { ...state, menu: [...state.menu, action.payload] };
    },
  },
});

export const { setFoodType, setFoodTypeCalled, setMenu, addFood } =
  menuSlice.actions;

export default menuSlice.reducer;
