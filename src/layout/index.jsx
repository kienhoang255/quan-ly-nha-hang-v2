import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import Header from "../components/layout/Header";

import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setJob } from "../redux/roleSlice";

const cx = classNames.bind(styles);

const MainLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role.role);
  const job = useSelector((state) => state.role.job);
  const [selectedPage, setSelectedPage] = useState();

  // Loop job and role to set link btn in side bar
  useEffect(() => {
    if (!job[0]) {
      user.job.forEach((jobUser) => {
        role.forEach((jobRole) => {
          if (jobRole.path === jobUser) {
            dispatch(setJob(jobRole));
          }
        });
      });
    }
  }, [user]);

  //Set button selected in first render
  useEffect(() => {
    setSelectedPage(window.location.pathname);
  }, [user, role, job]);

  return (
    <div className={cx("container")}>
      <Header
        username={user.username}
        avatar={user.avatar}
        job={job}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <div className={cx("wrapper")}>
        <div className={cx("content")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
