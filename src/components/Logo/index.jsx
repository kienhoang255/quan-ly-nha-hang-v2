import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

import logo from "../../assets/images/logo.webp";

const Logo = ({ className }) => {
  return (
    <img className={cx("logo", { [className]: className })} src={logo} alt="" />
  );
};

export default Logo;
