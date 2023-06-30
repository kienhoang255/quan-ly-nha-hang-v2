import React, { useMemo, useState } from "react";
import classNames from "classnames/bind";
import Button from "../Button";
import styles from "./index.module.scss";
import moment from "moment";
import { useSelector } from "react-redux";

const cx = classNames.bind(styles);

const FoodOrderItem = ({
  data,
  cacheFood,
  handleOnServedFood,
  handleOnCancelFood,
}) => {
  const user = useSelector((state) => state.user);
  const disableBtn = useMemo(() => {
    let result;
    if (user?.role === "manager") {
      result = false;
    } else if (user?.role !== "manager" && data.status === "cooking") {
      result = false;
    } else if (user?.role !== "manager" && data.status !== "cooking") {
      result = true;
    }
    return result;
  }, [user, data]);
  return (
    <div className={cx("bodyTable")}>
      <div className={cx("bodyCell")}>
        <div className={cx("wrapPreview")}>
          <div
            className={cx("imgPreview")}
            style={{
              backgroundImage: `url(${cacheFood[data.id_food]?.image})`,
            }}
          ></div>
          <span className={cx("name")}>
            <div>{cacheFood[data.id_food]?.name}</div>
            {data.cancelRequest === "request" && <div>Đang chờ hủy</div>}
            {data.cancelRequest === "reject" && <div>Đã từ chối</div>}
            {data.cancelRequest === "confirm" && <div>Đã hủy</div>}
          </span>
        </div>
      </div>
      <div className={cx("bodyCell")}>{data.nameTable}</div>
      <div className={cx("bodyCell")}>{data.quantity}</div>
      <div className={cx("bodyCell")}>
        {moment(data.createdAt).format("DD/MM-hh:mm:ss")}
      </div>
      <div className={cx("bodyCell")}>{data.status}</div>

      <div className={cx("bodyCell", "actionBtn")}>
        <Button
          className={cx("cancelBtn")}
          onClick={() => handleOnCancelFood(data._id)}
          variant="outline"
          disable={disableBtn}
        >
          Huỷ
        </Button>
        <Button
          disable={disableBtn}
          className={cx("completeBtn")}
          onClick={() => {
            handleOnServedFood(data._id);
          }}
        >
          Hoàn thành
        </Button>
      </div>
    </div>
  );
};

export default FoodOrderItem;
