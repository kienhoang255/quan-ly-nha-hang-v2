import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  booking: [],
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action) => {
      return { ...state, booking: [...action.payload] };
    },
  },
});

export const { setBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
