import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { UserAPI } from "../../services";

import avatarNull from "../../assets/images/avatar-null.png";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "react-jwt";
import { setUser } from "../../redux/userSlice";
import { imageToBase64, isEmail, isNull, isPhoneNumber } from "../../utils";
import ModalLoader from "./../../components/ModalLoader/index";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cx = classNames.bind(styles);

const User = ({}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [info, setInfo] = useState(user);
  const [errMsg, setErrMsg] = useState();
  const [onUpdate, setOnUpdate] = useState(false);

  useEffect(() => {
    let cookie;
    document.cookie
      .split(";")
      .map((e) => e.split("="))
      .forEach((e) => {
        if (e[0].trim() === "token") {
          cookie = e[1];
        }
      });
    const { _id } = decodeToken(cookie);

    if (cookie) {
      UserAPI.getUserById(_id).then((res) => {
        dispatch(setUser(res.data));
        setInfo(res.data);
      });
    }
  }, []);

  const handleUpdate = () => {
    if (!isNull(info?.username)) {
      setErrMsg((prev) => ({ ...prev, username: "Không được để trống!" }));
    } else {
      setErrMsg((prev) => ({ ...prev, username: "" }));
    }

    if (!isNull(info?.email) && !isNull(info.phone)) {
      setErrMsg((prev) => ({
        ...prev,
        email: "Email/SĐT dùng để đăng nhập, vui lòng điền 1 trong 2",
        phone: "Email/SĐT dùng để đăng nhập, vui lòng điền 1 trong 2",
      }));
    } else if (isNull(info.email) && !isEmail(info.email)) {
      setErrMsg((prev) => ({
        ...prev,
        email: "Email không hợp lệ!",
        phone: "",
      }));
    } else if (isNull(info.phone) && !isPhoneNumber(info.phone)) {
      setErrMsg((prev) => ({
        ...prev,
        phone: "Số điện thoại không hợp lệ!",
        email: "",
      }));
    } else {
      setErrMsg((prev) => ({
        ...prev,
        email: "",
        phone: "",
      }));

      setOnUpdate(true);
      UserAPI.updateUser(info)
        .then((res) => {
          toast.success("Cập nhật thành công!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setOnUpdate(false);
          dispatch(setUser(res.data));
        })
        .catch((err) => {
          setOnUpdate(false);
          switch (err.response.status) {
            case 400:
              setErrMsg((prev) => ({
                ...prev,
                email: "Email/SĐT bạn vừa cập nhật đã có người khác sử dụng!",
                phone: "Email/SĐT bạn vừa cập nhật đã có người khác sử dụng!",
              }));
              break;
            case 401:
              setErrMsg((prev) => ({
                ...prev,
                email: "Email đã có người sử dụng!",
              }));
              break;
            case 402:
              setErrMsg((prev) => ({
                ...prev,
                phone: "Số điện thoại đã có người sử dụng!",
              }));
              break;
            case 403:
              setErrMsg((prev) => ({
                ...prev,
                email: "Không được để trống",
                phone: "Không được để trống",
              }));
              break;

            default:
              break;
          }
        });
    }
  };

  const handleCancel = () => {
    setInfo(user);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>Thông tin nhân viên</div>
      <div className={cx("left")}>
        <img
          src={info?.avatar ? info?.avatar : avatarNull}
          alt=""
          className={cx("left_avatar")}
        />
        <TextInput
          type="file"
          placeholder="Thêm ảnh"
          id="avatar"
          onChange={(event) => {
            imageToBase64(event.target.files[0], (base64) => {
              setInfo((prev) => ({
                ...prev,
                avatar: base64,
              }));
            });
          }}
        />
      </div>
      <div className={cx("right")}>
        <div>
          <TextInput
            placeholder="Họ tên"
            className={cx("right_input")}
            value={info?.username ? info?.username : ""}
            onChange={(e) => {
              setInfo((prev) => ({
                ...prev,
                username: e.target.value,
              }));
            }}
          />
          <div className={cx("errMsg")}>{errMsg?.username}</div>
        </div>
        <div>
          <TextInput
            placeholder="Email"
            className={cx("right_input")}
            value={info?.email ? info?.email : ""}
            onChange={(e) => {
              setInfo((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
          />
          <div className={cx("errMsg")}>{errMsg?.email}</div>
        </div>
        <div>
          <TextInput
            placeholder="SĐT"
            className={cx("right_input")}
            value={info?.phone ? info?.phone : ""}
            onChange={(e) => {
              setInfo((prev) => ({
                ...prev,
                phone: e.target.value,
              }));
            }}
          />
          <div className={cx("errMsg")}>{errMsg?.phone}</div>
        </div>
        <div>
          <TextInput
            placeholder="Địa chỉ"
            className={cx("right_input")}
            value={info?.address ? info?.address : ""}
            onChange={(e) => {
              setInfo((prev) => ({
                ...prev,
                address: e.target.value,
              }));
            }}
          />
          <div className={cx("errMsg")}>{errMsg?.address}</div>
        </div>
      </div>
      <div className={cx("footer")}>
        <Button variant="outline" onClick={handleCancel}>
          Hủy
        </Button>
        <Button onClick={handleUpdate}>Cập nhật</Button>
      </div>
      <ModalLoader show={onUpdate} />
      <ToastContainer />
    </div>
  );
};

export default User;
