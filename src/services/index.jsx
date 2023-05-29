import axios from "axios";

export const URL = "http://localhost:5000/";
// export const URL = "https://quan-ly-nha-hang-be-1.vercel.app/";

export const instance = axios.create({
  baseURL: URL,
});

export { default as UserAPI } from "./user";
export { default as MenuAPI } from "./menu";
export { default as TableAPI } from "./table";
export { default as BillAPI } from "./bill";
export { default as OrderAPI } from "./order";
export { default as EmployeeAPI } from "./employee";
export { default as BookingAPI } from "./booking";
