import React, { memo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

const Button = ({
  children,
  variant = "normal",
  to,
  className,
  leftIcon,
  rightIcon,
  notify,
  active = false,
  disable = false,
  type = "button",
  ...props
}) => {
  let Comp = "button";
  if (to) {
    props.to = to;
    Comp = Link;
  }

  const variantMode = ["outline", "normal", "none", "circle"];
  const getVariant = () => variantMode.filter((e) => e === variant).toString();

  const classes = cx("content", getVariant(), {
    [className]: className,
    active,
    disable,
  });

  return (
    <Comp className={classes} type={type} {...props}>
      {leftIcon && <div className={cx("left-icon")}>{leftIcon}</div>}
      <div className={cx("title")}>{children}</div>
    </Comp>
  );
};

export default memo(Button);
