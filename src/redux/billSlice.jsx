import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bill: [],
  totalPages: 0,
};

export const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    setBill: (state, action) => {
      return { ...state, bill: [...action.payload] };
    },
    setTotalPage: (state, action) => {
      return { ...state, totalPage: action.payload };
    },
  },
});

export const { setBill, setTotalPage } = billSlice.actions;

export default billSlice.reducer;
