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

const requestCancelFoodOrdered = async (data) =>
  instance.post(`food-ordered/r/cancel/`, data);

const returnRequestCancelFOReject = async (_id) =>
  instance.post(`food-ordered/cancelRequest/reject/${_id}`);

const returnRequestCancelFOConfirm = async (_id) =>
  instance.post(`food-ordered/cancelRequest/confirm/${_id}`);

export default {
  addFoodOrder,
  getFoodOrderedByIdBill,
  getFoodOrderedByStatus,
  updateStatusToServed,
  updateStatusToCancel,
  requestCancelFoodOrdered,
  returnRequestCancelFOReject,
  returnRequestCancelFOConfirm,
};
