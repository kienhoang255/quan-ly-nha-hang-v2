import React, { memo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { FcCancel } from "react-icons/fc";
import Tippy from "@tippyjs/react";
import PopUp from "../PopUp";

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
            {avatar ? (
              <img className={cx("img")} src={avatar} alt={username} />
            ) : (
              <div className={cx("img")}>
                <FcCancel />
              </div>
            )}
          </div>
        </Tippy>
      ) : (
        <div className={cx("container")}>
          {username && <div className={cx("name")}>{username}</div>}
          {avatar ? (
            <img className={cx("img")} src={avatar} alt={username} />
          ) : (
            <div className={cx("img")}>
              <FcCancel />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default memo(Avatar);
