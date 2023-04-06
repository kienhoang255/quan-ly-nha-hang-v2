import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const CheckBox = ({ label = "label", id, active = false, onChange }) => {
  return (
    <div className={cx("container")}>
      <input
        className={cx("checkbox")}
        type="checkbox"
        id={id}
        name={id}
        checked={active}
        onChange={onChange}
      />
      <div className={cx("content", { active: active })}>
        <label htmlFor={id} className={cx("label")}>
          {label}
        </label>
      </div>
    </div>
  );
};

export default CheckBox;
