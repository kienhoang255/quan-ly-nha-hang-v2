import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

import Button from "../Button";

import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Input from "../Input";

const cx = classNames.bind(styles);

const Pagination = ({ start = 1, end = 0, onChange, className }) => {
  const [pages, setPages] = useState({
    start: start,
    end: end,
    current: start,
  });
  const [inputValue, setInputValue] = useState();

  // Set inputValue if it's number
  const handleOnChangeInput = useCallback(
    (e) => {
      const value = e.target.value;
      if (Number(value)) {
        setInputValue(value);
      } else if (!value) setInputValue(value);
    },
    [inputValue]
  );

  // Decrease page - 1
  const handleOnClickPrevBtn = () => {
    if (pages.current > 1)
      setPages((prev) => ({ ...prev, current: prev.current - 1 }));
  };

  // Increase page + 1
  const handleOnClickNextBtn = () => {
    if (pages.current < end)
      setPages((prev) => ({ ...prev, current: prev.current + 1 }));
  };

  const handleOnClickLastPage = () => {
    setPages((prev) => ({ ...prev, current: end }));
  };

  // set page by option, set Max page if the 'end' is exceeded
  const handleOnClickOption = () => {
    const value = Number(inputValue);
    if (value > end) setPages((prev) => ({ ...prev, current: end }));
    else if (value < start) setPages((prev) => ({ ...prev, current: start }));
    else setPages((prev) => ({ ...prev, current: value }));
  };

  // Character limited by totalPage/end
  const maxLength = useMemo(() => {
    return end.toString().split("").length;
  }, [end]);

  // Catch on change
  useEffect(() => {
    onChange(pages.current);
  }, [pages.current]);

  useEffect(() => {
    if (end !== pages.end) {
      setPages((prev) => ({ ...prev, current: start }));
    }
  }, [end]);

  return (
    <div className={cx("container", { [className]: className })}>
      <div className={cx("content")}>
        <Button
          className={cx("btn")}
          onClick={handleOnClickPrevBtn}
          disable={pages.start === pages.current}
        >
          <MdOutlineKeyboardArrowLeft />
        </Button>
        <Button className={cx("btn")}>{pages.current}</Button>
        <span>of</span>
        <Button className={cx("btn")} onClick={handleOnClickLastPage}>
          {end}
        </Button>
        <Button
          className={cx("btn")}
          onClick={handleOnClickNextBtn}
          disable={end === pages.current}
        >
          <MdOutlineKeyboardArrowRight />
        </Button>
      </div>

      <div className={cx("go")}>
        <Input
          type="text"
          maxLength={maxLength}
          placeholder={"page"}
          value={inputValue ? inputValue : ""}
          onChange={handleOnChangeInput}
        />
        <Button className={cx("btn")} onClick={handleOnClickOption}>
          Go
        </Button>
      </div>
    </div>
  );
};

export default memo(Pagination);
