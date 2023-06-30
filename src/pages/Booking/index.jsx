import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import BookingItem from "../../components/BookingItem";
import CheckBox from "../../components/CheckBox";
import Pagination from "../../components/Pagination";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import TableBookingItem from "../../components/TableBookingItem";
import Skeleton from "../../components/Skeleton";
import ModalLoader from "../../components/ModalLoader";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  addTable2,
  setOptions,
  setStage,
  setTableBooking,
  setTableImage,
} from "../../redux/tableSlice";
import { BookingAPI, TableAPI } from "../../services";
import { setBooking, updateBooking } from "../../redux/bookingSlice";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Modal from "../../components/Modal";

const cx = classNames.bind(styles);

const Booking = () => {
  const dispatch = useDispatch();
  const stage = useSelector((stage) => stage.table.stage);
  const options = useSelector((stage) => stage.table.options);
  const booking = useSelector((stage) => stage.booking);
  const tableBooking = useSelector((stage) => stage.table.tableBooking);
  const table2 = useSelector((stage) => stage.table.table2);
  const tableImage = useSelector((stage) => stage.table.tableImage);

  const [modeBooking, setModeBooking] = useState();
  const [modeBookingDelay, setModeBookingDelay] = useState();
  const [onSearching, setOnSearching] = useState(false);
  const [onCreateBooking, setOnCreateBooking] = useState(false);
  const [onCreateSuccess, setOnCreateSuccess] = useState(false);
  const [onCreateFailed, setOnCreateFailed] = useState(false);
  const [disableOnChangeFilter, setDisableOnChangeFilter] = useState(false);
  const [onFetching, setOnFetching] = useState(false);

  const [search, setSearch] = useState({
    dateCheckIn: moment([]).format("yyyy-MM-DD"),
    status: "pending",
    page: 0,
    debounce: 700,
  });

  const [searchBooking, setSearchBooking] = useState({
    timeCheckIn: "9:00",
    dateCheckIn: moment([]).add(1, "day").format("YYYY-MM-DD"),
    stage: "1",
    options: [],
  });

  const [searchBookingErr, setSearchBookingErr] = useState({});

  const refsById = useMemo(() => {
    const refs = {};
    tableBooking.forEach((item) => {
      refs[item._id] = React.createRef(null);
    });
    return refs;
  }, [tableBooking]);

  const refsBookingById = useMemo(() => {
    const refs = {};
    booking.booking.forEach((item) => {
      refs[item._id] = React.createRef(null);
    });
    return refs;
  }, [booking.booking]);

  // For first time render
  useEffect(() => {
    TableAPI.getStage().then((res) => {
      dispatch(setStage(res.data));
    });
  }, []);

  useEffect(() => {
    handleSearchBooking();
  }, [search]);

  useEffect(() => {
    if (searchBooking?.options.length > 0) {
      setOnSearching(true);
      TableAPI.searchTableByFilter({
        timeCheckIn: searchBooking.timeCheckIn,
        dateCheckIn: searchBooking.dateCheckIn,
        options: searchBooking.options,
        stage: searchBooking.stage,
        numOfPeople: searchBooking.numOfPeople,
      }).then((res) => {
        dispatch(setTableBooking(res.data));
        if (res.data.length == 0) {
          setSearchBookingErr(searchBooking);
        }
        setOnSearching(false);
        setDisableOnChangeFilter(false);
      });
    } else {
      handleSearchTable();
      setDisableOnChangeFilter(false);
    }
  }, [searchBooking.options]);

  useEffect(() => {
    if (searchBooking?.options.length > 0) {
      let optionsNew = [];
      tableBooking.map((t) => {
        if (tableImage[t._id]) {
          optionsNew.push(...tableImage[t._id].options);
        }
      });
      const newOptions = new Set(optionsNew);
      if (optionsNew.length > 0) {
        dispatch(setOptions([...newOptions]));
      }
    } else {
      TableAPI.getTableOptionsOnly().then((res) => {
        dispatch(setOptions(res.data.data));
      });
    }
  }, [tableBooking, tableImage]);

  const handleGetTableImage = (id) => {
    if (!tableImage[id]) {
      TableAPI.getTableImage(id).then((res) => {
        if (res.data.data) dispatch(setTableImage(res.data.data));
      });
    }
  };

  const getTableById = (id) => {
    TableAPI.getTableById(id).then((res) => {
      dispatch(addTable2(res.data));
    });
  };

  const handleChangeModeOrder = () => {
    setModeBooking(!modeBooking);
    setTimeout(() => {
      setModeBookingDelay(!modeBooking);
    }, 1000);
  };

  const timePickList = useMemo(() => {
    let result = [];
    let start = 9;
    let end = 18;
    const timeZone = ["00", "30"];
    for (start; start <= end; start++) {
      timeZone.forEach((e) => {
        result.push(`${start}:${e}`);
      });
    }
    return result;
  }, []);

  const handleSearchTable = () => {
    setOnSearching(true);
    TableAPI.searchTableBooking(searchBooking).then((res) => {
      dispatch(setTableBooking(res.data));
      if (res.data.length == 0) {
        setSearchBookingErr(searchBooking);
      }
      setOnSearching(false);
    });
  };

  const handleCreateBooking = (data) => {
    setOnCreateBooking(true);
    BookingAPI.createBooking(data)
      .then((res) => {
        refsById[data.id_table].current.closeModal();
        setSearchBooking((prev) => ({ ...prev, options: [] }));
        handleSearchTable();
        setOnCreateBooking(false);
        setOnCreateSuccess(true);
      })
      .catch((err) => {
        refsById[data.id_table].current.closeModal();
        setSearchBooking((prev) => ({ ...prev, options: [] }));
        handleSearchTable();
        setOnCreateBooking(false);
        setOnCreateFailed(true);
      });
  };

  const handleCloseModalCreateBooking = (id) => {
    refsById[id].current.closeModal();
  };

  const handleSearchBooking = () => {
    setOnFetching(true);
    BookingAPI.getBooking({
      dateCheckIn: search.dateCheckIn,
      status: search.status,
      page: search.page,
    }).then((res) => {
      dispatch(setBooking(res.data));
      setOnFetching(false);
    });
  };

  const handleOnChangePagination = (e) => {
    setSearch((prev) => ({ ...prev, page: e - 1 }));
  };

  const handleCloseModalBooking = (id) => {
    refsBookingById[id].current.closeModal();
  };

  const handleUpdateBooking = (data) => {
    BookingAPI.updateBooking(data).then((res) => {
      handleCloseModalBooking(data._id);
      dispatch(updateBooking(res.data));
    });
  };

  return (
    <div
      className={cx(
        "container",
        modeBooking === undefined
          ? ""
          : modeBooking
          ? "listBooked"
          : "listBooking"
      )}
    >
      <div className={cx("left")}>
        {!modeBooking && (
          <>
            <div className={cx("leftSearch")}>
              <div className={cx("leftSearchInput")}>
                <TextInput
                  placeholder="Tìm theo ngày"
                  type="date"
                  value={search.dateCheckIn}
                  onChange={(e) => {
                    setSearch((prev) => ({
                      ...prev,
                      dateCheckIn: e.target.value,
                    }));
                  }}
                />
              </div>
              <div
                className={cx(
                  "action",
                  search?.status === "used" && "used",
                  search?.status === "pending" && "pending",
                  search?.status === "cancel" && "cancel"
                )}
              >
                <CheckBox
                  className={cx(
                    "pending",
                    search?.status != "pending" && "notActive"
                  )}
                  label="Chưa dùng"
                  id="pending"
                  type="radio"
                  name="status"
                  active={search?.status === "pending" && true}
                  onChange={() => {
                    setSearch((prev) => ({
                      ...prev,
                      status: "pending",
                      timeDebounce: 700,
                    }));
                  }}
                />
                <CheckBox
                  className={cx(
                    "used",
                    search?.status != "used" && "notActive"
                  )}
                  label="Đã dùng"
                  id="used"
                  type="radio"
                  name="status"
                  active={search?.status === "used" && true}
                  onChange={() => {
                    setSearch((prev) => ({
                      ...prev,
                      status: "used",
                      timeDebounce: 700,
                    }));
                  }}
                />
                <CheckBox
                  className={cx(
                    "cancel",
                    search.status != "cancel" && "notActive"
                  )}
                  label="Đã hủy"
                  id="cancel"
                  type="radio"
                  name="status"
                  active={search?.status === "cancel" && true}
                  onChange={() => {
                    setSearch((prev) => ({
                      ...prev,
                      status: "cancel",
                      timeDebounce: 700,
                    }));
                  }}
                />
              </div>
            </div>
            <div className={cx("listBook")}>
              {onFetching ? (
                <>
                  <Skeleton className={cx("listBookingItem")} />
                  <Skeleton className={cx("listBookingItem")} />
                </>
              ) : booking.booking.length == 0 ? (
                <div className={cx("listBookNotification")}>
                  Ngày: {search.dateCheckIn} không có bất kỳ đơn đặt bàn nào!
                </div>
              ) : (
                booking.booking?.map((e, key) => {
                  if (e.status === search.status)
                    return (
                      <BookingItem
                        key={key}
                        data={e}
                        table={table2}
                        getTableById={getTableById}
                        handleUpdateBooking={handleUpdateBooking}
                        refs={refsBookingById[e._id]}
                        handleCloseModalBooking={handleCloseModalBooking}
                      />
                    );
                })
              )}
            </div>
            <Pagination
              start={1}
              end={booking.paginationPage}
              onChange={handleOnChangePagination}
            />
          </>
        )}
      </div>
      <div className={cx("mid")}>
        {modeBookingDelay && (
          <Button onClick={handleChangeModeOrder} className={cx("leftBtn")}>
            <IoIosArrowForward />
          </Button>
        )}
        {!modeBookingDelay && (
          <Button onClick={handleChangeModeOrder} className={cx("rightBtn")}>
            <IoIosArrowBack />
          </Button>
        )}
      </div>
      <div className={cx("right")}>
        {modeBooking && (
          <div className={cx("right")}>
            <div className={cx("rightSearch")}>
              <div className={cx("rightSearchTitle")}>TÌM</div>
              <TextInput
                dropdown
                autoComplete
                rightIcon
                value={searchBooking?.timeCheckIn}
                listDropdown={timePickList}
                placeholder="Thời gian checkIn"
                className={cx("rightSearchText1")}
                onClear={(e) => {
                  setSearchBooking((prev) => ({
                    ...prev,
                    timeCheckIn: e,
                  }));
                }}
                onChange={(e) => {
                  setSearchBooking((prev) => ({
                    ...prev,
                    timeCheckIn: e.target.value,
                  }));
                }}
                setInputValueOnDropdown={(e) => {
                  setSearchBooking((prev) => ({
                    ...prev,
                    timeCheckIn: e,
                  }));
                }}
              />
              <TextInput
                type="date"
                value={searchBooking?.dateCheckIn}
                min={moment([]).add(1, "day").format("yyyy-MM-DD")}
                max={moment([]).add(14, "day").format("yyyy-MM-DD")}
                placeholder="Ngày checkIn"
                className={cx("rightSearchText")}
                onChange={(e) => {
                  setSearchBooking((prev) => ({
                    ...prev,
                    dateCheckIn: e.target.value,
                  }));
                }}
              />
              <TextInput
                value={
                  searchBooking?.numOfPeople ? searchBooking?.numOfPeople : ""
                }
                type="number"
                placeholder="Số lượng người"
                className={cx("rightSearchText")}
                onChange={(e) => {
                  if (Number(e.target.value) || e.target.value == 0)
                    setSearchBooking((prev) => ({
                      ...prev,
                      numOfPeople: e.target.value,
                    }));
                }}
              />
              <TextInput
                dropdown
                rightIcon
                listDropdown={stage}
                type="number"
                value={searchBooking?.stage}
                placeholder="Tầng"
                className={cx("rightSearchText1")}
                onChange={(e) => {
                  if (Number(e.target.value) || e.target.value == 0)
                    setSearchBooking((prev) => ({
                      ...prev,
                      stage: e.target.value,
                    }));
                }}
                onClear={(e) => {
                  setSearchBooking((prev) => ({
                    ...prev,
                    stage: e,
                  }));
                }}
                setInputValueOnDropdown={(e) => {
                  setSearchBooking((prev) => ({
                    ...prev,
                    stage: e,
                  }));
                }}
              />
              <Button
                className={cx("rightSearchBtn")}
                onClick={() => {
                  handleSearchTable();
                  setSearchBooking((prev) => ({ ...prev, options: [] }));
                }}
              >
                Tìm
              </Button>
            </div>
            <div className={cx("rightList")}>
              {onSearching ? (
                <>
                  <Skeleton className={cx("skeletonTableBookingItem")} />
                  <Skeleton className={cx("skeletonTableBookingItem")} />
                </>
              ) : tableBooking.length == 0 ? (
                <div className={cx("rightListNotification")}>
                  <div className={cx("rightListNotificationTitle")}>
                    Chúng tôi không thể tìm thấy bàn chưa đặt
                    <div className={cx("rightListNotificationTitle1")}>
                      Vào ngày:&nbsp;
                      <div className={cx("rightListNotificationTitle2")}>
                        {searchBookingErr?.dateCheckIn}
                      </div>
                    </div>
                    <div className={cx("rightListNotificationTitle1")}>
                      Vào thời gian:&nbsp;
                      <div className={cx("rightListNotificationTitle2")}>
                        {searchBookingErr?.timeCheckIn}
                      </div>
                    </div>
                    <div className={cx("rightListNotificationTitle1")}>
                      Tầng:&nbsp;
                      <div className={cx("rightListNotificationTitle2")}>
                        {searchBookingErr?.stage}
                      </div>
                    </div>
                    <ul>
                      Theo tiêu chí:
                      {searchBookingErr?.options?.map((e, key) => (
                        <li key={key}>{e}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={cx("rightListNotificationTitleSub")}>
                    Vui lòng đặt ngày khác, giờ khác hoặc xóa bộ lọc!
                  </div>
                </div>
              ) : (
                tableBooking.map((e, key) => {
                  return (
                    <TableBookingItem
                      refs={refsById[e?._id]}
                      key={key}
                      data={e}
                      handleGetTableImage={handleGetTableImage}
                      tableImage={tableImage}
                      dateCheckIn={searchBooking.dateCheckIn}
                      timeCheckIn={searchBooking.timeCheckIn}
                      handleCreateBooking={handleCreateBooking}
                      handleCloseModalCreateBooking={
                        handleCloseModalCreateBooking
                      }
                    />
                  );
                })
              )}
            </div>
            <div className={cx("rightFilter")}>
              <div className={cx("rightFilterTitle")}>Bộ lọc</div>
              {options.map((option, key) => (
                <div key={key} className={cx("checkbox")}>
                  <input
                    disabled={disableOnChangeFilter}
                    className={cx("checkboxInput")}
                    type="checkbox"
                    id={key}
                    name={key}
                    checked={
                      !!searchBooking?.options?.find((e) => e === option)
                    }
                    onChange={(e) => {
                      setDisableOnChangeFilter(true);
                      if (searchBooking?.options?.find((f) => f === option)) {
                        setSearchBooking((prev) => ({
                          ...prev,
                          options: prev.options.filter((fil) => fil !== option),
                        }));
                      } else
                        setSearchBooking((prev) => ({
                          ...prev,
                          options: [...prev?.options, option],
                        }));
                    }}
                  />
                  <label className={cx("checkboxLabel")} htmlFor={key}>
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ModalLoader show={onCreateBooking} />
      <Modal
        open={onCreateSuccess}
        component={
          <div className={cx("modal")}>
            <div className={cx("modalTitle", "modalSuccess")}>
              Đặt bàn thành công
            </div>
            <Button
              className={cx("modalBtn")}
              onClick={() => setOnCreateSuccess(false)}
            >
              Đồng ý
            </Button>
          </div>
        }
      />
      <Modal
        open={onCreateFailed}
        component={
          <div className={cx("modal")}>
            <div className={cx("modalTitle", "modalFailed")}>
              Đặt bàn không thành công
            </div>
            <div className={cx("modalTitleSub")}>Vui lòng thử lại sau!</div>
            <Button
              className={cx("modalBtn")}
              onClick={() => setOnCreateFailed(false)}
            >
              Đồng ý
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default Booking;
