import React, { memo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import Logo from "../../Logo";
import Button from "../../Button";
import { formatVND } from "../../../utils";

const cx = classNames.bind(styles);

const ModalContentCartOrder = ({
  handleCloseModal,
  foodSelecting,
  totalPriceOnOrder,
  handleOnClickIncreaseFood,
  handleOnClickDecreaseFood,
  handleOnOrderFood,
}) => {
  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <Logo />
      </div>
      <div className={cx("body")}>
        <div className={cx("table")}>
          <div className={cx("headerTable")}>
            <div className={cx("mid")}>NO.</div>
            <div className={cx("left")}>TÊN</div>
            <div className={cx("mid")}>SỐ LƯỢNG</div>
            <div className={cx("right")}>GIÁ</div>
          </div>
          <div className={cx("wrap")}>
            {foodSelecting.map((e, key) => (
              <div className={cx("bodyTable")} key={key}>
                <div className={cx("mid")}>{key + 1}</div>
                <div className={cx("left")}>{e.name}</div>
                <div className={cx("mid")}>
                  <div className={cx("action")}>
                    <Button
                      className={cx("actionBtn")}
                      variant="circle"
                      onClick={() => {
                        handleOnClickDecreaseFood(
                          e.id_food,
                          e.name,
                          e.price,
                          e.quantity
                        );
                      }}
                    >
                      <MdKeyboardArrowLeft />
                    </Button>
                    <span>{e.quantity}</span>
                    <Button
                      className={cx("actionBtn")}
                      variant="circle"
                      onClick={() => {
                        handleOnClickIncreaseFood(
                          e.id_food,
                          e.name,
                          e.price,
                          e.quantity
                        );
                      }}
                    >
                      <MdKeyboardArrowRight />
                    </Button>
                  </div>
                </div>
                <div className={cx("right")}>{formatVND(e.price)}</div>
              </div>
            ))}
          </div>
          <div className={cx("footerTable")}>
            <div className={cx("total")}>Tổng</div>
            <div className={cx("totalPrice")}>
              {formatVND(totalPriceOnOrder)}
            </div>
          </div>
        </div>
      </div>
      <div className={cx("footer")}>
        <Button
          className={cx("footerBtn")}
          onClick={handleCloseModal}
          variant="outline"
        >
          Đóng
        </Button>
        <Button className={cx("footerBtn")} onClick={handleOnOrderFood}>
          Đặt món
        </Button>
      </div>
    </div>
  );
};

export default memo(ModalContentCartOrder);
