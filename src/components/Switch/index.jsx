import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const Switch = ({ onChange, open }) => {
  const id = cx("switch");
  return (
    <label id={id} className={cx("switch")}>
      <input id={id} type="checkbox" checked={open} onChange={onChange} />
      <span className={cx("slider", "round")}></span>
    </label>
  );
};

export default Switch;
