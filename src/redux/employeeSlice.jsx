import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

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
      return [...state, action.payload];
    },
  },extraReducers:{

  }
});

export const {
  setEmployee,
  addEmployee,
  setPaginationCount,
  setPaginationLimit,
  setPaginationPage,
} = employeeSlice.actions;

export default employeeSlice.reducer;
