import React, { memo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { FcCancel } from "react-icons/fc";

const cx = classNames.bind(styles);

const Avatar = ({ username, avatar }) => {
  return (
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
  );
};

export default memo(Avatar);
