import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  booking: [],
  paginationPage: "",
  paginationLimit: "",
  paginationCount: "",
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBooking: (state, action) => {
      return {
        ...state,
        booking: [...action.payload.data],
        paginationCount: action.payload?.paginationCount,
        paginationLimit: action.payload?.paginationLimit,
        paginationPage: action.payload?.paginationPage,
      };
    },
    updateBooking: (state, action) => {
      return {
        ...state,
        booking: state.booking.map((e) => {
          if (e._id === action.payload._id) {
            return action.payload;
          } else return e;
        }),
      };
    },

    setBookingOnly: (state, action) => {
      return {
        ...state,
        booking: [...action.payload],
      };
    },
  },
});

export const { setBooking, updateBooking, setBookingOnly } =
  bookingSlice.actions;

export default bookingSlice.reducer;
