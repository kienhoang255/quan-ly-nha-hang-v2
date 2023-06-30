import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Logo from "../../Logo";
import Button from "../../Button";
import { formatVND } from "../../../utils";
import moment from "moment/moment";
import ModalCheckOut from "../ModalCheckOut";
import Modal from "../../Modal";
import { ImCancelCircle } from "react-icons/im";
import ModalConfirmCancel from "../ModalConfirmCancel";
import { BiTime } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";

const cx = classNames.bind(styles);

const ModalContentBill = ({
  handleCloseModal,
  handleGetBill,
  billDetail,
  tableServing,
  handleCheckOut,
  modalCheckOutFetch,
  modalBillFetch,
  handleCancelFood,
  handleCloseModalCancel,
  refs,
}) => {
  const ref = useRef();

  useEffect(() => {
    handleGetBill();
  }, []);

  const handleCloseModalCheckOut = () => {
    ref.current.closeModal();
  };

  const totalPay = useMemo(
    () =>
      formatVND(
        billDetail?.foods
          ?.filter((e) => e.status === "served")
          .reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
      ),
    [billDetail.foods]
  );

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("logo")}>
          <Logo />
        </div>
        <div className={cx("clientInfo")}>
          <div className={cx("detail")}>
            <div className={cx("name")}>Email/SDT:</div>
            <div className={cx("value")}>{billDetail.customerInfo}</div>
          </div>
          <div className={cx("detail")}>
            <div className={cx("name")}>Thời gian bắt đầu:</div>
            <div className={cx("value")}>
              {moment(billDetail?.bill?.createdAt).format(
                "DD-MM-YYYY HH:mm:ss"
              )}
            </div>
          </div>
          <div className={cx("detail")}>
            <div className={cx("name")}>Thời gian kết thúc:</div>
            <div className={cx("value")}>
              {moment([]).format("DD-MM-YYYY HH:mm:ss")}
            </div>
          </div>
        </div>
      </div>
      <div className={cx("body")}>
        <div className={cx("table")}>
          <div className={cx("headerTable")}>
            <div className={cx("mid")}>NO.</div>
            <div className={cx("left")}>TÊN</div>
            <div className={cx("mid")}>TRẠNG THÁI</div>
            <div className={cx("mid")}>SỐ LƯỢNG</div>
            <div className={cx("right")}>GIÁ</div>
          </div>
          <div className={cx("wrap")}>
            {billDetail?.foods?.map((e, key) => (
              <div
                key={key}
                className={cx("bodyTable", e.status === "cancel" && "cancel")}
              >
                <div className={cx("mid")}>{key + 1}</div>
                <div className={cx("left")}>
                  {modalBillFetch ? "Loading..." : billDetail.name[e?.id_food]}
                </div>
                <div className={cx("mid", e.status)}>
                  {e.status === "cooking"
                    ? "Đang nấu"
                    : e.status === "cancel"
                    ? "Đã hủy"
                    : "Đã hoàn thành"}
                  {e?.status == "cooking" && (
                    <Modal
                      ref={refs[e._id]}
                      component={
                        <ModalConfirmCancel
                          data={e}
                          handleCancelFood={handleCancelFood}
                          handleCloseModalCancel={handleCloseModalCancel}
                          name={
                            modalBillFetch
                              ? "Loading..."
                              : billDetail.name[e?.id_food]
                          }
                        />
                      }
                    >
                      <Button
                        className={cx(
                          "btnCancel",
                          e.cancelRequest === "request" && "request",
                          e.cancelRequest === "reject" && "reject"
                        )}
                      >
                        {e.cancelRequest === "request" ? (
                          <BiTime />
                        ) : e.cancelRequest === "reject" ? (
                          <MdOutlineCancel />
                        ) : (
                          <ImCancelCircle />
                        )}
                      </Button>
                    </Modal>
                  )}
                </div>
                <div className={cx("mid")}>{e.quantity}</div>
                <div className={cx("right")}>{formatVND(e.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cx("footer")}>
        <div className={cx("totalPrice")}>
          <div>Tổng đặt</div>
          <div>
            {formatVND(
              billDetail?.foods?.reduce(
                (acc, cur) => acc + cur.price * cur.quantity,
                0
              )
            )}
          </div>
        </div>
        <div className={cx("totalPrice")}>
          <div>Tổng sử dụng</div>
          <div>{totalPay}</div>
        </div>
        <div className={cx("actionBtn")}>
          <Button onClick={handleCloseModal} variant="outline">
            Hủy
          </Button>
          <Modal
            ref={ref}
            component={
              <ModalCheckOut
                handleCloseModalCheckOut={handleCloseModalCheckOut}
                billDetail={billDetail}
                tableServing={tableServing}
                totalPay={totalPay}
                handleCheckOut={handleCheckOut}
                modalCheckOutFetch={modalCheckOutFetch}
              />
            }
          >
            <Button>Thanh toán</Button>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalContentBill);
