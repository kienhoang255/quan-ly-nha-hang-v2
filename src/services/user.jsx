import axios from "axios";
import { URL } from "./index";

const login = (data) => axios.post(`${URL}user/login`, data);

const getUser = (data) => axios.get(`${URL}user/?_id=${data}`);

export default { login, getUser };
