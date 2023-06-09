import React, { useState } from "react";
import classNames from "classnames/bind";
import Button from "../Button";
import styles from "./index.module.scss";
import moment from "moment";

const cx = classNames.bind(styles);

const FoodOrderItem = ({
  data,
  cacheFood,
  handleOnServedFood,
  handleOnCancelFood,
}) => {
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
          <span>{cacheFood[data.id_food]?.name}</span>
        </div>
      </div>
      <div className={cx("bodyCell")}>{data.quantity}</div>
      <div className={cx("bodyCell")}>
        {/* moment */}
        {moment(data.createdAt).format("DD/MM-hh:mm:ss")}
      </div>
      <div className={cx("bodyCell")}>{data.status}</div>

      <div className={cx("bodyCell", "actionBtn")}>
        <Button
          className={cx("cancelBtn")}
          onClick={() => handleOnCancelFood(data._id)}
          variant="outline"
        >
          Huỷ
        </Button>
        <Button
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
