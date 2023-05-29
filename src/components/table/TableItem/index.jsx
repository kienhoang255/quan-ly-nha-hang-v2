import React, { memo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { GoPrimitiveDot } from "react-icons/go";
import { MdPeopleAlt } from "react-icons/md";

import Modal from "../../Modal";
import ModalContentCheckIn from "../ModalContentCheckIn";
import ModalConfirm from "../../ModalChangeTable/ModalConfirm";
import Button from "../../Button";

const cx = classNames.bind(styles);

const TableItem = ({
  tableInfo,
  handleOnSelectedTable,
  handleCheckIn,
  handleCheckInForWalkInGuest,
  errMessage,
  minSize = false,
  changeTable = false,
  tableServing,
  handleOnClickChangeTable,
  handleCloseModal,
  refs,
}) => {
  const [hasValue, setHasValue] = useState({
    email: "",
    id_table: tableInfo._id,
  });

  return (
    <div
      onClick={() => {
        if (!changeTable) {
          handleOnSelectedTable(tableInfo);
        } else {
        }
      }}
    >
      {tableInfo.status === "using" ? (
        <div className={cx("container", minSize && "minSize")}>
          <div className={cx("name")}>{tableInfo.name}</div>
          <div className={cx("status", tableInfo.status)}>
            <GoPrimitiveDot />
          </div>
          <div className={cx("amount")}>
            <MdPeopleAlt />
            {tableInfo.numOfPeople}
          </div>
        </div>
      ) : (
        <Modal
          ref={refs}
          // This allow for not close modal when has value
          hasValue={hasValue.email}
          component={
            !changeTable ? (
              <ModalContentCheckIn
                handleCloseModal={handleCloseModal}
                hasValue={hasValue}
                setHasValue={setHasValue}
                handleCheckIn={handleCheckIn}
                handleCheckInForWalkInGuest={handleCheckInForWalkInGuest}
                errMessage={errMessage}
              />
            ) : tableInfo.status === "empty" ? (
              <ModalConfirm
                tableInfo={tableInfo}
                currentTable={tableServing}
                handleOnClickChangeTable={handleOnClickChangeTable}
                handleCloseModal={handleCloseModal}
              />
            ) : (
              <div className={cx("table_booking")}>
                <div>Bàn đã có người đặt</div>
                <Button onClick={() => handleCloseModal(tableInfo._id)}>
                  Đóng
                </Button>
              </div>
            )
          }
        >
          <div className={cx("container", minSize && "minSize")}>
            <div className={cx("name")}>{tableInfo.name}</div>
            <div className={cx("status", tableInfo.status)}>
              <GoPrimitiveDot />
            </div>
            <div className={cx("amount")}>
              <MdPeopleAlt />
              {tableInfo.numOfPeople}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default memo(TableItem);
