import axios from "axios";
import { URL } from "./index";

const getStage = async () => await axios.get(`${URL}table/option/stage`);

const getTableByStage = async (stage) =>
  await axios.get(`${URL}table/?stage=${stage}`);

const createTableImage = async (data) =>
  await axios.post(`${URL}table-image`, data);

const createTable = async (data) => await axios.post(`${URL}table/`, data);

const updateTable = async (data) => await axios.put(`${URL}table/`, data);

const getTableImage = async (id) =>
  await axios.get(`${URL}table-image/?id_table=${id}`);

export default {
  getStage,
  getTableByStage,
  createTableImage,
  createTable,
  updateTable,
  getTableImage,
};
