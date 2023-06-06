import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const CheckBox = ({
  id,
  onChange,
  active = false,
  label = "label",
  type = "checkbox",
  name,
  className,
}) => {
  return (
    <div className={cx("container")}>
      <input
        className={cx("checkbox")}
        type={type}
        id={id}
        name={name}
        checked={active}
        onChange={onChange}
      />
      <div className={cx("content", { active: active })}>
        <label htmlFor={id} className={cx("label", { [className]: className })}>
          {label}
        </label>
      </div>
    </div>
  );
};

export default CheckBox;
