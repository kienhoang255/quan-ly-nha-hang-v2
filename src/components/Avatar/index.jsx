import React, { memo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { FcCancel } from "react-icons/fc";
import Tippy from "@tippyjs/react";
import PopUp from "../PopUp";
import avatarNull from "../../assets/images/avatar-null.png";

const cx = classNames.bind(styles);

const Avatar = ({ username, avatar, tippy = false }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {tippy ? (
        <Tippy
          placement="bottom-end"
          // visible={open}
          trigger="click"
          interactive={true}
          content={
            <PopUp username={username} avatar={avatar} setOpen={setOpen} />
          }
        >
          <div
            className={cx("container")}
            onClick={() => {
              setOpen(!open);
            }}
          >
            {username && <div className={cx("name")}>{username}</div>}
            <img
              className={cx("img")}
              src={avatar || avatarNull}
              alt={username}
            />
          </div>
        </Tippy>
      ) : (
        <div className={cx("container")}>
          {username && <div className={cx("name")}>{username}</div>}
          <img
            className={cx("img")}
            src={avatar || avatarNull}
            alt={username}
          />
        </div>
      )}
    </>
  );
};

export default memo(Avatar);
