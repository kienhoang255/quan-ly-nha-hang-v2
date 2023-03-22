import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { BsSearch } from "react-icons/bs";

import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";

const cx = classNames.bind(styles);

const Employee = () => {
  return (
    <div className={cx("container")}>
      <div className={cx("title")}>DANH SÁCH NHÂN VIÊN</div>
      <div className={cx("search")}>
        <TextInput placeholder="Tìm kiếm" />
        <Button className={cx("searchBtn")} variant="outline">
          <BsSearch />
        </Button>
      </div>
      <div className={cx("body")}>
        <div className={cx("table")}>
          <div className={cx("headerTable")}>
            <div className={cx("headerCell")}>No.</div>
            <div className={cx("headerCell")}>Ten</div>
            <div className={cx("headerCell")}>sdt</div>
            <div className={cx("headerCell")}>email</div>
            <div className={cx("headerCell")}>dia chi</div>
          </div>
          <div className={cx("bodyTable")}>
            <div className={cx("bodyCell")}>1</div>
            <div className={cx("bodyCell", "left")}>
              <Avatar />
              SỐ LƯỢNG
            </div>
            <div className={cx("bodyCell")}>0962252479</div>
            <div className={cx("bodyCell")}>hoangtrungkien255@gmail.com</div>

            <div className={cx("bodyCell", "actionBtn")}>THÁI</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
