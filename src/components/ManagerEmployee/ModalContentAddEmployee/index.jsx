import React from "react";

import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Button from "../../Button";
import TextInput from "../../TextInput";
import CheckBox from "../../CheckBox";
import { useSelector } from "react-redux";
import avatarNull from "../../../assets/images/avatar-null.png";
import { imageToBase64 } from "../../../utils";

const cx = classNames.bind(styles);

const ManagerEmployee = ({
  employeeInfo,
  setEmployeeInfo,
  handleOnCreateNewEmployee,
  handleCloseModal,
  errMes,
}) => {
  const role = useSelector((state) => state.role);
  return (
    <div className={cx("container")}>
      <div className={cx("header")}>Thêm nhân viên</div>
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
              <CheckBox
                label={e.name}
                id={key}
                key={key}
                active={employeeInfo.job.find((j) => j === e.path)}
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
            ))}
          </div>
        </div>
        <div className={cx("body_right")}>
          <TextInput
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

          <TextInput
            placeholder="Mật khẩu"
            value={employeeInfo?.password}
            onChange={(e) => {
              setEmployeeInfo((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />
          <span className={cx("err_mes")}>{errMes?.password}</span>

          <TextInput
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
        <Button variant="outline" onClick={handleCloseModal}>
          Huỷ
        </Button>
        <Button onClick={handleOnCreateNewEmployee}>Thêm</Button>
      </div>
    </div>
  );
};

export default ManagerEmployee;
