import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  serve: { alert: false, data: [] },
  cancel: { alert: false, data: [] },
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNewNotification: (state, action) => {
      if (state[action.payload.option].data.length === 3) {
        return {
          ...state,
          [action.payload.option]: {
            data: [
              action.payload,
              ...state[action.payload.option].data.slice(0, 2),
            ],
            alert: true,
          },
        };
      } else
        return {
          ...state,
          [action.payload.option]: {
            data: [
              { ...action.payload, isSeen: false },
              ...state[action.payload.option].data,
            ],
            alert: true,
          },
        };
    },

    turnOffAlert: (state, action) => {
      return {
        ...state,
        [action.payload.option]: {
          ...state[action.payload.option],
          alert: false,
        },
      };
    },

    turnOnAlert: (state, action) => {
      return {
        ...state,
        [action.payload.option]: {
          ...state[action.payload.option],
          alert: true,
        },
      };
    },

    isSeen: (state, action) => {
      return {
        ...state,
        alert: false,
      };
    },

    deleteAlert: (state, action) => {
      return {
        ...state,
        [action.payload.option]: {
          ...state[action.payload.option],
          data: state[action.payload.option].data.filter((e) => {
            if (e.id_foodOrdered !== action.payload.id_foodOrdered) {
              return e;
            }
          }),
        },
      };
    },
  },
});

export const {
  addNewNotification,
  turnOffAlert,
  turnOnAlert,
  isSeen,
  deleteAlert,
} = notificationSlice.actions;

export default notificationSlice.reducer;
