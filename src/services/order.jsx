import axios from "axios";
import { URL } from "./index";

const addFoodOrder = (data) => axios.post(`${URL}food-ordered`, data);

const getFoodOrderedByIdBill = async (id) =>
  await axios.get(`${URL}food-ordered/bill/${id}`);

const getFoodOrderedByStatus = async (status) => {
  return await axios.get(`${URL}food-ordered/${status}`);
};

const updateStatusToServed = async (data) =>
  axios.put(`${URL}food-ordered/served`, data);

const updateStatusToCancel = async (data) =>
  axios.put(`${URL}food-ordered/cancel`, data);

export default {
  addFoodOrder,
  getFoodOrderedByIdBill,
  getFoodOrderedByStatus,
  updateStatusToServed,
  updateStatusToCancel,
};
