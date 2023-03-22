import React, { useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";

import Button from "../../components/Button";

import { MenuAPI, OrderAPI } from "../../services";
import {
  addCache,
  removeFoodOrdered,
  setFoodOrdered,
} from "../../redux/foodOrderedSlice";

const cx = classNames.bind(styles);

const Order = () => {
  const dispatch = useDispatch();
  const foodOrdered = useSelector((state) => state.foodOrdered.foodOrdered);
  const cacheFood = useSelector((state) => state.foodOrdered.cacheFood);
  const [pageBtn, setPageBtn] = useState([
    {
      title: "Đang nấu",
      active: true,
      classActive: "activeCook",
      classDis: "disCook",
      status: "cooking",
    },
    {
      title: "Đã nấu",
      active: false,
      classActive: "activeCom",
      classDis: "disCom",
      status: "served",
    },
    {
      title: "Đã huỷ",
      active: false,
      classActive: "activeCan",
      classDis: "disCan",
      status: "cancel",
    },
  ]);

  // Get image and name food to render
  const getFoodInfo = useCallback(
    (id) => {
      // Check exist food item
      if (!cacheFood[id]) {
        MenuAPI.getFoodById(id).then((res) => {
          dispatch(addCache(res.data));
        });
      }
    },
    [cacheFood]
  );

  // Get ordered food by status, default status = 'cooking'
  const getFoodOrderByStatus = useCallback(
    (status) => {
      OrderAPI.getFoodOrderedByStatus(status || "cooking").then((res) => {
        // Set food
        dispatch(setFoodOrdered(res.data));
        // Loop to get image and name food
        res.data.forEach((e) => {
          getFoodInfo(e.id_food);
        });
      });
    },
    [pageBtn]
  );

  // In first render get ordered food with status "default"
  useEffect(() => {
    getFoodOrderByStatus();
  }, []);

  // Change active on click
  const handleOnClickPageBtn = useCallback(
    (title, status) => {
      setPageBtn((prev) =>
        prev.map((e) =>
          e.title === title ? { ...e, active: true } : { ...e, active: false }
        )
      );
      // Get ordered food on change
      getFoodOrderByStatus(status);
    },
    [pageBtn]
  );

  const handleOnServedFood = (id) => {
    OrderAPI.updateStatusToServed({ id_foodOrdered: id }).then((res) => {
      dispatch(removeFoodOrdered(id));
    });
  };
  const handleOnCancelFood = (id) => {
    OrderAPI.updateStatusToCancel({ id_foodOrdered: id }).then((res) => {
      dispatch(removeFoodOrdered(id));
    });
  };

  // Render table content
  const contentTable = useMemo(() => {
    return foodOrdered.map((e, key) => (
      <div className={cx("bodyTable")} key={key}>
        <div className={cx("bodyCell")}>
          <div className={cx("wrapPreview")}>
            <div
              className={cx("imgPreview")}
              style={{
                backgroundImage: `url(${cacheFood[e.id_food]?.image})`,
              }}
            ></div>
            <span>{cacheFood[e.id_food]?.name}</span>
          </div>
        </div>
        <div className={cx("bodyCell")}>{e.quantity}</div>
        <div className={cx("bodyCell")}>
          {/* moment */}
          {moment(e.createdAt).format("DD/MM-hh:mm:ss")}
        </div>
        <div className={cx("bodyCell")}>{e.status}</div>

        <div className={cx("bodyCell", "actionBtn")}>
          <Button
            className={cx("cancelBtn")}
            onClick={() => handleOnCancelFood(e._id)}
            variant="outline"
          >
            Huỷ
          </Button>
          <Button
            className={cx("completeBtn")}
            onClick={() => handleOnServedFood(e._id)}
          >
            Hoàn thành
          </Button>
        </div>
      </div>
    ));
  }, [foodOrdered, cacheFood]);

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("title")}>DANH SÁCH ĐẶT MÓN</div>
        {pageBtn.map((e, key) => (
          <Button
            key={key}
            className={cx("pageBtn", e.active ? e.classActive : e.classDis)}
            variant={e.active ? "normal" : "outline"}
            onClick={() => {
              handleOnClickPageBtn(e.title, e.status);
            }}
          >
            {e.title}
          </Button>
        ))}
      </div>
      <div className={cx("body")}>
        <div className={cx("table")}>
          <div className={cx("headerTable")}>
            <div className={cx("headerCell")}>Tên món ăn</div>
            <div className={cx("headerCell")}>Số lượng</div>
            <div className={cx("headerCell")}>Thời gian đặt</div>
            <div className={cx("headerCell")}>Trạng thái</div>
            <div className={cx("headerCell")}>Điều khiển</div>
          </div>
          {contentTable}
        </div>
      </div>
    </div>
  );
};

export default Order;
