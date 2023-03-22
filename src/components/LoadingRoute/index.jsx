import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Logo from "../../components/Logo";

const cx = classNames.bind(styles);

const LoadingRoute = () => {
  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <div className={cx("main")}>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingRoute;
