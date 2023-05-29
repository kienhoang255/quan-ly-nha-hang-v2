import { instance } from ".";

const getBooking = async (data) => await instance.get(`/booking/${data}`);

export default { getBooking };
