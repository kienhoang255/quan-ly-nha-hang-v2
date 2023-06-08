import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alert: false,
  data: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNewNotification: (state, action) => {
      if (state.data.length === 3) {
        return {
          ...state,
          alert: true,
          data: [action.payload, ...state.data.slice(0, 2)],
        };
      } else
        return {
          ...state,
          alert: true,
          data: [{ ...action.payload, isSeen: false }, ...state.data],
        };
    },

    turnOffAlert: (state, action) => {
      return { ...state, alert: false };
    },

    isSeen: (state, action) => {
      return {
        ...state,
        alert: false,
      };
    },
  },
});

export const { addNewNotification, turnOffAlert, isSeen } =
  notificationSlice.actions;

export default notificationSlice.reducer;
