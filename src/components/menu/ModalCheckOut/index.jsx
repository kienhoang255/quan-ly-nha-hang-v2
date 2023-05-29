import React, { useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Logo from "../../Logo";
import Button from "../../Button";
import { FiAlertCircle } from "react-icons/fi";
import PDF from "../../PDF";
import moment from "moment/moment";
import { formatVND, numberWithCommas } from "../../../utils";
import Modal from "../../Modal";
import ModalLoader from "../../ModalLoader";
const cx = classNames.bind(styles);

const ModalCheckOut = ({
  handleCloseModalCheckOut,
  billDetail,
  tableServing,
  totalPay,
  handleCheckOut,
  modalCheckOutFetch,
}) => {
  const foodServed = useMemo(
    () => billDetail?.foods?.find((food) => food.status === "cooking"),
    [billDetail]
  );

  const handleDownloadBill = () => {
    PDF();
    handleCheckOut(billDetail?.bill?._id);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <Logo />
      </div>
      <div className={cx("body")}>
        {foodServed ? (
          <div className={cx("")}>
            <div className={cx("icon")}>
              <FiAlertCircle />
            </div>
            <div className={cx("alert_content")}>
              Vẫn còn món chưa được phục vụ
            </div>
          </div>
        ) : (
          <div className={cx("bill_content")}>
            <div
              id="canvas"
              className={cx("canvas")}
              style={{ backgroundColor: "white" }}
            >
              <div className={cx("canvas_title")}>NHÀ HÀNG TRUNG KIÊN</div>
              <div className={cx("canvas_title_sub")}>
                Đ/C: 180 Cao Lỗ, Q8, TPHCM
              </div>
              <div className={cx("canvas_title_sub")}>
                Tel: 0912345678 Hotline: 0987654321
              </div>
              <div className={cx("canvas_main_title")}>HÓA ĐƠN THANH TOÁN</div>
              <div className={cx("canvas_title_sub")}>
                Mã HĐ: {tableServing.id_bill[0]}
              </div>
              <div className={cx("split")}>
                <div className={cx("canvas_text")}>
                  Bàn: {tableServing?.nameTable}
                </div>
                <div className={cx("canvas_text")}>
                  Mã KH: {billDetail.bill?.id_client}
                </div>
              </div>
              <div className={cx("split")}>
                <div className={cx("canvas_text")}>
                  Tầng: {tableServing?.stage}
                </div>
                <div className={cx("canvas_text")}>
                  Ngày:
                  {moment(billDetail.bill?.createdAt).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className={cx("split")}>
                <div className={cx("canvas_text")}>
                  Giờ vào:
                  {moment(billDetail.bill?.createdAt).format("HH:mm:ss")}
                </div>
                <div className={cx("canvas_text")}>
                  Giờ ra: {moment([]).format("HH:mm:ss")}
                </div>
              </div>

              <div className={cx("table")}>
                <div className={cx("table_header")}>
                  <div className={cx("table_header_cell")}>Món</div>
                  <div className={cx("table_header_cell")}>SL</div>
                  <div className={cx("table_header_cell")}>Đơn giá</div>
                  <div className={cx("table_header_cell")}>Thành tiền</div>
                </div>

                {billDetail?.foods
                  .filter((e) => e.status === "served")
                  .map((e, key) => (
                    <div key={key} className={cx("table_body")}>
                      <div className={cx("table_body_cell")}>
                        {billDetail.name[e.id_food]}
                      </div>
                      <div className={cx("table_body_cell")}>{e?.quantity}</div>
                      <div className={cx("table_body_cell")}>
                        {numberWithCommas(e.price)}
                      </div>
                      <div className={cx("table_body_cell")}>
                        {numberWithCommas(e?.price * e?.quantity)}
                      </div>
                    </div>
                  ))}
              </div>

              <div className={cx("split")}>
                <div className={cx("totalMoney")}>Thành tiền:</div>
                <div className={cx("totalMoney")}>{totalPay}</div>
              </div>
              <div className={cx("split")}>
                <div className={cx("discount")}>Giảm giá:</div>
                <div className={cx("discount")}> </div>
              </div>
              <div className={cx("divider")}>
                <div className={cx("split")}>
                  <div className={cx("totalPay")}>Tổng: </div>
                  <div className={cx("totalPay")}>{totalPay}</div>
                </div>
              </div>
              <div className={cx("canvas_footer")}>
                Cảm ơn quý khách. Hẹn gặp lại.!
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={cx("footer")}>
        <Button onClick={handleCloseModalCheckOut} variant="outline">
          Đóng
        </Button>
        <Button
          onClick={() => {
            if (foodServed) {
              handleCloseModalCheckOut();
            } else {
              handleDownloadBill();
            }
          }}
        >
          Đồng ý
        </Button>
      </div>
      <ModalLoader show={modalCheckOutFetch} />
    </div>
  );
};

export default ModalCheckOut;
