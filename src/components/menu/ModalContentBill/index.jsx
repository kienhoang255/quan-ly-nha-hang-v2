import React, { memo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Logo from "../../Logo";
import Button from "../../Button";

const cx = classNames.bind(styles);

const ModalContentBill = ({ handleCloseModal }) => {
  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("logo")}>
          <Logo />
        </div>
        <div className={cx("clientInfo")}>
          <div className={cx("detail")}>
            <div className={cx("name")}>Email/SDT:</div>
            <div className={cx("value")}>123</div>
          </div>
          <div className={cx("detail")}>
            <div className={cx("name")}>Thời gian bắt đầu:</div>
            <div className={cx("value")}>123</div>
          </div>
          <div className={cx("detail")}>
            <div className={cx("name")}>Thời gian kết thúc:</div>
            <div className={cx("value")}>123</div>
          </div>
        </div>
      </div>
      <div className={cx("body")}>
        <div className={cx("table")}>
          <div className={cx("headerTable")}>
            <div className={cx("mid")}>NO.</div>
            <div className={cx("left")}>TÊN</div>
            <div className={cx("mid")}>Trang thai</div>
            <div className={cx("mid")}>SỐ LƯỢNG</div>
            <div className={cx("right")}>GIÁ</div>
          </div>
          <div className={cx("bodyTable")}>
            <div className={cx("mid")}>NO.</div>
            <div className={cx("left")}>TÊN</div>
            <div className={cx("mid")}>Trang thai</div>
            <div className={cx("mid")}>SỐ LƯỢNG</div>
            <div className={cx("right")}>GIÁ</div>
          </div>
        </div>
      </div>
      <div className={cx("footer")}>
        <div className={cx("totalPrice")}>
          <div>tong</div>
          <div>90000</div>
        </div>
        <div className={cx("totalPrice")}>
          <div>tong</div>
          <div>90000</div>
        </div>
        <div className={cx("actionBtn")}>
          <Button onClick={handleCloseModal} variant="outline">
            Hủy
          </Button>
          <Button>Thanh toán</Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalContentBill);
