import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { decodeToken } from "react-jwt";
import { useDispatch } from "react-redux";

import styles from "./index.module.scss";

import Logo from "../../components/Logo";

import { UserAPI } from "../../services";
import { setUser } from "../../redux/userSlice";

const cx = classNames.bind(styles);

const Fetching = ({ children }) => {
  const dispatch = useDispatch();
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
          })
          .catch((err) => err);
        setFetching(false);
      } catch {
        setFetching(true);
        // show Error
        console.log("dm ao that day");
      }
    }
  }, []);

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
