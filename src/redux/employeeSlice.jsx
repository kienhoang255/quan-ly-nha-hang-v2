import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployee: (state, action) => {
      return { ...state, data: [...action.payload] };
    },

    setPaginationPage: (state, action) => {
      return { ...state, paginationPage: action.payload };
    },

    setPaginationLimit: (state, action) => {
      return { ...state, paginationLimit: action.payload };
    },

    setPaginationCount: (state, action) => {
      return { ...state, paginationCount: action.payload };
    },

    addEmployee: (state, action) => {
      if (state.data.length === 10) {
        return { ...state, data: [action.payload, ...state.data.slice(0, 9)] };
      } else {
        return { ...state, data: [action.payload, ...state.data] };
      }
    },
    updateEmployee: (state, action) => {
      return {
        ...state,
        data: state.data.map((e) => {
          if (e._id === action.payload._id) {
            return action.payload;
          } else return e;
        }),
      };
    },
    delEmployee: (state, action) => {
      return {
        ...state,
        data: state.data.filter((e) => e._id !== action.payload._id),
      };
    },
  },
});

export const {
  setEmployee,
  addEmployee,
  setPaginationCount,
  setPaginationLimit,
  setPaginationPage,
  updateEmployee,
  delEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
