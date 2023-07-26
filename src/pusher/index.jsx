import React, { useEffect, useMemo } from "react";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import {
  addFoodOrdered,
  updateNameTableFoodOrdered,
} from "../redux/foodOrderedSlice";
import tingSound from "../assets/sound/TING SOUND EFFECT.mp3";
import cancelFORequestSound from "../assets/sound/cancelFoodOrderRequest.mp3";
import { addNewNotification } from "../redux/notiSlice";
import { updateTable } from "../redux/tableSlice";
import moment from "moment";
import { BookingAPI } from "../services";
import { setBookingOnly } from "../redux/bookingSlice";

const PusherComponent = () => {
  const dispatch = useDispatch();

  const dateCheckIn = moment([]).format("YYYY-MM-DD");
  const deathTime = moment([]).format("HHmm");

  const job = useSelector((state) => state.role.job);
  var pusher = new Pusher("4cae476ea6d452113730", {
    cluster: "ap1",
  });

  const triggerSound = () => {
    var audio = new Audio();
    audio.src = tingSound;
    audio.play();
  };

  const cancelFOSound = () => {
    var audio = new Audio();
    audio.src = cancelFORequestSound;
    audio.play();
  };

  useEffect(() => {
    if (job.length > 0) {
      var FO_Channel = pusher.subscribe("FO");
      var Bill_Channel = pusher.subscribe("bill");

      // Bắt những món vừa được đặt
      if (job.find((e) => e.path === "/order"))
        FO_Channel.bind("FO_order-event", function (data) {
          triggerSound();
          dispatch(
            addNewNotification({
              message: `Có ${data.data.reduce(
                (acc, cur) => acc + cur.quantity,
                0
              )} món vừa được đặt`,
              id_bill: data.data[0].id_bill,
              title: "order",
              timeOrder: data.data[0].createdAt,
              option: "serve",
            })
          );
          dispatch(addFoodOrdered(data.data));
        });

      //Đổi bàn
      if (job.find((e) => e.path === "/order"))
        Bill_Channel.bind("changeTable-event", function (data) {
          console.log(data.data.tableTo.id_bill);
          dispatch(updateNameTableFoodOrdered(data.data.tableTo));
        });

      if (job.find((e) => e.path === "/order"))
        FO_Channel.bind("FO_cancel-request", function (data) {
          cancelFOSound();
          dispatch(
            addNewNotification({
              message: `Y/C hủy món ${data.foodOrdered.nameFood} tại bàn ${data.foodOrdered.nameTable}`,
              timeOrder: data.foodOrdered.food.updatedAt,
              option: "cancel",
              id_foodOrdered: data.foodOrdered.food._id,
              nameTable: data.foodOrdered.nameTable,
              nameFood: data.foodOrdered.nameFood,
            })
          );
        });

      // Bắt những món vừa được hoàn thành
      if (job.find((e) => e.path === "/table"))
        FO_Channel.bind("FO_served-event", function (data) {
          triggerSound();
          dispatch(
            addNewNotification({
              message: `Món ${data.foodOrdered.nameFood} tại bàn ${data.foodOrdered.nameTable}`,
              title: "served",
              timeOrder: data.foodOrdered.time,
              option: "serve",
              nameTable: data.foodOrdered.nameTable,
            })
          );
        });

      // Cập nhật lại bàn khi check in
      if (job.find((e) => e.path === "/table"))
        Bill_Channel.bind("checkIn-event", function (data) {
          dispatch(updateTable(data.table));
        });

      if (job.find((e) => e.path === "/table"))
        Bill_Channel.bind("changeTable-event", function (data) {
          dispatch(updateTable(data.data.tableTo));
          dispatch(updateTable(data.data.table));
        });

      // Cập nhật lại bàn khi check out
      if (job.find((e) => e.path === "/table"))
        Bill_Channel.bind("checkOut-event", function (data) {
          // dispatch(updateTable(data.table));

          BookingAPI.getAllBooking({ dateCheckIn, status: "pending" }).then(
            (res) => {
              dispatch(setBookingOnly(res.data));
              dispatch(
                updateTable({
                  ...data.table,
                  deathTime,
                  booking: res.data,
                })
              );
            }
          );
        });
    }
  }, [job]);

  return <></>;
};

export default PusherComponent;
