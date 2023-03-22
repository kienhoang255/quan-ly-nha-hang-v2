import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Logo from "../../Logo";
import Avatar from "../../Avatar";
import IconNotification from "../../IconNotification";
import SideBar from "../SideBar";

const cx = classNames.bind(styles);

const Header = ({ username, avatar, job, selectedPage, setSelectedPage }) => {
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
          <IconNotification shake={false} />
          <Avatar username={username} avatar={avatar} />
        </div>
      </div>
    </div>
  );
};

export default Header;
