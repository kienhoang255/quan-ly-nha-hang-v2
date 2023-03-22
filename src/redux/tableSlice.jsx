import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stage: [],
  table: [],
  stageCalled: [],
  tableImage: {},
  options: [],
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
      state.table.push(...action.payload);
    },
    addTable: (state, action) => {
      return state;
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
    addOption: (state, action) => {
      return { ...state, options: [...state.options, action.payload] };
    },
    removeOption: (state, action) => {
      state.options.splice(action.payload, 1);
    },
    updateOption: (state, action) => {
      state.options.splice(action.payload.index, 1, action.payload.option);
    },
  },
});

export const {
  setStage,
  setStageCalled,
  setTable,
  updateTable,
  setTableImage,
  updateTableImage,
  addOption,
  updateOption,
  removeOption,
} = tableSlice.actions;

export default tableSlice.reducer;
