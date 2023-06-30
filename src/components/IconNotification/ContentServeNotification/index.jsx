import React, { useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import moment from "moment";
import Button from "../../Button";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const cx = classNames.bind(styles);

const ContentServeNotification = ({ data, foodOrdered }) => {
  const navigate = useNavigate();
  moment.locale("vi");
  const countFoodOrdered = useMemo(() => {
    let count = 0;
    foodOrdered.forEach((element) => {
      if (element.status === "cooking") count += 1;
    });
    return count;
  }, [foodOrdered]);
  return (
    <div className={cx("container")}>
      {data.data[0] ? (
        data.data.map((e, key) => {
          return (
            <div key={key} className={cx("item")}>
              <div className={cx("title")}>{e.message}</div>
              <div className={cx("subTitle")}>
                <div>{moment(e.timeOrder).fromNow()}</div>
                <Button
                  className={cx("btn")}
                  onClick={() => {
                    navigate(e.title === "order" ? "/order" : "/table");
                  }}
                >
                  Đến xem
                </Button>
              </div>
            </div>
          );
        })
      ) : foodOrdered.length === 0 ? (
        <div className={cx("title")}>Hiện tại vẫn chưa có món</div>
      ) : (
        <div className={cx("title")}>
          Vẫn còn {countFoodOrdered} món chưa được hoàn thành
        </div>
      )}
    </div>
  );
};

export default ContentServeNotification;
