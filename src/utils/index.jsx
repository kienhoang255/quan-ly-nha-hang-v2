const imageToBase64 = (img, callback) => {
  if (img) {
    var reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onloadend = function () {
      callback(reader.result);
    };
  }
};

export const formatVND = (number) =>
  new Intl.NumberFormat("vn-VN", { style: "currency", currency: "VND" }).format(
    number
  );

export const isEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return email.match(regex);
};

export const isPhoneNumber = (phone) => {
  let result;
  if (Number(phone)) {
    result =
      phone.match(/\d/g).length === 10 || phone.match(/\d/g).length === 11;
  } else result = false;
  return result;
};

export const isLength = (data, min, max = Infinity) => {
  if (data.length >= min && data.length <= max) return true;
};

export const isNull = (data) => {
  let result;
  if (data === null || data === undefined || data === "") {
    result = false;
  } else result = true;
  return result;
};

export const isNumber = (data) => Number(data);

export const isMax = (data, max) => data > max;

export const isNegative = (data) => data > 0;

export { imageToBase64 };
