import React, { useState } from "react";
import classNames from "classnames/bind";
import { decodeToken } from "react-jwt";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import styles from "./index.module.scss";

import Logo from "../../components/Logo";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

import { UserAPI } from "../../services";
import { setUser } from "../../redux/userSlice";

const cx = classNames.bind(styles);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);

  const handleOnClick = (e) => {
    e.preventDefault();
    // Get email, password from FormData
    const form = new FormData(e.target);
    const passForm = Object.fromEntries(form.entries());

    setLoad(true);
    // Call API
    UserAPI.login(passForm)
      .then((res) => {
        setLoad(false);
        const decodedToken = decodeToken(res.data.createToken);
        // Create time expire for cookie base on TOKEN
        const expired = new Date(
          moment.unix(decodedToken.exp).format("YYYY-MM-DD HH:mm:ss")
        ).toUTCString();

        // Set userInfo to redux
        dispatch(
          setUser({
            _id: decodedToken._id,
            username: decodedToken.username,
            job: decodedToken.job,
            avatar: res.data.avatar,
          })
        );

        // Set to cookie
        document.cookie = `token=${res.data.createToken}; expires=${expired}`;

        //Redirect to / (main page)
        navigate("/");
        location.reload();
      })
      .catch((err) => {
        setLoad(false);
        setErr(true);
        return err;
      });
  };

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <Logo className={cx("logo")} />
        <form className={cx("form")} onSubmit={handleOnClick}>
          <TextInput
            className={cx("input")}
            id="email"
            placeholder="EMAIL"
            rightIcon
          />
          <TextInput
            id="password"
            type="password"
            placeholder="MẬT KHẨU"
            rightIcon
          />
          {err && (
            <div style={{ color: "red" }}>Tài khoản hoặc mật khẩu sai!</div>
          )}
          <Button type="submit" className={cx("submitBtn")} disable={load}>
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
