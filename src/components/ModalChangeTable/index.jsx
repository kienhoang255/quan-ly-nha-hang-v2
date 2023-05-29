import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Button from "../Button";
import TableItem from "../table/TableItem";
import { useDispatch, useSelector } from "react-redux";
import { BillAPI, BookingAPI, TableAPI } from "../../services";
import {
  setStage,
  setStageCalled,
  setTable,
  updateTable,
} from "../../redux/tableSlice";
import Skeleton from "../Skeleton";
import { useNavigate } from "react-router-dom";
import ModalLoader from "../ModalLoader";
import { setBooking } from "../../redux/bookingSlice";
import moment from "moment";

const cx = classNames.bind(styles);

const ModalChangeTable = () => {
  const stage = useSelector((stage) => stage.table.stage);
  const stageCalled = useSelector((stage) => stage.table.stageCalled);
  const table = useSelector((stage) => stage.table.table);
  const tableServing = useSelector((stage) => stage.tableServing);
  const booking = useSelector((stage) => stage.booking.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState();
  const [errMessage, setErrMessage] = useState("");
  const [onGetTable, setOnGetTable] = useState(false);
  const [onChangeTable, setOnChangeTable] = useState(false);

  const date = moment([]).format("YYYY-MM-DD");
  const time = moment([]).format("HHmm");

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
              setTable({
                booking: res1.data,
                table: res.data,
                deathTime: time,
              })
            );
          });
          dispatch(setStageCalled(selectedStage));
        })
        .catch((err) => err);
    }
  }, [selectedStage, booking]);

  // Change selected stage
  const handleOnClickStage = (stage) => {
    setSelectedStage(stage);
  };

  // On click table
  const handleOnClickChangeTable = (data) => {
    setOnChangeTable(true);
    BillAPI.changeTable(data)
      .then((res) => {
        setOnChangeTable(false);
        dispatch(updateTable(res.data.tableTo));
        dispatch(updateTable(res.data.table));
        navigate("/table");
      })
      .catch((err) => err.response);
  };

  const handleCloseModal = (id) => {
    refsById[id].current.closeModal();
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Đổi bàn</div>
      <div className={cx("listTable")}>
        {onGetTable ? (
          <>
            <Skeleton className={cx("skeleton")} />
            <Skeleton className={cx("skeleton")} />
            <Skeleton className={cx("skeleton")} />
          </>
        ) : (
          table.map((e, key) => {
            if (e.stage === selectedStage) {
              return (
                <TableItem
                  refs={refsById[e._id]}
                  key={key}
                  tableInfo={e}
                  minSize={true}
                  changeTable={true}
                  handleOnClickChangeTable={handleOnClickChangeTable}
                  tableServing={tableServing}
                  handleCloseModal={handleCloseModal}
                />
              );
            }
          })
        )}
      </div>
      <div className={cx("listStage")}>
        {stage.map((stage) => (
          <Button
            key={stage}
            className={cx("listStageBtn")}
            onClick={() => handleOnClickStage(stage)}
            variant={selectedStage === stage ? "normal" : "outline"}
          >
            {stage}
          </Button>
        ))}
      </div>
      <ModalLoader show={onChangeTable} />
    </div>
  );
};

export default ModalChangeTable;
