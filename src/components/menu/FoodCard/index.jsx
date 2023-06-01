import React, { useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";

import Button from "../../Button";
import { formatVND } from "../../../utils";
import Modal from "../../Modal";
import ModalSettingMenu from "../../ModalSettingMenu";

const cx = classNames.bind(styles);

const FoodCard = ({
  _id,
  name,
  price,
  image,
  foodSelecting,
  handleOnClickIncreaseFood,
  handleOnClickDecreaseFood,
  setting = false,
  data,
  foodType,
}) => {
  const [quantity, setQuantity] = useState();

  const ref = useRef();

  useMemo(() => {
    const filter = foodSelecting?.filter((e) => e.id_food === _id);
    if (filter) setQuantity(filter[0]?.quantity ? filter[0]?.quantity : 0);
  }, [foodSelecting]);

  const handleCloseModal = () => {
    ref.current.closeModal();
  };

  return (
    <div className={cx("container")}>
      <div
        className={cx("imgPreview")}
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <div className={cx("detail")}>
        <div className={cx("name")}>{name}</div>
        <div className={cx("price")}>{formatVND(price)}</div>
        {setting ? (
          <Modal
            ref={ref}
            component={
              <ModalSettingMenu
                setting={true}
                data={data}
                foodType={foodType}
                handleCloseModal={handleCloseModal}
              />
            }
          >
            <Button className={cx("settingBtn")}>
              <AiFillSetting />
            </Button>
          </Modal>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default FoodCard;
