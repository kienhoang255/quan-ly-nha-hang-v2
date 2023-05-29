import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Button from "../../Button";

import { IoAlertOutline } from "react-icons/io5";

const cx = classNames.bind(styles);

const ModalConfirm = ({
  tableInfo,
  currentTable,
  handleOnClickChangeTable,
  handleCloseModal,
}) => {
  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Thông báo</div>
      <div className={cx("content")}>
        Xác nhận chuyển sang bàn&ensp;
        <div className={cx("nameTable")}>{tableInfo.name}</div>
      </div>
      {/* <div>
        <IoAlertOutline />
        {tableInfo.numOfPeople < currentTable.numOfPeople
          ? "Bàn sẽ ít chỗ ngồi hơn bàn hiện tại"
          : "Bàn sẽ nhiều chỗ ngồi hơn bàn hiện tại"}
      </div> */}
      <div className={cx("actions")}>
        <Button
          className={cx("btn")}
          variant="outline"
          onClick={() => handleCloseModal(tableInfo._id)}
        >
          Hủy
        </Button>
        <Button
          className={cx("btn")}
          onClick={() =>
            handleOnClickChangeTable({
              id_table: currentTable._id,
              id_table_to: tableInfo._id,
              id_bill: currentTable.id_bill[0],
            })
          }
        >
          Xác nhận
        </Button>
      </div>
    </div>
  );
};

export default ModalConfirm;
