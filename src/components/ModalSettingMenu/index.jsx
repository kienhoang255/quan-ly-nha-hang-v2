import React, { useState } from "react";
import styles from "./index.module.scss";
import classNames from "classnames/bind";

import TextInput from "../TextInput";
import Button from "../Button";
import Switch from "../Switch";
import ModalLoader from "../ModalLoader";

import { imageToBase64 } from "../../utils";

import emptyImg from "../../assets/images/placeholder-400x400.png";

const cx = classNames.bind(styles);

const ModalSettingMenu = ({
  setting = false,
  data,
  foodType,
  handleCloseModal,
  handleCreateFood,
  fetching,
}) => {
  const [food, setFood] = useState({
    image: data?.image || "",
    price: data?.price || "",
    type: data?.type || "",
    name: data?.name || "",
    description: data?.description || "",
    status: true,
  });

  const handleDisabledCloseModal = () => {};

  const handleOnChangeSwitch = () => {
    setFood((prev) => ({ ...prev, status: !food.status }));
  };

  const handleDropDown = (e) => {
    setFood((prev) => ({ ...prev, type: e }));
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>
        {setting ? "Cập nhật món ăn" : "Thêm món ăn"}
      </div>
      <div className={cx("content")}>
        <div
          className={cx("imgReview")}
          style={{
            backgroundImage: `url(${food.image || emptyImg})`,
          }}
        ></div>
        <div className={cx("form")}>
          <div className={cx("wrap")}>
            <TextInput
              className={cx("imageInput")}
              id="img"
              type="file"
              placeholder="Ảnh"
              onChange={(event) => {
                imageToBase64(event.target.files[0], (base64) => {
                  setFood((prev) => ({ ...prev, image: base64 }));
                });
              }}
            />
            <div className={cx("switch")}>
              <div
                className={cx("switchStatus", food.status === false && "open")}
              >
                Ẩn
              </div>
              <Switch onChange={handleOnChangeSwitch} open={food.status} />
              <div
                className={cx("switchStatus", food.status === true && "open")}
              >
                Hiện
              </div>
            </div>
          </div>
          <TextInput
            placeholder={"Tên món ăn"}
            className={cx("text")}
            value={food.name}
            onChange={(e) =>
              setFood((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextInput
            placeholder={"Loại"}
            className={cx("text")}
            dropdown={true}
            listDropdown={foodType}
            value={food.type}
            onChange={(e) =>
              setFood((prev) => ({ ...prev, type: e.target.value }))
            }
            setInputValueOnDropdown={handleDropDown}
          />
          <TextInput
            placeholder={"Giá"}
            className={cx("text")}
            value={food.price}
            onChange={(e) =>
              setFood((prev) => ({ ...prev, price: e.target.value }))
            }
          />
          <TextInput
            placeholder={"Mô tả"}
            className={cx("text")}
            value={food.description}
            onChange={(e) =>
              setFood((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
      </div>
      <div className={cx("btnAction")}>
        <Button variant="outline" onClick={handleCloseModal}>
          Hủy
        </Button>
        <Button
          onClick={() => {
            handleCreateFood(food);
          }}
        >
          {setting ? "Cập nhật" : "Thêm"}
        </Button>
      </div>
      <ModalLoader show={fetching} />
    </div>
  );
};

export default ModalSettingMenu;
