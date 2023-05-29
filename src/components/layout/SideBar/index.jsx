import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import Logo from "../../Logo";

import { FaBars } from "react-icons/fa";
import Button from "../../Button";

const cx = classNames.bind(styles);

const SideBar = ({ job, selectedPage, setSelectedPage }) => {
  const [showSideBar, setShowSideBar] = useState(false);

  const handleShowSideBar = () => {
    setShowSideBar(!showSideBar);
  };

  const handleStopPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const path = location.pathname;
    setSelectedPage(path);
  });

  return (
    <div className={cx("container")}>
      <div
        className={cx("buttonShow", showSideBar ? "rotate" : "rotated")}
        onClick={handleShowSideBar}
      >
        <FaBars />
      </div>
      {showSideBar && (
        <div className={cx("wrap")} onClick={handleShowSideBar}>
          <div
            className={cx("content", { openSideBar: showSideBar })}
            onClick={handleStopPropagation}
          >
            <div className={cx("header")}>
              <Logo />
            </div>
            <div className={cx("body")}>
              {job.map((e, key) => (
                <Button
                  to={e.path}
                  key={key}
                  className={cx("bodyButton")}
                  variant="none"
                  active={selectedPage === e.path ? true : false}
                  onClick={() => {
                    setSelectedPage(e.path);
                    handleShowSideBar();
                  }}
                >
                  {e.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
