import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  id_bill: "",
  nameTable: "",
  numOfPeople: "",
  status: "",
  stage: "",
  clientAvatar: undefined,
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  foodSelecting: [],
};

export const tableServingSlice = createSlice({
  name: "tableServing",
  initialState,
  reducers: {
    setTableServing: (state, actions) => {
      return {
        ...state,
        _id: actions.payload._id,
        nameTable: actions.payload.name,
        id_bill: actions.payload.id_bill,
        numOfPeople: actions.payload.numOfPeople,
        status: actions.payload.status,
        stage: actions.payload.stage,
      };
    },
    setClientInfo: (state, actions) => {
      state.clientAvatar = actions.payload.clientAvatar;
      state.clientName = actions.payload.clientName;
      state.clientEmail = actions.payload.clientEmail;
      state.clientPhone = actions.payload.clientPhone;
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
        _id: "",
        id_bill: "",
        nameTable: "",
        numOfPeople: "",
        status: "",
        stage: "",
        clientAvatar: undefined,
        clientName: "",
        clientEmail: "",
        clientPhone: "",
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
