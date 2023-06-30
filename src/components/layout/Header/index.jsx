import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Logo from "../../Logo";
import Avatar from "../../Avatar";
import IconNotification from "../../IconNotification";
import SideBar from "../SideBar";

import { MdNotificationImportant } from "react-icons/md";
import ContentServeNotification from "../../IconNotification/ContentServeNotification";
import { useSelector } from "react-redux";
import ContentCancelNotification from "../../IconNotification/ContentCancelNotification";

const cx = classNames.bind(styles);

const Header = ({ username, avatar, job, selectedPage, setSelectedPage }) => {
  const notiServe = useSelector((state) => state.noti.serve);
  const notiCancel = useSelector((state) => state.noti.cancel);
  const foodOrdered = useSelector((state) => state.foodOrdered.foodOrdered);

  return (
    <div className={cx("container")}>
      <div className={cx("wrap")}>
        <div className={cx("left")}>
          <SideBar
            job={job}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </div>
        <div className={cx("mid")}>
          <Logo />
        </div>
        <div className={cx("right")}>
          <IconNotification
            icon={<MdNotificationImportant />}
            option={"cancel"}
            contentTippy={<ContentCancelNotification data={notiCancel} />}
          />
          <IconNotification
            option={"serve"}
            contentTippy={
              <ContentServeNotification
                data={notiServe}
                foodOrdered={foodOrdered}
              />
            }
          />
          <Avatar tippy username={username} avatar={avatar} />
        </div>
      </div>
    </div>
  );
};

export default Header;
