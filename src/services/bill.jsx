import { instance } from "./index";

const getClientInfoByIdBill = async (id) => await instance.get(`bill/${id}`);

const getBillByIdBill = async (id) => await instance.get(`bill/bill/${id}`);

const createBill = async (body) => await instance.post("/bill/", body);

const createBillForWalkInGuest = async (body) =>
  await instance.post("/bill/walk-in-guest", body);

const changeTable = async (data) =>
  await instance.post("/bill/change_table", data);

const checkOut = async (data) => await instance.post("/bill/check-out", data);

const searchBill = async (data) =>
  await instance.get("/bill/search/search", { params: data });

const getAllInfo = async (data) => await instance.post("/bill/info/info", data);

export default {
  getClientInfoByIdBill,
  getBillByIdBill,
  createBill,
  createBillForWalkInGuest,
  changeTable,
  checkOut,
  searchBill,
  getAllInfo,
};
