import React from "react";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const Progress = () => {
  return (
    <div className={cx("content")}>
      <div className={cx("main")}>
        <div></div>
      </div>
    </div>
  );
};

export default Progress;
