import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Modal from "../Modal";

const cx = classNames.bind(styles);

const ModalLoader = ({ show }) => {
  return (
    <Modal
      open={show}
      component={
        <div className={cx("container")}>
          <div className={cx("content")}>
            <div className={cx("main")}>
              <div></div>
            </div>
          </div>
        </div>
      }
    ></Modal>
  );
};

export default ModalLoader;
