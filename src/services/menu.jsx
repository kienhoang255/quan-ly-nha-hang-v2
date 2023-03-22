import axios from "axios";
import { URL } from "./index";

const getAllTypeFood = async () => {
  return await axios.get(`${URL}food/option/type`);
};

const getFoodByType = async (type) => {
  return await axios.get(`${URL}food/?type=${type}`);
};

const getFoodById = async (id) => {
  return await axios.get(`${URL}food/${id}`);
};

export default { getAllTypeFood, getFoodByType, getFoodById };
