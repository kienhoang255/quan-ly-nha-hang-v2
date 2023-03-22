import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: [
    { path: "/order", name: "Đặt món" },
    { path: "/table", name: "Bàn ăn" },
    { path: "/employee", name: "Nhân viên" },
    { path: "/booking", name: "Đặt bàn" },
    { path: "/manager/table", name: "Cài đặt bàn ăn" },
  ],
  job: [],
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJob: (state, actions) => {
      const checkExist = state.job.find((e) => e.path === actions.payload.path);
      if (!checkExist) {
        state.job.push(actions.payload);
      }
    },
  },
});

export const { setJob } = jobSlice.actions;

export default jobSlice.reducer;
