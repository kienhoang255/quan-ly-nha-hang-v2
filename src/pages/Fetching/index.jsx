import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { decodeToken } from "react-jwt";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";

import Logo from "../../components/Logo";

import { UserAPI } from "../../services";
import { setUser } from "../../redux/userSlice";
import { addRoleNotAllowed, setJob } from "../../redux/roleSlice";

const cx = classNames.bind(styles);

const Fetching = ({ children }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.role.role);
  const job = useSelector((state) => state.role.job);

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Get cookie
    let cookie;
    document.cookie
      .split(";")
      .map((e) => e.split("="))
      .forEach((e) =>
        e[0].trim() === "token" ? (cookie = e[1]) : (cookie = undefined)
      );
    // setFetching(true);
    // Check cookie exist

    if (!cookie) {
      setFetching(false);
    } else {
      try {
        const { _id } = decodeToken(cookie);
        UserAPI.getUser(_id)
          .then((res) => {
            //set UserInfo {name,avatar,job}
            dispatch(setUser(res.data));

            if (!job[0]) {
              res.data.job.forEach((jobUser) => {
                role.forEach((jobRole) => {
                  if (jobRole.path === jobUser) {
                    dispatch(setJob(jobRole));
                  }
                });
              });
            }
          })
          .catch((err) => err);
      } catch {
        setFetching(true);
        // show Error
        console.log("dm ao that day");
      }
    }
  }, []);

  // Loop job and role to set link btn in side bar
  useEffect(() => {
    if (job.length !== 0)
      role.forEach((e) => {
        if (!job.find((e1) => e1.path === e.path)) {
          dispatch(addRoleNotAllowed(e));
        }
      });
    setFetching(false);
  }, [job]);

  return (
    <>
      {fetching ? (
        <div className={cx("container")}>
          <Logo className={cx("logo")} />
          <div className={cx("content")}>
            <div className={cx("main")}>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Fetching;

/**
 * Target: CALL USER INFO WHEN RELOAD/OPEN WEBSITE
 * Method: get cookie
 *         IF cookie not exist redirect to login page
 *         ELSE
 *              IF get user by _id success
 *                 set userInfo to Redux
 *              ElSE show error
 */
