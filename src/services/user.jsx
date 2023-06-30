import axios from "axios";
import { URL, instance } from "./index";

const login = async (data) => await instance.post(`user/login`, data);

const getUser = async (data) => await instance.get(`user/?_id=${data}`);

const getUserById = async (data) => await instance.get(`user/id/${data}`);

const changePassword = async (data) =>
  await instance.put(`user/change-password`, data);

const updateUser = async (data) => await instance.put("user", data);

export default { login, getUser, changePassword, getUserById, updateUser };
