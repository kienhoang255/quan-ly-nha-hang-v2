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

const getTableById = async (id) => await instance.get(`table/find/${id}`);

const searchTableBooking = async (params) =>
  await instance.get(`table/search`, { params: params });

const getTableOptionsOnly = async () =>
  await instance.get(`table-image/options`);

const getTableByFilter = async (params) =>
  await instance.get("table-image/filter/", { params: { options: params } });

const searchTableByFilter = async (query) =>
  await instance.get(`table/search/filter`, { params: query });

export default {
  getStage,
  getTableByStage,
  createTableImage,
  createTable,
  updateTable,
  getTableImage,
  deleteTable,
  getTableById,
  searchTableBooking,
  getTableOptionsOnly,
  getTableByFilter,
  searchTableByFilter,
};
