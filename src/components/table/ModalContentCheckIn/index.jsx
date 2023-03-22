import React, { memo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Button from "../../Button";
import TextInput from "../../TextInput";

const cx = classNames.bind(styles);

const ModalContentCheckIn = ({ handleCloseModal, hasValue, setHasValue }) => {
  const handleOnChangeInput = (value) => {
    setHasValue(value);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("headerTitle")}>check in</div>
      </div>
      <div className={cx("body")}>
        <TextInput value={hasValue} onChange={handleOnChangeInput} />
      </div>
      <div className={cx("footer")}>
        <Button variant="outline" onClick={handleCloseModal}>
          Hủy
        </Button>
        <Button>Check in</Button>
      </div>
    </div>
  );
};

export default memo(ModalContentCheckIn);
