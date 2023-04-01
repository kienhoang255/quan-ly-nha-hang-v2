import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";

import Button from "../../components/Button";
import TableItem from "../../components/table/TableItem";

import { TableAPI } from "../../services";
import { setStage, setStageCalled, setTable } from "../../redux/tableSlice";
import { setTableServing } from "../../redux/tableServingSlice";

const cx = classNames.bind(styles);

const Table = () => {
  const stage = useSelector((stage) => stage.table.stage);
  const stageCalled = useSelector((stage) => stage.table.stageCalled);
  const table = useSelector((stage) => stage.table.table);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState();

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
          dispatch(setTable(res.data));
          dispatch(setStageCalled(selectedStage));
        })
        .catch((err) => err);
    }
  }, [selectedStage]);

  // When select table, direct to menu and set info table {_id, id_bill}
  const handleOnSelectedTable = (status, _id, id_bill) => {
    if (status === "using") {
      navigate("/menu");
      dispatch(setTableServing({ _id, id_bill }));

      // When reload website in menu page, table serving redux will disappear
      localStorage.setItem("idBill", id_bill);
    }
  };

  // Change selected stage
  const handleOnClickStage = (stage) => {
    setSelectedStage(stage);
  };

  const handleCheckIn = (value) => {
    // Check value is email/phone
    // Call api
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
                key={key}
                tableInfo={e}
                handleOnSelectedTable={handleOnSelectedTable}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Table;
