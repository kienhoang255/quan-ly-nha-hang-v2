import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

const cx = classNames.bind(styles);

const ChangePassword = () => {
  const [id, setId] = useState();
  const [expires, setExpires] = useState();
  useEffect(() => {
    document.cookie
      .split(";")
      .map((e) => e.split("="))
      .forEach((e) => {
        if (e[0].trim() === "idChange") {
          setId(e[1]);
        }
      });

    document.cookie
      .split(";")
      .map((e) => e.split("="))
      .forEach((e) => {
        if (e[0].trim() === "id_expires") {
          setExpires(e[1]);
        }
      });
  }, []);

  const handleChangePassword = () => {};

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <div className={cx("title")}>Đổi mật khẩu</div>
        <div className={cx("form")}>
          <TextInput
            id="password"
            name="password"
            placeholder="Mật khẩu"
            type="password"
          />
          <div className={cx("err")}>Mật khẩu tối thiểu 8 kí tự</div>
          <TextInput
            id="re-password"
            name="re-password"
            placeholder="Nhập lại mật khẩu"
            type="password"
          />
          <div className={cx("err")}>Mật khẩu không chính xác</div>
        </div>
        <div className={cx("err")}>
          {!id && "Xảy ra lỗi vui lòng thử lại sau!"}
          <div></div>
        </div>
        <div className={cx("actions")}>
          <Button variant="outline">Hủy</Button>
          <Button disable={!id}>Xác nhận</Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
