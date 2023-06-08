import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { IoNotifications } from "react-icons/io5";
import { GoPrimitiveDot } from "react-icons/go";
import Tippy from "@tippyjs/react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import moment from "moment";
import "moment/dist/locale/vi";
import { isSeen } from "../../redux/notiSlice";

const cx = classNames.bind(styles);

const IconNotification = ({ icon = <IoNotifications /> }) => {
  const dispatch = useDispatch();
  const notification = useSelector((s) => s.noti);
  const foodOrdered = useSelector((state) => state.foodOrdered.foodOrdered);
  moment.locale("vi");

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(notification.alert);
  }, [notification]);

  const countFoodOrdered = useMemo(() => {
    let count = 0;
    foodOrdered.forEach((element) => {
      if (element.status === "cooking") count += 1;
    });
    return count;
  }, [foodOrdered]);

  const contentTippy = useMemo(() => {
    return (
      <div className={cx("containerTippy")}>
        {notification.data[0] ? (
          notification.data.map((e, key) => {
            return (
              <div key={key} className={cx("item")}>
                <div className={cx("title")}>{e.message}</div>
                <div className={cx("subTitle")}>
                  <div>{moment(e.timeOrder).fromNow()}</div>
                  <Button
                    to={e.title === "order" ? "/order" : "/table"}
                    className={cx("btn")}
                    onClick={() => {
                      dispatch(isSeen());
                    }}
                  >
                    Đến xem
                  </Button>
                </div>
              </div>
            );
          })
        ) : foodOrdered.length === 0 ? (
          <div>Hiện tại vẫn chưa có món</div>
        ) : (
          <div>Vẫn còn {countFoodOrdered} chưa được hoàn thành</div>
        )}
      </div>
    );
  }, [notification.data, foodOrdered]);

  return (
    <div className={cx("container")} onClick={() => setIsShow(!isShow)}>
      {notification.alert && (
        <div className={cx("redDot")}>
          <GoPrimitiveDot />
        </div>
      )}
      <Tippy
        visible={isShow}
        onTrigger={() => setIsShow(true)}
        onClickOutside={() => setIsShow(false)}
        interactive={true}
        placement="bottom-end"
        content={contentTippy}
      >
        <div className={cx("icon")}>{icon}</div>
      </Tippy>
    </div>
  );
};

export default IconNotification;
