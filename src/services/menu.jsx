import { instance } from ".";

const getAllTypeFood = async () => await instance.get(`food/option/type`);

const getFoodByType = async (type) => await instance.get(`food/?type=${type}`);

const getFoodById = async (id) => await instance.get(`food/${id}`);

export default { getAllTypeFood, getFoodByType, getFoodById };
