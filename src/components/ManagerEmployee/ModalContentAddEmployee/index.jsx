import React, { useEffect, useState } from "react";

import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Button from "../../Button";
import TextInput from "../../TextInput";
import { useSelector } from "react-redux";
import avatarNull from "../../../assets/images/avatar-null.png";
import { compareArray, imageToBase64 } from "../../../utils";
import Switch from "../../Switch";
import moment from "moment";

const cx = classNames.bind(styles);

const ManagerEmployee = ({
  infoEmployee,
  handleOnCreateNewEmployee,
  handleCloseModal,
  handleUpdateEmployee,
  errMes,
  setting = false,
  handleDeleteEmployee,
  handleRestoreEmployee,
}) => {
  const role = useSelector((state) => state.role);
  const [isChanged, setIsChanged] = useState(true);
  const [employeeInfo, setEmployeeInfo] = useState({
    username: infoEmployee?.username || "",
    email: infoEmployee?.email || "",
    password: "",
    phone: infoEmployee?.phone || "",
    address: infoEmployee?.address || "",
    avatar: infoEmployee?.avatar || undefined,
    job: [...(infoEmployee?.job || "")],
  });

  useEffect(() => {
    const rawData = {
      username: infoEmployee?.username || "",
      email: infoEmployee?.email || "",
      password: "",
      phone: infoEmployee?.phone || "",
      address: infoEmployee?.address || "",
      avatar: infoEmployee?.avatar || undefined,
      job: [...(infoEmployee?.job || "")],
    };

    if (
      rawData.username === employeeInfo.username &&
      rawData.email === employeeInfo.email &&
      rawData.password === employeeInfo.password &&
      rawData.phone === employeeInfo.phone &&
      rawData.address === employeeInfo.address &&
      rawData.avatar === employeeInfo.avatar &&
      compareArray(rawData.job, employeeInfo.job)
    ) {
      setIsChanged(true);
    } else setIsChanged(false);
  }, [employeeInfo]);

  const handleBeforeChangePassword = () => {
    document.cookie = `idChange=${infoEmployee._id};expires=${moment([]).add(
      5,
      "minutes"
    )};path=/`;
    document.cookie = `id_expires=${moment([]).add(
      5,
      "minutes"
    )};expires=${moment([]).add(5, "minutes")};path=/`;
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        {infoEmployee?.email === "admin@gmail.com"
          ? "Acc siêu cấp vip pro max"
          : setting
          ? "Chỉnh sửa nhân viên"
          : "Thêm nhân viên"}
      </div>
      <div className={cx("body")}>
        <div className={cx("body_left")}>
          <img
            src={employeeInfo?.avatar ? employeeInfo?.avatar : avatarNull}
            alt=""
            className={cx("body_left_avatar")}
          />
          <TextInput
            type="file"
            placeholder="Thêm ảnh"
            id="avatar"
            onChange={(event) => {
              imageToBase64(event.target.files[0], (base64) => {
                setEmployeeInfo((prev) => ({
                  ...prev,
                  avatar: base64,
                }));
              });
            }}
          />
          <div className={cx("body_left_list-title")}>Chức năng nhân viên</div>
          <div className={cx("body_left_list-jobs")}>
            {role.role.map((e, key) => (
              <div key={key} className={cx("body_left_list-jobs-item")}>
                <div>{e.name}</div>
                <Switch
                  open={!!employeeInfo.job.find((j) => j === e.path)}
                  onChange={() => {
                    if (employeeInfo.job.find((j) => j === e.path))
                      setEmployeeInfo((prev) => ({
                        ...prev,
                        job: prev.job.filter((j) => j !== e.path),
                      }));
                    else
                      setEmployeeInfo((prev) => ({
                        ...prev,
                        job: [...prev.job, e.path],
                      }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={cx("body_right")}>
          <TextInput
            id="name"
            placeholder="Tên"
            value={employeeInfo?.username}
            onChange={(e) => {
              setEmployeeInfo((prev) => ({
                ...prev,
                username: e.target.value,
              }));
            }}
          />
          <span className={cx("err_mes")}>{errMes?.username}</span>
          <TextInput
            id="email"
            placeholder="Email"
            value={employeeInfo?.email}
            onChange={(e) => {
              setEmployeeInfo((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
          />
          <span className={cx("err_mes")}>{errMes?.email}</span>

          {infoEmployee?.email === "admin@gmail.com" ? (
            <></>
          ) : setting ? (
            <Button
              onClick={() => {
                // localStorage.setItem(
                //   "_idChange",
                //   JSON.stringify(infoEmployee._id)
                // );
                // document.cookie = `idChange=${
                //   infoEmployee._id
                // }; expires=${moment([]).add(5, "minutes")}`;
                // document.cookie = `id_expires=${moment([]).add(
                //   5,
                //   "minutes"
                // )}; expires=${moment([]).add(5, "minutes")}`;
                handleBeforeChangePassword();
              }}
              target="_blank"
              to="/new-password"
              className={cx("changePassword")}
              variant="outline"
            >
              Thay đổi mật khẩu
            </Button>
          ) : (
            <>
              <TextInput
                id="password"
                className={cx("textInput")}
                placeholder="Mật khẩu"
                type="password"
                rightIcon
                value={employeeInfo?.password}
                onChange={(e) => {
                  setEmployeeInfo((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
              />
              <span className={cx("err_mes")}>{errMes?.password}</span>
            </>
          )}

          <TextInput
            id="phone"
            placeholder="SĐT"
            value={employeeInfo?.phone}
            onChange={(e) => {
              setEmployeeInfo((prev) => ({
                ...prev,
                phone: e.target.value,
              }));
            }}
          />
          <span className={cx("err_mes")}>{errMes?.phone}</span>

          <TextInput
            id="address"
            placeholder="Địa chỉ"
            value={employeeInfo?.address}
            onChange={(e) => {
              setEmployeeInfo((prev) => ({
                ...prev,
                address: e.target.value,
              }));
            }}
          />
          <span className={cx("err_mes")}>{errMes?.address}</span>
        </div>
      </div>
      <div className={cx("footer")}>
        <Button
          variant="outline"
          onClick={() => handleCloseModal(infoEmployee?._id)}
        >
          Huỷ
        </Button>
        {infoEmployee?.email === "admin@gmail.com" ? (
          <></>
        ) : (
          setting == true && (
            <Button
              onClick={() => {
                if (infoEmployee.status) handleDeleteEmployee(infoEmployee._id);
                else handleRestoreEmployee(infoEmployee._id);
              }}
            >
              {infoEmployee.status ? "Xóa" : "Khôi phục"}
            </Button>
          )
        )}

        {infoEmployee?.email === "admin@gmail.com" ? (
          <></>
        ) : (
          <Button
            disable={isChanged}
            onClick={() => {
              if (setting) {
                handleUpdateEmployee({
                  _id: infoEmployee._id,
                  ...employeeInfo,
                });
              } else handleOnCreateNewEmployee(employeeInfo);
            }}
          >
            Đồng ý
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManagerEmployee;
