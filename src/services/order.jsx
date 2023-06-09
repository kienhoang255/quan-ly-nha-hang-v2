import axios from "axios";
import { URL, instance } from "./index";

const addFoodOrder = (data) => instance.post(`food-ordered`, data);

const getFoodOrderedByIdBill = async (id) =>
  await instance.get(`food-ordered/bill/${id}`);

const getFoodOrderedByStatus = async (status) => {
  return await instance.get(`food-ordered/${status}`);
};

const updateStatusToServed = async (data) =>
  instance.put(`food-ordered/served`, data);

const updateStatusToCancel = async (data) =>
  instance.put(`food-ordered/cancel`, data);

export default {
  addFoodOrder,
  getFoodOrderedByIdBill,
  getFoodOrderedByStatus,
  updateStatusToServed,
  updateStatusToCancel,
};
