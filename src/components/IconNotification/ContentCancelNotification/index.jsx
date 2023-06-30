import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import ItemCancel from "./ItemCancel";

const cx = classNames.bind(styles);

const ContentCancelNotification = ({ data, test }) => {
  return (
    <div className={cx("container")}>
      {data.data[0] ? (
        data.data.map((e, key) => {
          return (
            <div key={key} className={cx("item")}>
              <ItemCancel e={e} />
            </div>
          );
        })
      ) : (
        <div className={cx("title")}>Không có bất kỳ yêu cầu hủy nào!</div>
      )}
    </div>
  );
};

export default ContentCancelNotification;
