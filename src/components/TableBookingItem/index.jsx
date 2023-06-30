import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import emptyImg from "../../assets/images/placeholder-400x400.png";
import Button from "../Button";
import Modal from "../Modal";
import TextInput from "../TextInput";
import { isEmail, isLength, isNull, isPhoneNumber } from "../../utils";

const cx = classNames.bind(styles);

const TableBookingItem = ({
  data,
  refs,
  handleGetTableImage,
  tableImage,
  dateCheckIn,
  timeCheckIn,
  handleCreateBooking,
  handleCloseModalCreateBooking,
}) => {
  useEffect(() => {
    if (data?._id && handleGetTableImage) {
      handleGetTableImage(data?._id);
    }
  }, [data?._id]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    specialRequired: "",
  });
  const [errMes, setErrMes] = useState({
    username: "",
    email: "",
    phone: "",
    specialRequired: "",
  });

  const handlePreBooking = () => {
    if (!isNull(form?.username)) {
      setErrMes((prev) => ({ ...prev, username: "Không được để trống!" }));
    } else {
      setErrMes((prev) => ({ ...prev, username: "" }));
    }

    if (!isNull(form?.email) && !isNull(form?.phone)) {
      setErrMes((prev) => ({
        ...prev,
        email: "Không được để trống 1 trong 2",
        phone: "Không được để trống 1 trong 2",
      }));
    } else {
      if (isNull(form.email) && !isEmail(form.email)) {
        setErrMes((prev) => ({
          ...prev,
          email: "Đây không phải email",
          phone: "",
        }));
      } else if (isNull(form.phone) && !isPhoneNumber(form.phone)) {
        setErrMes((prev) => ({
          ...prev,
          email: "",
          phone: "Đây không phải số điện thoại",
        }));
      } else {
        setErrMes((prev) => ({
          ...prev,
          email: "",
          phone: "",
        }));
      }
    }

    if (
      (isNull(form.username) && isEmail(form.email)) ||
      isPhoneNumber(form.phone)
    ) {
      handleCreateBooking({
        ...form,
        id_table: data._id,
        dateCheckIn,
        timeCheckIn,
      });
    }
  };

  return (
    <div className={cx("container")}>
      <div
        className={cx("right")}
        style={{
          backgroundImage: `url(${
            data?.image1 || tableImage[data?._id]?.image1 || emptyImg
          })`,
        }}
      ></div>
      <div className={cx("left")}>
        <div className={cx("title")}>Bàn {data?.name}</div>
        <div className={cx("num")}>Số người: {data?.numOfPeople}</div>
        <div className={cx("options")}>
          {tableImage[data?._id]?.options?.map((e, key) => (
            <div className={cx("option")} key={key}>
              {e}
            </div>
          ))}
        </div>
      </div>
      <Modal
        ref={refs}
        component={
          <div className={cx("modal")}>
            <div className={cx("modalTitle")}>Đặt bàn</div>
            <div className={cx("modalLeft")}>
              <div
                className={cx("modalLeftImg")}
                style={{
                  backgroundImage: `url(${
                    data?.image1 || tableImage[data?._id]?.image1 || emptyImg
                  })`,
                }}
              ></div>
              <div className={cx("modalLeftText")}>
                Ngày check-in: {dateCheckIn}
              </div>
              <div className={cx("modalLeftText")}>Bàn: {data?.name}</div>
              <div className={cx("modalLeftText")}>
                Thời gian check-in: {timeCheckIn}
              </div>
              <div className={cx("modalLeftText")}>
                Số người: {data?.numOfPeople}
              </div>
            </div>
            <div className={cx("modalRight")}>
              <TextInput
                placeholder="Họ tên"
                value={form.username}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, username: e.target.value }));
                }}
              />
              <div className={cx("errMsg")}>{errMes.username}</div>
              <TextInput
                placeholder="Email"
                value={form.email}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, email: e.target.value }));
                }}
              />
              <div className={cx("errMsg")}>{errMes.email}</div>
              <TextInput
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, phone: e.target.value }));
                }}
              />
              <div className={cx("errMsg")}>{errMes.phone}</div>
              <TextInput
                placeholder="Yêu cầu đặc biệt"
                value={form.specialRequired}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    specialRequired: e.target.value,
                  }));
                }}
              />
            </div>
            <div className={cx("modalFooter")}>
              <Button
                variant="outline"
                onClick={() => handleCloseModalCreateBooking(data._id)}
              >
                Hủy
              </Button>
              <Button onClick={handlePreBooking}>Đặt bàn</Button>
            </div>
          </div>
        }
      >
        <Button className={cx("btn")}>Chọn bàn</Button>
      </Modal>
    </div>
  );
};

export default TableBookingItem;
