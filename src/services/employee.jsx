import { instance } from ".";

const getEmployee = async () => await instance.get("/employee");

const searchEmployee = async (data) =>
  await instance.get("/employee/search", { params: data });

const newEmployee = async (data) => await instance.post(`/employee`, data);

export default { getEmployee, searchEmployee, newEmployee };
