import axios from "axios";
import { URL } from "./index";

const addFoodOrder = (data) => axios.post(`${URL}food-ordered`, data);

const getFoodOrderedByStatus = async (status) => {
  return await axios.get(`${URL}food-ordered/${status}`);
};

const updateStatusToServed = async (data) =>
  axios.put(`${URL}food-ordered/served`, data);

const updateStatusToCancel = async (data) =>
  axios.put(`${URL}food-ordered/cancel`, data);

export default {
  addFoodOrder,
  getFoodOrderedByStatus,
  updateStatusToServed,
  updateStatusToCancel,
};
