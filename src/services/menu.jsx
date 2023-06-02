import { instance } from ".";

const getAllTypeFood = async () => await instance.get(`food/option/type`);

const getFoodByType = async (type) => await instance.get(`food/?type=${type}`);

const getFoodById = async (id) => await instance.get(`food/${id}`);

const createFood = async (data) => await instance.post("food", data);

const updateFood = async (data) => await instance.put("food", data);

const deleteFood = async (id) => await instance.delete(`food/${id}`);

export default {
  getAllTypeFood,
  getFoodByType,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
