import { instance } from "./index";

const getStage = async () => await instance.get(`table/option/stage`);

const getTableByStage = async (stage) =>
  await instance.get(`table/?stage=${stage}`);

const createTableImage = async (data) =>
  await instance.post(`table-image`, data);

const createTable = async (data) => await instance.post(`table/`, data);

const updateTable = async (data) => await instance.put(`table/`, data);

const deleteTable = async (id) => await instance.delete(`table/${id}`);

const getTableImage = async (id) =>
  await instance.get(`table-image/?id_table=${id}`);

export default {
  getStage,
  getTableByStage,
  createTableImage,
  createTable,
  updateTable,
  getTableImage,
  deleteTable,
};
