import React, { memo } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const Avatar = ({ username, avatar }) => {
  return (
    <div className={cx("container")}>
      {username && <div className={cx("name")}>{username}</div>}
      {avatar ? (
        <img className={cx("img")} src={avatar} alt={username} />
      ) : (
        <div className={cx("img")}>img</div>
      )}
    </div>
  );
};

export default memo(Avatar);
