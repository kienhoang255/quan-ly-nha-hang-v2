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

export default imageToBase64;
