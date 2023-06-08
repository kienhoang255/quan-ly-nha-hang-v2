import React, { useEffect, useMemo } from "react";
import Pusher from "pusher-js";
import { useDispatch, useSelector } from "react-redux";
import { addFoodOrdered } from "../redux/foodOrderedSlice";
import tingSound from "../assets/sound/TING SOUND EFFECT.mp3";
import { addNewNotification } from "../redux/notiSlice";
import { updateTable } from "../redux/tableSlice";

const PusherComponent = () => {
  const dispatch = useDispatch();
  const job = useSelector((state) => state.role.job);
  var pusher = new Pusher("4cae476ea6d452113730", {
    cluster: "ap1",
  });

  //

  const triggerSound = () => {
    var audio = new Audio();
    audio.src = tingSound;
    audio.play();
  };

  var FO_Channel = pusher.subscribe("FO");
  var Bill_Channel = pusher.subscribe("bill");

  const pusherList = [
    // Tự động tắt thông báo món vừa nhận vì đã có nhân viên khác nhận món
    { channel: "FO", event: "FO_receive-order-by-some1-event", job: "/order" },

    // Nhân viên phục vụ nhận món vừa hoàn thành
    // Hiển thị thông báo món vừa hoàn thành
    { channel: "FO", event: "FO_order-event", job: "/menu" },

    // Tự động tắt thông báo món vừa hoàn thành vì đã có nhân viên khác nhận
    {
      channel: "FO",
      event: "FO_receive-served-by-some1-event",
      job: "/menu",
      sound: true,
    },

    // Hủy món
    // TH đầu bếp nhận thông báo hủy món
    // TH1: Nếu đầu bếp đồng ý thông báo lại cho nhân viên (Món đã được hủy)
    // TH2: Nếu món đã chuẩn bị xong không thể hủy sẽ thông báo lại cho nhân viên (Món đã chuẩn bị xong không thể hủy)
    // TH2 sinh ra thêm 2 TH
    // // TH1: Khách hàng đồng ý sử dụng
    // // TH2: Khách hàng không đồng ý, nhờ quản lý giúp đỡ, sau khi đàm phán vẫn không được sẽ hủy cho khách hàng với vai trò quản lý

    // TH đầu bếp tự hủy món
    // Thông báo lại cho khách hàng món đã hủy
  ];

  useEffect(() => {
    if (job.find((e) => e.path === "/order"))
      FO_Channel.bind("FO_order-event", function (data) {
        console.log("run");
        triggerSound();
        dispatch(
          addNewNotification({
            message: `Có ${data.data.length} món vừa được đặt`,
            id_bill: data.data[0].id_bill,
            title: "order",
            timeOrder: data.data[0].createdAt,
          })
        );
        dispatch(addFoodOrdered(data.data));
      });

    // if (job.find((e) => e.path === "/order"))
    //   FO_Channel.bind("FO_served-event", function (data) {
    //     // trigger sound
    //   });

    if (job.find((e) => e.path === "/table"))
      FO_Channel.bind("FO_served-event", function (data) {
        triggerSound();
        dispatch(
          addNewNotification({
            message: `Món ${data.foodOrdered.nameFood} tại bàn ${data.foodOrdered.nameTable}`,
            title: "served",
            timeOrder: data.foodOrdered.time,
          })
        );
      });

    if (job.find((e) => e.path === "/table"))
      Bill_Channel.bind("checkIn-event", function (data) {
        dispatch(updateTable(data.table));
      });

    if (job.find((e) => e.path === "/table"))
      Bill_Channel.bind("checkOut-event", function (data) {
        dispatch(updateTable(data.table));
      });
  }, [job]);

  return <></>;
};

export default PusherComponent;
