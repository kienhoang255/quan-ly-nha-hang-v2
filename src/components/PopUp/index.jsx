import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Button from "../Button";
import Avatar from "../Avatar";
import { BiLogInCircle } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearJob } from "../../redux/roleSlice";

const cx = classNames.bind(styles);

const PopUp = ({ username, avatar, setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    document.cookie =
      "token" + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
    navigate("/login");
    dispatch(clearJob());
    location.reload();
  };
  return (
    <div className={cx("container")}>
      <div className={cx("title")}>
        <Avatar avatar={avatar} />
        <p className={cx("name")}>{username}</p>
      </div>
      <Button
        to="/me"
        leftIcon={<BsPersonCircle />}
        className={cx("btn")}
        variant="none"
        onClick={() => {
          setOpen(false);
        }}
      >
        Xem trang cá nhân
      </Button>
      <Button
        onClick={() => {
          logout();
          setOpen(false);
        }}
        leftIcon={<BiLogInCircle />}
        className={cx("btn")}
        variant="none"
      >
        Đăng xuất
      </Button>
    </div>
  );
};

export default PopUp;
