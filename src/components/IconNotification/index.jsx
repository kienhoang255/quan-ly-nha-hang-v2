import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { IoNotifications } from "react-icons/io5";
import { GoPrimitiveDot } from "react-icons/go";

const cx = classNames.bind(styles);

const IconNotification = ({ icon = <IoNotifications />, shake = false }) => {
  return (
    <div className={cx("container")}>
      {shake && (
        <div className={cx("redDot")}>
          <GoPrimitiveDot />
        </div>
      )}
      <div className={cx("icon")}>{icon}</div>
    </div>
  );
};

export default IconNotification;
