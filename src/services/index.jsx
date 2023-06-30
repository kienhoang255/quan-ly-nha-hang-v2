import axios from "axios";

export const URL = "http://localhost:5000/";
// export const URL = "https://quan-ly-nha-hang-be-1.vercel.app/";
// export const URL = "https://48a9-115-72-235-74.ngrok-free.app";

export const instance = axios.create({
  baseURL: URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE",
    "Access-Control-Allow-Methods": "'Content-Type', 'Authorization'",
  },
});

export { default as UserAPI } from "./user";
export { default as MenuAPI } from "./menu";
export { default as TableAPI } from "./table";
export { default as BillAPI } from "./bill";
export { default as OrderAPI } from "./order";
export { default as EmployeeAPI } from "./employee";
export { default as BookingAPI } from "./booking";
export { default as CustomerAPI } from "./customer";
