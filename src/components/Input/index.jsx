import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const Input = ({
  className,
  label,
  id,
  defaultValue,
  value,
  onChange,
  ...props
}) => {
  return (
    <div className={cx("container")}>
      {label && (
        <label className={cx("label")} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={cx("input", { [className]: className })}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default Input;
