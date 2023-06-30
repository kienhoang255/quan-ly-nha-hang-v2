import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import ModalLoader from "../../components/ModalLoader";
import { UserAPI } from "../../services";
import moment from "moment";
import { isLength, isNull } from "../../utils";
import Modal from "../../components/Modal";

const cx = classNames.bind(styles);

const ChangePassword = () => {
  const [id, setId] = useState();
  const [username, setUsername] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [data, setData] = useState({
    password: "",
    rePassword: "",
  });
  const [errMes, setErrMes] = useState();
  const [countDown, setCountDown] = useState({
    minutes: 5,
    seconds: 0,
  });

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
          const diff = moment(e[1]).diff(moment([]));
          if (moment.utc(diff).format("mm") <= 5)
            setCountDown({
              minutes: moment.utc(diff).format("mm"),
              seconds: moment.utc(diff).format("ss"),
            });
          else {
            setCountDown({
              minutes: 0,
              seconds: 0,
            });
          }
        }
      });
  }, []);

  useEffect(() => {
    if (id)
      UserAPI.getUser(id).then((res) => {
        setUsername(res.data.username);
        document.title = `Đổi mật khẩu: ${res.data.username}`;
        time(countDown.minutes, countDown.seconds);
      });
  }, [id]);

  let loopCountDown = useRef();

  const time = (min, sec) => {
    let minutes = min;
    let seconds = sec;
    if (countDown?.minutes != 0 && countDown?.seconds != 0)
      loopCountDown.current = setInterval(() => {
        setCountDown((prev) => {
          if (seconds != 0) {
            seconds -= 1;
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (seconds == 0 && minutes > 0) {
            minutes -= 1;
            seconds = 59;
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            return { ...prev, minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
  };

  useEffect(() => {
    if (countDown?.minutes == 0 && countDown?.seconds == 0) {
      clearInterval(loopCountDown.current);
      setId("");
    }
  }, [countDown]);

  const handleChangePassword = () => {
    if (!isNull(data.password)) {
      setErrMes((prev) => ({
        ...prev,
        password: "Không được để trống!",
      }));
    } else {
      if (!isLength(data.password, 8)) {
        setErrMes((prev) => ({
          ...prev,
          password: "Mật khẩu tối thiểu 8 kí tự!",
        }));
      } else {
        if (!isNull(data.rePassword)) {
          setErrMes((prev) => ({
            ...prev,
            rePassword: "Không được để trống",
            password: "",
          }));
        } else if (data.rePassword !== data.password) {
          setErrMes((prev) => ({
            ...prev,
            rePassword: "Mật khẩu không giống như trên!",
            password: "",
          }));
        } else {
          setErrMes((prev) => ({
            ...prev,
            rePassword: "",
            password: "",
          }));
        }
      }
    }

    if (data.rePassword === data.password) {
      setIsFetching(true);
      UserAPI.changePassword({ _id: id, ...data }).then((res) => {
        setIsFetching(false);
        setIsUpdated(true);
        document.cookie = `id_expires=123;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `idChange=123;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    }
  };

  const handleCloseTab = () => {
    window.close();
    setId("");
    document.cookie = `idChange=123;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `id_expires=123;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    clearInterval(loopCountDown.current);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <div className={cx("title")}>Đổi mật khẩu</div>
        <div className={cx("subTitle")}>Tên nhân viên: {username}</div>
        <div
          className={cx(
            "subTitle",
            countDown?.minutes >= 3
              ? "good"
              : countDown?.minutes >= 1
              ? "normal"
              : "bad"
          )}
        >
          {countDown?.minutes == 0 && countDown?.seconds == 0
            ? "Hết thời gian đổi mật khẩu!"
            : `${countDown?.minutes}:${countDown?.seconds}`}
        </div>
        <div className={cx("form")}>
          <TextInput
            id="password"
            name="password"
            placeholder="Mật khẩu"
            type="password"
            value={data.password}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />
          <div className={cx("err")}>{errMes?.password}</div>
          <TextInput
            id="re-password"
            name="re-password"
            placeholder="Nhập lại mật khẩu"
            type="password"
            value={data.rePassword}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                rePassword: e.target.value,
              }));
            }}
          />
          <div className={cx("err")}>{errMes?.rePassword}</div>
        </div>
        <div className={cx("err")}>
          {countDown?.minutes == 0 && countDown?.seconds == 0
            ? ""
            : !id && "Xảy ra lỗi vui lòng thử lại sau!"}
        </div>
        <div className={cx("actions")}>
          <Button variant="outline">Hủy</Button>
          <Button
            disable={countDown?.minutes == 0 && countDown?.seconds == 0}
            onClick={handleChangePassword}
          >
            Xác nhận
          </Button>
        </div>
      </div>
      <Modal
        open={isUpdated}
        component={
          <div className={cx("modalContainer")}>
            <div className={cx("modalContent")}>
              <div className={cx("modalTitle")}>Thông báo</div>
              <div className={cx("modalText")}>Đã cập nhật thành công!</div>
              <div className={cx("modalTextSub")}>Bấm đồng ý để tắt.</div>
              <div className={cx("actions")}>
                <Button onClick={() => handleCloseTab()}>Đồng ý</Button>
              </div>
            </div>
          </div>
        }
      />
      <ModalLoader show={isFetching} />
    </div>
  );
};

export default ChangePassword;
