import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // _id : id_table
  _id: "",
  id_bill: "",
  clientAvatar: undefined,
  clientName: "",
  foodSelecting: [],
};

export const tableServingSlice = createSlice({
  name: "tableServing",
  initialState,
  reducers: {
    setTableServing: (state, actions) => {
      state._id = actions.payload._id;
      state.id_bill = actions.payload.id_bill;
    },
    setClientInfo: (state, actions) => {
      state.clientAvatar = actions.payload.clientAvatar;
      state.clientName = actions.payload.clientName;
    },
    addFoodSelecting: (state, actions) => {
      return {
        ...state,
        foodSelecting: [...state.foodSelecting, actions.payload],
      };
    },
    removeFoodSelecting: (state, actions) => {
      return {
        ...state,
        foodSelecting: state.foodSelecting.filter((e) => {
          if (e.id_food !== actions.payload.id_food) {
            return { e };
          }
        }),
      };
    },
    increaseFoodSelecting: (state, actions) => {
      return {
        ...state,
        foodSelecting: state.foodSelecting.map((e) => {
          if (e.id_food === actions.payload.id_food) {
            return {
              ...actions.payload,
              quantity: actions.payload.quantity + 1,
            };
          } else return { ...e };
        }),
      };
    },
    decreaseFoodSelecting: (state, actions) => {
      return {
        ...state,
        foodSelecting: state.foodSelecting.map((e) => {
          if (e.id_food === actions.payload.id_food) {
            return {
              ...actions.payload,
              quantity: actions.payload.quantity - 1,
            };
          } else return { ...e };
        }),
      };
    },
    cleanTableServingInfo: (state) => {
      return {
        ...state,
        _id: "",
        id_bill: "",
        clientAvatar: undefined,
        clientName: "",
        foodSelecting: [],
      };
    },
  },
});

export const {
  setTableServing,
  setClientInfo,
  addFoodSelecting,
  removeFoodSelecting,
  increaseFoodSelecting,
  decreaseFoodSelecting,
  cleanTableServingInfo,
} = tableServingSlice.actions;

export default tableServingSlice.reducer;
