import { instance } from ".";

const getAllTypeFood = async () => await instance.get(`food/option/type`);

const getFoodByType = async (type) => await instance.get(`food/?type=${type}`);

const getFoodById = async (id) => await instance.get(`food/${id}`);

const createFood = async (data) => await instance.post("food", data);

export default { getAllTypeFood, getFoodByType, getFoodById, createFood };
