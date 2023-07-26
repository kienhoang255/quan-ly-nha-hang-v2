import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: [
    { path: "/order", name: "Chế biến món ăn" },
    { path: "/table", name: "Sơ đồ bàn" },
    // { path: "/employee", name: "Nhân viên" },
    { path: "/booking", name: "Đặt bàn" },
    { path: "/bill-history", name: "Lịch sử giao dịch" },
    { path: "/manager/table", name: "Quản lý bàn ăn" },
    { path: "/manager/menu", name: "Quản lý thực đơn" },
    { path: "/manager/employee", name: "Quản lý nhân viên" },
    // { path: "/statistic", name: "Báo cáo thống kê" },
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
    clearJob: (state, actions) => {
      return { ...state, job: [] };
    },
    addRoleNotAllowed: (state, actions) => {
      return {
        ...state,
        roleNotAllowed: [...state.roleNotAllowed, actions.payload],
      };
    },
  },
});

export const { setJob, addRoleNotAllowed, clearJob } = jobSlice.actions;

export default jobSlice.reducer;
