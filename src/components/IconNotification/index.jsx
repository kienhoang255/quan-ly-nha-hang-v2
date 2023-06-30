import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

import { MdNotifications } from "react-icons/md";
import { GoPrimitiveDot } from "react-icons/go";
import Tippy from "@tippyjs/react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import moment from "moment";
import "moment/dist/locale/vi";
import { isSeen, turnOffAlert } from "../../redux/notiSlice";

const cx = classNames.bind(styles);

const IconNotification = ({
  icon = <MdNotifications />,
  contentTippy,
  trigger,
  option,
}) => {
  const dispatch = useDispatch();
  const notification = useSelector((s) => s.noti);

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    notification[option].alert && setIsShow(notification[option].alert);
  }, [notification[option]]);

  const handleOnClick = () => {
    setIsShow(!isShow);
    notification[option].alert && dispatch(turnOffAlert({ option: option }));
  };

  return (
    <div className={cx("container")}>
      {notification[option].alert && (
        <div className={cx("redDot")}>
          <GoPrimitiveDot />
        </div>
      )}
      <Tippy
        visible={isShow}
        // onTrigger={() => setIsShow(true)}
        onClickOutside={() => setIsShow(false)}
        interactive={true}
        placement="bottom-end"
        content={<>{contentTippy}</>}
      >
        <div className={cx("icon")} onClick={handleOnClick}>
          {icon}
        </div>
      </Tippy>
    </div>
  );
};

export default IconNotification;
