import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cacheFood: {},
  foodOrdered: [],
};

export const foodOrderedSlice = createSlice({
  name: "foodOrdered",
  initialState,
  reducers: {
    setFoodOrdered: (state, action) => {
      return { ...state, foodOrdered: [...action.payload] };
    },
    removeFoodOrdered: (state, action) => {
      return {
        ...state,
        foodOrdered: state.foodOrdered.filter((e) => {
          if (e._id !== action.payload) return e;
        }),
      };
    },
    addFoodOrdered: (state, action) => {
      state.table.push(...action.payload);
    },
    addCache: (state, action) => {
      return {
        ...state,
        cacheFood: {
          ...state.cacheFood,
          [action.payload._id]: action.payload,
        },
      };
    },
  },
});

export const { setFoodOrdered, removeFoodOrdered, addFoodOrdered, addCache } =
  foodOrderedSlice.actions;

export default foodOrderedSlice.reducer;
