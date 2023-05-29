import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const Skeleton = ({ className }) => {
  return (
    <div
      className={cx("content", "skeleton", { [className]: className })}
    ></div>
  );
};

export default Skeleton;
