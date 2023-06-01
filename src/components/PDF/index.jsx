import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import moment from "moment";
import { formatVND, numberWithCommas } from "../../utils";
import Button from "../Button";
import { BsDownload } from "react-icons/bs";
import { BillAPI } from "../../services";

const cx = classNames.bind(styles);

const PDF = ({ data, onClick, handleCloseModal }) => {
  const [fetching, setFetching] = useState(true);
  const [billInfo, setBillInfo] = useState();

  const handleOnClick = async () => {
    const data = document.getElementById("canvas");
    var doc = new jsPDF("p", "mm", "a4");
    await html2canvas(data, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((res) => {
      const imgWidth = 208;
      doc.addImage(res.toDataURL("image/png"), "PNG", 0, 0, imgWidth, 300);
    });
    doc.save("hoadon.pdf");

    onClick();
  };

  useEffect(() => {
    setFetching(true);
    BillAPI.getAllInfo({
      id_table: data.id_table,
      id_client: data.id_client,
      id_bill: data._id,
    }).then((res) => {
      setBillInfo(res.data);

      setFetching(false);
    });
  }, []);

  const totalPay = useMemo(
    () =>
      formatVND(
        data.orders
          ?.filter((e) => e.status === "served")
          .reduce((acc, cur) => acc + cur.price * cur.quantity, 0)
      ),
    [data]
  );

  return (
    <div className={cx("modal_container")}>
      <div className={cx("modal_content")}>
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
          <div className={cx("canvas_title_sub")}>Mã HĐ: {data._id}</div>
          <div className={cx("split")}>
            <div className={cx("canvas_text")}>Bàn: {billInfo?.name}</div>
            <div className={cx("canvas_text")}>Mã KH: {data.id_client}</div>
          </div>
          <div className={cx("split")}>
            <div className={cx("canvas_text")}>Tầng: {billInfo?.stage}</div>
            <div className={cx("canvas_text")}>
              Ngày:
              {moment(data.createdAt).format("DD/MM/YYYY")}
            </div>
          </div>
          <div className={cx("split")}>
            <div className={cx("canvas_text")}>
              Giờ vào:
              {moment(data.createdAt).format("HH:mm:ss")}
            </div>
            <div className={cx("canvas_text")}>
              Giờ ra: {moment(data.updatedAt).format("HH:mm:ss")}
            </div>
          </div>

          <div className={cx("table")}>
            <div className={cx("table_header")}>
              <div className={cx("table_header_cell")}>Món</div>
              <div className={cx("table_header_cell")}>SL</div>
              <div className={cx("table_header_cell")}>Đơn giá</div>
              <div className={cx("table_header_cell")}>Thành tiền</div>
            </div>

            {fetching
              ? "Loading..."
              : data.orders
                  ?.filter((e) => e.status === "served")
                  ?.map((e, key) => (
                    <div key={key} className={cx("table_body")}>
                      <div className={cx("table_body_cell")}>
                        {billInfo?.foodName[e.id_food]}
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
            <div className={cx("totalMoney")}>Thành tiền: </div>
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
      <div className={cx("modal_footer")}>
        <Button variant="outline" onClick={() => handleCloseModal(data._id)}>
          Đóng
        </Button>
        <Button onClick={handleOnClick} disable={fetching}>
          <BsDownload />
        </Button>
      </div>
    </div>
  );
};
export default PDF;
