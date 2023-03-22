import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  avatar: "",
  job: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => (state = action.payload),
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
