import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";
import FoodCard from "../../components/menu/FoodCard";
import Modal from "../../components/Modal";

import { AiFillSetting } from "react-icons/ai";

import { MenuAPI } from "../../services";

import {
  addFood,
  setFoodType,
  setFoodTypeCalled,
  setMenu,
} from "../../redux/menuSlice";
import ModalSettingMenu from "../../components/ModalSettingMenu";

const cx = classNames.bind(styles);
const ManagerMenu = () => {
  const dispatch = useDispatch();

  const foodType = useSelector((state) => state.menu.foodType);
  const foodTypeCalled = useSelector((state) => state.menu.foodTypeCalled);
  const menu = useSelector((state) => state.menu.menu);
  const [fetching, setFetching] = useState(false);

  const [selectedType, setSelectedType] = useState();

  const ref = useRef();

  // For first time render
  useEffect(() => {
    // Set selected type for first render
    setSelectedType(foodType[0]);
    // Check foodType exist
    if (!foodType[0]) {
      MenuAPI.getAllTypeFood()
        .then((res) => {
          dispatch(setFoodType(res.data));
          // Set selected type after call api
          setSelectedType(res.data[0]);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  // Call api when change 'selectedType'
  useEffect(() => {
    const checkExistFoodType = foodTypeCalled.find((e) => e === selectedType);
    if (!checkExistFoodType && selectedType !== undefined) {
      MenuAPI.getFoodByType(selectedType)
        .then((res) => {
          dispatch(setMenu(res.data));
          dispatch(setFoodTypeCalled(selectedType));
        })
        .catch((err) => err);
    }
  }, [selectedType]);

  const handleOnClickType = useCallback(
    (type) => {
      setSelectedType(type);
    },
    [selectedType]
  );

  const renderFoodType = useMemo(
    () =>
      foodType.map((e, key) => (
        <Button
          key={key}
          className={cx("typeListBtn")}
          onClick={() => handleOnClickType(e)}
          variant={selectedType === e ? "normal" : "none"}
        >
          {e}
        </Button>
      )),
    [selectedType, foodType]
  );

  const handleCloseModal = () => {
    ref.current.closeModal();
  };

  const handleFoodValue = (data) => {
    return true;
  };

  const handleCreateFood = (data) => {
    if (handleFoodValue(data)) {
      setFetching(true);
      MenuAPI.createFood(data).then((res) => {
        dispatch(addFood(res.data.data));
        setFetching(false);
        handleCloseModal();
      });
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("wrap")}>
        <div className={cx("header")}>
          <div className={cx("headerTitle")}>THỰC ĐƠN</div>
        </div>
        <div className={cx("body")}>
          <div className={cx("typeList")}>{renderFoodType}</div>
          <div className={cx("content")}>
            <div className={cx("contentHeader")}>
              <div className={cx("title")}>{selectedType}</div>
              <Modal
                ref={ref}
                component={
                  <ModalSettingMenu
                    foodType={foodType}
                    handleCloseModal={handleCloseModal}
                    handleCreateFood={handleCreateFood}
                    fetching={fetching}
                  />
                }
              >
                <Button className={cx("btnBill")}>
                  <AiFillSetting />
                </Button>
              </Modal>
            </div>
            <div className={cx("contentBody")}>
              {menu.map((e, key) => {
                if (e.type === selectedType) {
                  return (
                    <FoodCard
                      key={key}
                      data={e}
                      _id={e._id}
                      name={e.name}
                      price={e.price}
                      image={e.image}
                      foodType={foodType}
                      setting={true}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerMenu;
