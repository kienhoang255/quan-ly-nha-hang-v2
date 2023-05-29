import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import TextInput from "../../components/TextInput";
import Pagination from "../../components/Pagination";
import Skeleton from "../../components/Skeleton";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

import { BsDownload } from "react-icons/bs";
import moment from "moment";
import { BillAPI } from "../../services";
import { formatVND, numberWithCommas } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setBill, setTotalPage } from "../../redux/billSlice";

const cx = classNames.bind(styles);

const BillHistory = () => {
  const dispatch = useDispatch();

  const bill = useSelector((s) => s.bill.bill);
  const totalPage = useSelector((state) => state.bill.totalPage);

  const refsById = useMemo(() => {
    const refs = {};
    bill.forEach((item) => {
      refs[item._id] = React.createRef(null);
    });
    return refs;
  }, [bill]);

  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState({
    q: "",
    page: 0,
    timeDebounce: 0,
    date: moment([]).format("yyyy-MM-DD"),
  });

  useEffect(() => {
    setFetching(true);
    const debounce = setTimeout(() => {
      handleSearch();
      setFetching(false);
    }, search.timeDebounce);

    return () => clearTimeout(debounce);
  }, [search]);

  const handleSearch = () => {
    BillAPI.searchBill(search).then((res) => {
      const count = res.data.paginationCount;
      dispatch(setBill(res.data.data));
      dispatch(setTotalPage(res.data.paginationPage));
    });
  };

  const handleOnChangePagination = (e) => {
    setSearch((prev) => ({ ...prev, page: e - 1, timeDebounce: 0 }));
  };

  const handleCloseModal = (id) => {
    refsById[id].current.closeModal();
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>LỊCH SỬ GIAO DỊCH</div>
      <div className={cx("search")}>
        <TextInput
          placeholder="Tìm kiếm"
          value={search?.q}
          rightIcon
          onChange={(e) => {
            setSearch((prev) => ({
              ...prev,
              q: e.target.value,
              timeDebounce: 700,
            }));
          }}
          onClear={(e) => {
            setSearch((prev) => ({ ...prev, q: "", timeDebounce: 700 }));
          }}
        />
        <TextInput
          type="date"
          placeholder="Tìm kiếm"
          value={search.date}
          rightIcon
          onChange={(e) => {
            setSearch((prev) => ({
              ...prev,
              date: e.target.value,
              timeDebounce: 700,
            }));
          }}
          onClear={(e) => {
            setSearch((prev) => ({ ...prev, date: "", timeDebounce: 700 }));
          }}
        />
      </div>

      <div className={cx("content")}>
        {fetching ? (
          <div className={cx("wrap")}>
            <Skeleton className={cx("skeleton")} />
            <Skeleton className={cx("skeleton")} />
          </div>
        ) : (
          <div className={cx("wrap")}>
            {bill?.map((e, key) => (
              <Modal
                ref={refsById[e._id]}
                key={key}
                component={
                  <div className={cx("modal_container")}>
                    <div className={cx("modal_content")}>
                      <div
                        id="canvas"
                        className={cx("canvas")}
                        style={{ backgroundColor: "white" }}
                      >
                        <div className={cx("canvas_title")}>
                          NHÀ HÀNG TRUNG KIÊN
                        </div>
                        <div className={cx("canvas_title_sub")}>
                          Đ/C: 180 Cao Lỗ, Q8, TPHCM
                        </div>
                        <div className={cx("canvas_title_sub")}>
                          Tel: 0912345678 Hotline: 0987654321
                        </div>
                        <div className={cx("canvas_main_title")}>
                          HÓA ĐƠN THANH TOÁN
                        </div>
                        <div className={cx("canvas_title_sub")}>
                          Mã HĐ: {e._id}
                        </div>
                        <div className={cx("split")}>
                          <div className={cx("canvas_text")}>Bàn: {}</div>
                          <div className={cx("canvas_text")}>
                            Mã KH: {e.id_client}
                          </div>
                        </div>
                        <div className={cx("split")}>
                          <div className={cx("canvas_text")}>Tầng: {}</div>
                          <div className={cx("canvas_text")}>
                            Ngày:
                            {moment(e.createdAt).format("DD/MM/YYYY")}
                          </div>
                        </div>
                        <div className={cx("split")}>
                          <div className={cx("canvas_text")}>
                            Giờ vào:
                            {moment(e.createdAt).format("HH:mm:ss")}
                          </div>
                          <div className={cx("canvas_text")}>
                            Giờ ra: {moment(e.updatedAt).format("HH:mm:ss")}
                          </div>
                        </div>

                        <div className={cx("table")}>
                          <div className={cx("table_header")}>
                            <div className={cx("table_header_cell")}>Món</div>
                            <div className={cx("table_header_cell")}>SL</div>
                            <div className={cx("table_header_cell")}>
                              Đơn giá
                            </div>
                            <div className={cx("table_header_cell")}>
                              Thành tiền
                            </div>
                          </div>

                          {e.orders
                            ?.filter((e) => e.status === "served")
                            ?.map((e, key) => (
                              <div key={key} className={cx("table_body")}>
                                <div className={cx("table_body_cell")}>
                                  {/* {data?.name[e.id_food]} */}
                                  {/* {e?.id_food} */}
                                </div>
                                <div className={cx("table_body_cell")}>
                                  {e?.quantity}
                                </div>
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
                          <div className={cx("totalMoney")}>{}</div>
                        </div>
                        <div className={cx("split")}>
                          <div className={cx("discount")}>Giảm giá:</div>
                          <div className={cx("discount")}> </div>
                        </div>
                        <div className={cx("divider")}>
                          <div className={cx("split")}>
                            <div className={cx("totalPay")}>Tổng: </div>
                            <div className={cx("totalPay")}>{}</div>
                          </div>
                        </div>
                        <div className={cx("canvas_footer")}>
                          Cảm ơn quý khách. Hẹn gặp lại.!
                        </div>
                      </div>
                    </div>
                    <div className={cx("modal_footer")}>
                      <Button
                        variant="outline"
                        onClick={() => handleCloseModal(e._id)}
                      >
                        Đóng
                      </Button>
                      <Button>
                        <BsDownload />
                      </Button>
                    </div>
                  </div>
                }
              >
                <div className={cx("card", e?.status)}>
                  <div className={cx("tag")}>
                    Mã HĐ:
                    <div className={cx("text")}>{e._id}</div>
                  </div>
                  <div className={cx("tag")}>
                    Mã KH:
                    <div className={cx("text")}>{e.id_client}</div>
                  </div>
                  <div className={cx("tag")}>
                    Ngày GD:
                    <div className={cx("text")}>
                      {moment(e.updatedAt).format("DD-MM-YYYY")}
                    </div>
                  </div>
                  <div className={cx("tag")}>
                    Tổng trả:
                    <div className={cx("text")}>
                      {formatVND(e.totalPrice || 0)}
                    </div>
                  </div>
                </div>
              </Modal>
            ))}
          </div>
        )}
      </div>

      <Pagination
        start={1}
        end={totalPage}
        onChange={handleOnChangePagination}
        className={cx("pagination")}
      />
    </div>
  );
};

export default BillHistory;
