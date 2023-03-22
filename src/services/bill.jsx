import axios from "axios";
import { URL } from "./index";

const getBillById = async (id) => await axios.get(`${URL}bill/${id}`);

export default { getBillById };
