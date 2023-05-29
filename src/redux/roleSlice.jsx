import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: [
    { path: "/order", name: "Đặt món" },
    { path: "/table", name: "Bàn ăn" },
    { path: "/employee", name: "Nhân viên" },
    { path: "/booking", name: "Đặt bàn" },
    { path: "/manager/table", name: "Cài đặt bàn ăn" },
    { path: "/manager/employee", name: "Cài đặt nhân viên" },
    { path: "/bill-history", name: "Lịch sử giao dịch" },
  ],
  job: [],
  roleNotAllowed: [],
};

export const jobSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setJob: (state, actions) => {
      const checkExist = state.job.find((e) => e.path === actions.payload.path);
      if (!checkExist) {
        state.job.push(actions.payload);
      }
    },
    addRoleNotAllowed: (state, actions) => {
      return {
        ...state,
        roleNotAllowed: [...state.roleNotAllowed, actions.payload],
      };
    },
  },
});

export const { setJob, addRoleNotAllowed } = jobSlice.actions;

export default jobSlice.reducer;
