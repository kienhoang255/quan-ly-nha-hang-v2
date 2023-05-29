import { configureStore } from "@reduxjs/toolkit";
import menu from "./menuSlice";
import user from "./userSlice";
import role from "./roleSlice";
import table from "./tableSlice";
import tableServing from "./tableServingSlice";
import foodOrdered from "./foodOrderedSlice";
import employee from "./employeeSlice";
import booking from "./bookingSlice";
import bill from "./billSlice";

export const store = configureStore({
  reducer: {
    menu,
    user,
    role,
    table,
    foodOrdered,
    tableServing,
    employee,
    booking,
    bill,
  },
});
