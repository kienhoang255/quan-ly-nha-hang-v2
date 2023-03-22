import React, { memo, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { GoPrimitiveDot } from "react-icons/go";
import { MdPeopleAlt } from "react-icons/md";

import Modal from "../../Modal";
import ModalContentCheckIn from "../ModalContentCheckIn";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const TableItem = ({ tableInfo, handleOnSelectedTable }) => {
  const navigate = useNavigate();
  const ref = useRef();
  const handleCloseModal = () => {
    ref.current.closeModal();
  };

  const [hasValue, setHasValue] = useState("");

  return (
    <div
      onClick={() => {
        handleOnSelectedTable(
          tableInfo.status,
          tableInfo._id,
          tableInfo.id_bill[0]
        );
      }}
    >
      <Modal
        ref={ref}
        //This allow for not close modal when has value
        hasValue={hasValue}
        component={
          <ModalContentCheckIn
            handleCloseModal={handleCloseModal}
            hasValue={hasValue}
            setHasValue={setHasValue}
          />
        }
      >
        <div className={cx("container")}>
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
    </div>
  );
};

export default memo(TableItem);
