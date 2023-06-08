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
      let data = [];
      action.payload.forEach((e) => {
        if (!data?.find((f) => f._id === e._id)) {
          data.push(e);
        }
      });
      return {
        ...state,
        foodOrdered: [...state.foodOrdered, ...data],
      };
      // state.foodOrdered.push(...action.payload);
    },
    addCache: (state, action) => {
      return {
        ...state,
        cacheFood: {
          ...state.cacheFood,
          [action.payload._id]: {
            name: action.payload.name,
            image: action.payload.image,
          },
        },
      };
    },
  },
});

export const { setFoodOrdered, removeFoodOrdered, addFoodOrdered, addCache } =
  foodOrderedSlice.actions;

export default foodOrderedSlice.reducer;
