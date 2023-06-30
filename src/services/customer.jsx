import { instance } from ".";

const getCustomer = async (id) => await instance.get(`/client/${id}`);

export default { getCustomer };
