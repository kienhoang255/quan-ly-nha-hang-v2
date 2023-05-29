import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";

import Button from "../../components/Button";
import TableItem from "../../components/table/TableItem";

import { BillAPI, BookingAPI, TableAPI } from "../../services";
import {
  setStage,
  setStageCalled,
  setTable,
  updateTable,
} from "../../redux/tableSlice";
import { setTableServing } from "../../redux/tableServingSlice";
import { isEmail, isNull, isPhoneNumber } from "../../utils";
import { setBooking } from "../../redux/bookingSlice";
import moment from "moment/moment";

const cx = classNames.bind(styles);

const Table = () => {
  const stage = useSelector((stage) => stage.table.stage);
  const stageCalled = useSelector((stage) => stage.table.stageCalled);
  const table = useSelector((stage) => stage.table.table);
  const booking = useSelector((stage) => stage.booking.booking);

  const ref = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const date = moment([]).format("YYYY-MM-DD");
  const time = moment([]).format("HHmm");

  const [selectedStage, setSelectedStage] = useState();
  const [errMessage, setErrMessage] = useState("");

  const refsById = useMemo(() => {
    const refs = {};
    table.forEach((item) => {
      refs[item._id] = React.createRef(null);
    });
    return refs;
  }, [table]);

  // For first time render
  useEffect(() => {
    // Set selected stage for first render
    setSelectedStage(stage[0]);
    // Check stage exist
    if (!stage[0]) {
      TableAPI.getStage().then((res) => {
        dispatch(setStage(res.data));
        // Set selected stage after call api
        setSelectedStage(res.data[0]);
      });
    }
  }, []);

  // Call api when change 'selectedStage'
  useEffect(() => {
    const checkExistStageCalled = stageCalled.find((e) => e === selectedStage);
    if (!checkExistStageCalled && selectedStage !== undefined) {
      TableAPI.getTableByStage(selectedStage)
        .then((res) => {
          BookingAPI.getBooking(date).then((res1) => {
            dispatch(setBooking(res1.data));
            dispatch(
              setTable({ booking: res1.data, table: res.data, deathTime: time })
            );
          });
          dispatch(setStageCalled(selectedStage));
        })
        .catch((err) => err);
    }
  }, [selectedStage, booking]);

  // When select table, direct to menu and set info table {_id, id_bill}
  const handleOnSelectedTable = (data) => {
    if (data.status === "using") {
      navigate("/menu");
      dispatch(setTableServing(data));

      // When reload website in menu page, table serving redux will disappear
      localStorage.setItem("tableServing", JSON.stringify(data));
    }
  };

  // Change selected stage
  const handleOnClickStage = (stage) => {
    setSelectedStage(stage);
  };

  const handleCheckIn = (value) => {
    // Check value is email/phone
    const validateEmail = (email) => {
      if (!isNull(email)) {
        setErrMessage("Không được để trống");
        return false;
      } else {
        if (!isEmail(email)) {
          if (!isPhoneNumber(email)) {
            setErrMessage("Email hoặc SĐT không hợp lệ");
          } else {
            setErrMessage("");
            return true;
          }
        } else {
          setErrMessage("");
          return true;
        }
      }
    };

    // Create new bill
    if (validateEmail(value.email)) {
      BillAPI.createBill(value).then((res) => {
        const table = res.data.table;
        const bill = res.data.createBill;
        dispatch(updateTable(res.data.table));
        handleCloseModal(value);
        handleOnSelectedTable(table);
      });
    }
  };

  const handleCheckInForWalkInGuest = (value) => {
    // Create new bill
    BillAPI.createBillForWalkInGuest(value).then((res) => {
      const table = res.data.table;
      const bill = res.data.createBill;
      dispatch(updateTable(res.data.table));
      handleCloseModal(value);
      handleOnSelectedTable(table);
    });
  };

  const handleCloseModal = (value) => {
    refsById[value.id_table].current.closeModal();
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>DANH SÁCH BÀN ĂN</div>
      <div className={cx("pagination")}>
        {stage.map((e, key) => (
          <Button
            key={key}
            className={cx("stageBtn")}
            onClick={() => handleOnClickStage(e)}
            variant={selectedStage === e ? "normal" : "outline"}
          >
            {e}
          </Button>
        ))}
      </div>
      <div className={cx("content")}>
        {table.map((e, key) => {
          if (e.stage === selectedStage) {
            return (
              <TableItem
                refs={refsById[e._id]}
                key={key}
                tableInfo={e}
                handleOnSelectedTable={handleOnSelectedTable}
                handleCheckIn={handleCheckIn}
                handleCheckInForWalkInGuest={handleCheckInForWalkInGuest}
                errMessage={errMessage}
                handleCloseModal={handleCloseModal}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Table;
