import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import TextInput from "../TextInput";
import Button from "../Button";
import { CustomerAPI } from "../../services";

const cx = classNames.bind(styles);

const ModalInfoBooking = ({
  data,
  handleUpdateBooking,
  handleCloseModalBooking,
}) => {
  const [newData, setNewData] = useState(data);
  const [info, setInfo] = useState();
  useEffect(() => {
    CustomerAPI.getCustomer(data.id_client).then((res) => setInfo(res.data));
  }, []);
  return (
    <div className={cx("modal")}>
      <div className={cx("modalTitle")}>Cập nhật đơn đặt bàn</div>
      <div className={cx("modalContent")}>
        <TextInput
          className={cx("modalContentTextInput")}
          placeholder="Ngày check in"
          value={newData.dateCheckIn}
          readOnly
        />
        <TextInput
          placeholder="Tên người check-in"
          value={info?.username ? info?.username : ""}
          readOnly
        />
        <TextInput
          placeholder="SĐT người check-in"
          value={info?.phone ? info?.phone : ""}
          readOnly
        />
        <TextInput
          placeholder="Email người check-in"
          value={info?.email ? info?.email : ""}
          readOnly
        />
        <TextInput
          placeholder="Giờ check in"
          value={newData?.timeCheckIn}
          readOnly
        />
        <TextInput
          placeholder="Yêu cầu đặc biệt"
          value={newData?.specialRequired}
          onChange={(e) => {
            setNewData((prev) => ({
              ...prev,
              specialRequired: e.target.value,
            }));
          }}
        />
      </div>
      <div className={cx("modalTitleSub")}>
        *Chỉ có thể thay đổi "Yêu cầu đặc biệt"
      </div>
      <div className={cx("modalTitleSub")}>
        Những thay đổi khác vui lòng hủy đơn đặt bàn và đặt lại bàn khác cho
        khách hàng
      </div>
      <div className={cx("modalFooter")}>
        <Button
          variant="outline"
          onClick={() => handleCloseModalBooking(newData._id)}
        >
          Hủy
        </Button>
        <Button
          onClick={() => {
            handleUpdateBooking({ ...newData, status: "cancel" });
          }}
        >
          Hủy đơn đặt bàn
        </Button>
        <Button
          onClick={() => {
            handleUpdateBooking(newData);
          }}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default ModalInfoBooking;
