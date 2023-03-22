import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import Button from "../../Button";

const cx = classNames.bind(styles);

const FoodCard = ({
  _id,
  name,
  price,
  image,
  foodSelecting,
  handleOnClickIncreaseFood,
  handleOnClickDecreaseFood,
}) => {
  const filter = foodSelecting.filter((e) => e.id_food === _id);
  const quantity = filter[0]?.quantity ? filter[0]?.quantity : 0;

  return (
    <div className={cx("container")}>
      <div
        className={cx("imgPreview")}
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className={cx("detail")}>
        <div className={cx("name")}>{name}</div>
        <div className={cx("price")}>{price}</div>
        <div className={cx("action")}>
          <Button
            className={cx("actionBtn")}
            onClick={() => {
              handleOnClickDecreaseFood(_id, name, price, quantity);
            }}
            variant="circle"
          >
            <MdKeyboardArrowLeft />
          </Button>
          <span>{quantity}</span>
          <Button
            className={cx("actionBtn")}
            onClick={() => {
              handleOnClickIncreaseFood(_id, name, price, quantity);
            }}
            variant="circle"
          >
            <MdKeyboardArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
