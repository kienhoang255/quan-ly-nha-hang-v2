import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Button from "../../Button";

const cx = classNames.bind(styles);

const ModalConfirmCancel = ({
  name,
  handleCancelFood,
  handleCloseModalCancel,
  data,
}) => {
  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Thông báo</div>
      <div className={cx("content")}>Bạn muốn hủy món {name}</div>
      <div className={cx("action")}>
        <Button variant="outline" onClick={() => handleCloseModalCancel(data)}>
          Hủy
        </Button>
        <Button onClick={() => handleCancelFood(data)}>Xác nhận</Button>
      </div>
    </div>
  );
};

export default ModalConfirmCancel;
