import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stage: [],
  table: [],
  stageCalled: [],
  tableImage: {},
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setStage: (state, action) => {
      state.stage = action.payload;
    },
    setStageCalled: (state, action) => {
      state.stageCalled.push(action.payload);
    },
    setTable: (state, action) => {
      // state.table.push(...action.payload);
      const table = action.payload.table;
      const booking = action.payload.booking;
      const deathTime = action.payload.deathTime;

      return {
        ...state,
        table: [
          ...state.table,
          ...table.map((t) => {
            const findBooking = booking.find((b) => b.id_table === t._id);

            if (
              findBooking &&
              t.status === "empty" &&
              deathTime + 4 <= findBooking.timeCheckIn
            ) {
              return {
                status: "booking",
                name: t.name,
                _id: t._id,
                id_bill: t.id_bill,
                numOfPeople: t.numOfPeople,
                stage: t.stage,
              };
            } else return t;
          }),
        ],
      };
    },
    addTable: (state, action) => {
      state.table.push(action.payload);
    },
    updateTable: (state, action) => {
      return {
        ...state,
        table: state.table.map((e) => {
          if (e._id === action.payload._id) {
            return { ...action.payload };
          } else return { ...e };
        }),
      };
    },

    setTableImage: (state, action) => {
      return {
        ...state,
        tableImage: {
          ...state.tableImage,
          [action.payload.id_table]: action.payload,
        },
      };
    },
    updateTableImage: (state, action) => {
      return {
        ...state,
        tableImage: {
          ...state.tableImage,
          [action.payload._id]: {
            ...state.tableImage[action.payload._id],
            ...action.payload,
          },
        },
      };
    },

    addTableImageOptions: (state, action) => {
      return {
        ...state,
        tableImage: {
          ...state.tableImage,
          [action.payload._id]: {
            ...state.tableImage[action.payload._id],
            options: [
              ...state.tableImage[action.payload._id].options,
              action.payload.option,
            ],
          },
        },
      };
    },

    updateTableImageOptions: (state, action) => {
      state.tableImage[action.payload._id].options.splice(
        action.payload.index,
        1,
        action.payload.option
      );
    },

    removeTableImageOptions: (state, action) => {
      state.tableImage[action.payload._id].options.splice(
        action.payload.index,
        1
      );
    },
  },
});

export const {
  setStage,
  setStageCalled,
  setTable,
  addTable,
  updateTable,
  updateTableInfo,
  setTableImage,
  updateTableImage,
  addTableImageOptions,
  updateTableImageOptions,
  removeTableImageOptions,
} = tableSlice.actions;

export default tableSlice.reducer;
