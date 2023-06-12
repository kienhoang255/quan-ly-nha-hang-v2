import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import TextInput from "../../components/TextInput";
import Pagination from "../../components/Pagination";
import Skeleton from "../../components/Skeleton";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

import moment from "moment";
import { BillAPI } from "../../services";
import { formatVND, numberWithCommas } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { setBill, setTotalPage } from "../../redux/billSlice";
import PDF from "../../components/PDF";

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
    date: moment([]).format("MM-DD-YYYY"),
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
          value={moment(search.date).format("yyyy-MM-DD")}
          // value={search.date}
          rightIcon
          onChange={(e) => {
            setSearch((prev) => ({
              ...prev,
              date: moment(e.target.value).format("MM-DD-YYYY"),
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
                component={<PDF handleCloseModal={handleCloseModal} data={e} />}
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
                  <div className={cx("textSub")}>
                    {e.status === "using" &&
                      "Khách hàng vẫn đang sử dụng dịch vụ"}
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
