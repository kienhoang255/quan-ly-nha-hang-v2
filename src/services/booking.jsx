import { instance } from ".";

const getBooking = async (params) =>
  await instance.get(`/booking/`, { params: params });

const getAllBooking = async (params) => {
  return await instance.get(`/booking/all`, { params: params });
};

const createBooking = async (data) =>
  await instance.post("/booking/employee", data);

const updateBooking = async (data) => await instance.put("/booking/", data);

export default {
  getBooking,
  createBooking,
  updateBooking,
  getAllBooking,
};
