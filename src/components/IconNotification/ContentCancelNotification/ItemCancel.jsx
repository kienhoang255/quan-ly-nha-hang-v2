import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import moment from "moment";
import Button from "../../Button";
import { useDispatch } from "react-redux";
import { deleteAlert, isSeen } from "../../../redux/notiSlice";
import { OrderAPI } from "../../../services";
import { removeFoodOrdered } from "../../../redux/foodOrderedSlice";

const cx = classNames.bind(styles);

const Item = ({ e }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen ? (
        <>
          <div
            className={cx("title")}
          >{`Đồng ý hủy món ${e.nameFood} tại bàn ${e.nameTable}?`}</div>
          <div className={cx("subTitle")}>
            <Button
              variant="outline"
              className={cx("btn")}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Huỷ
            </Button>
            <Button
              className={cx("btn", "reject")}
              onClick={() => {
                setIsOpen(false);
                OrderAPI.returnRequestCancelFOReject(e.id_foodOrdered);
                dispatch(deleteAlert(e));
              }}
            >
              Từ chối
            </Button>
            <Button
              className={cx("btn", "accept")}
              onClick={() => {
                setIsOpen(false);
                OrderAPI.returnRequestCancelFOConfirm(e.id_foodOrdered);
                OrderAPI.updateStatusToCancel({
                  id_foodOrdered: e.id_foodOrdered,
                }).then((res) => {
                  dispatch(removeFoodOrdered(e.id_foodOrdered));
                });
                dispatch(deleteAlert(e));
              }}
            >
              Đồng ý
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className={cx("title")}>{e.message}</div>
          <div className={cx("subTitle")}>
            <div>{moment(e.timeOrder).fromNow()}</div>
            <Button
              className={cx("btn")}
              onClick={() => {
                dispatch(isSeen());
                setIsOpen(true);
              }}
            >
              Chi tiết
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Item;
