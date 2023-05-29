import React, { memo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Button from "../../Button";
import TextInput from "../../TextInput";

const cx = classNames.bind(styles);

const ModalContentCheckIn = ({
  handleCloseModal,
  hasValue,
  setHasValue,
  handleCheckIn,
  handleCheckInForWalkInGuest,
  errMessage,
}) => {
  const handleOnChangeInput = (value) => {
    setHasValue((prev) => ({ ...prev, email: value.target.value }));
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("headerTitle")}>check in</div>
      </div>
      <div className={cx("body")}>
        <TextInput
          value={hasValue.email}
          onChange={handleOnChangeInput}
          placeholder="Email/SĐT"
        />
      </div>
      <span className={cx("errMessage")}>{errMessage}</span>
      <div className={cx("footer")}>
        <Button variant="outline" onClick={() => handleCloseModal(hasValue)}>
          Hủy
        </Button>
        <Button onClick={() => handleCheckInForWalkInGuest(hasValue)}>
          Khách
        </Button>
        <Button onClick={() => handleCheckIn(hasValue)}>Check in</Button>
      </div>
    </div>
  );
};

export default memo(ModalContentCheckIn);
