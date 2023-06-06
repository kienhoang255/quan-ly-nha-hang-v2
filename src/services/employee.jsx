import { instance } from ".";

const getEmployee = async () => await instance.get("/employee");

const searchEmployee = async (data) =>
  await instance.get("/employee/search", { params: data });

const newEmployee = async (data) => await instance.post(`/employee`, data);

const updateEmployee = async (data) => await instance.put(`/employee`, data);

const deleteEmployee = async (id) =>
  await instance.put(`/employee/delete/${id}`);

const restoreEmployee = async (id) =>
  await instance.put(`/employee/restore/${id}`);

export default {
  getEmployee,
  searchEmployee,
  newEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
};
