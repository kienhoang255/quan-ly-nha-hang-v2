import { configureStore } from "@reduxjs/toolkit";
import menu from "./menuSlice";
import user from "./userSlice";
import role from "./roleSlice";
import table from "./tableSlice";
import tableServing from "./tableServingSlice";
import foodOrdered from "./foodOrderedSlice";

export const store = configureStore({
  reducer: {
    menu,
    user,
    role,
    table,
    foodOrdered,
    tableServing,
  },
});
