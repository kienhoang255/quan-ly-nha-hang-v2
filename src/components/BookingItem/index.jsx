import React, { useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Button from "../Button";
import Modal from "../Modal";
import TextInput from "../TextInput";
import moment from "moment";
import ModalInfoBooking from "../ModalInfoBooking";

const cx = classNames.bind(styles);

const BookingItem = ({
  data,
  table,
  getTableById,
  handleUpdateBooking,
  refs,
  handleCloseModalBooking,
}) => {
  const tableName = useMemo(() => {
    const find = table.find((e) => e._id === data.id_table)?.name;
    if (!find) getTableById(data?.id_table);
    return find || "...";
  }, [data, table]);

  return (
    <div className={cx("container")}>
      <div className={cx("right")}>
        <div className={cx("text")}>
          Bàn:&nbsp; <div className={cx("textContent")}>{tableName}</div>
        </div>
        <div className={cx("")}>
          Yêu cầu đặt biệt:&nbsp;
          <div className={cx("textContent")}>{data?.specialRequired}</div>
        </div>
      </div>
      <div className={cx("left")}>
        <div>
          <div className={cx("text")}>
            Ngày:&nbsp;
            <div className={cx("textContent")}>
              {moment(data.dateCheckIn).format("DD-MM-yyyy")}
            </div>
          </div>
          <div className={cx("text")}>
            Vào lúc:&nbsp;
            <div className={cx("textContent")}>
              {data.timeCheckIn.slice(0, 2)}h{data.timeCheckIn.slice(2, 4)}
            </div>
          </div>
        </div>
        <Modal
          ref={refs}
          component={
            <ModalInfoBooking
              data={data}
              handleUpdateBooking={handleUpdateBooking}
              handleCloseModalBooking={handleCloseModalBooking}
            />
          }
        >
          <Button>Xem</Button>
        </Modal>
      </div>
    </div>
  );
};

export default BookingItem;
