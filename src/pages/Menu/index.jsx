import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiBillFill } from "react-icons/ri";

import styles from "./index.module.scss";

import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import FoodCard from "../../components/menu/FoodCard";
import Modal from "../../components/Modal";
import ModalContentCartOrder from "../../components/menu/ModalContentCartOrder";
import ModalContentBill from "../../components/menu/ModalContentBill";

import { setFoodType, setFoodTypeCalled, setMenu } from "../../redux/menuSlice";
import { BillAPI, MenuAPI, OrderAPI } from "../../services";
import {
  addFoodSelecting,
  cleanTableServingInfo,
  decreaseFoodSelecting,
  increaseFoodSelecting,
  removeFoodSelecting,
  setClientInfo,
  setTableServing,
} from "../../redux/tableServingSlice";

const cx = classNames.bind(styles);
const Menu = () => {
  const navigate = useNavigate();
  const foodType = useSelector((state) => state.menu.foodType);
  const foodTypeCalled = useSelector((state) => state.menu.foodTypeCalled);
  const menu = useSelector((state) => state.menu.menu);
  const idBill = useSelector((state) => state.tableServing.id_bill);
  const clientName = useSelector((state) => state.tableServing.clientName);
  const foodSelecting = useSelector(
    (state) => state.tableServing.foodSelecting
  );
  const dispatch = useDispatch();
  const refModalCart = useRef();
  const refModalBill = useRef();

  const [selectedType, setSelectedType] = useState();

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

    // Use id_bill to get id_client then get info client
    function getClientInfoByIdBill(idBillLocalStorage) {
      BillAPI.getBillById(idBill || idBillLocalStorage).then((res) => {
        const { avatar, username } = res.data;
        dispatch(setClientInfo({ clientAvatar: avatar, clientName: username }));
      });
    }

    if (idBill) getClientInfoByIdBill();

    if (!idBill) {
      const idBillLocalStorage = localStorage.getItem("idBill");
      getClientInfoByIdBill(idBillLocalStorage);
      dispatch(setTableServing({ id_bill: idBillLocalStorage }));
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

  // Handle create food order, delete info table serving, direct to table page
  const handleOnOrderFood = () => {
    // Check food order then call api
    if (foodSelecting[0]) {
      OrderAPI.addFoodOrder({ id_bill: idBill, foods: foodSelecting })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
    // Clean table serving info
    dispatch(cleanTableServingInfo());
    // Direct to table page
    navigate("/table");
  };

  // Calculator total price on order
  const totalPriceOnOrder = useMemo(() => {
    return foodSelecting.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
  }, [foodSelecting]);

  // Change selected type
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

  const handleOnClickIncreaseFood = useCallback(
    (id_food, name, price, quantity) => {
      if (quantity === 0 || !quantity) {
        dispatch(addFoodSelecting({ id_food, name, price, quantity: 1 }));
      } else {
        dispatch(increaseFoodSelecting({ id_food, name, price, quantity }));
      }
    },
    [foodSelecting]
  );

  const handleOnClickDecreaseFood = useCallback(
    (id_food, name, price, quantity) => {
      if (quantity === 1) {
        dispatch(removeFoodSelecting({ id_food, name, price, quantity }));
      }
      if (quantity > 1) {
        dispatch(decreaseFoodSelecting({ id_food, name, price, quantity }));
      }
    },
    [foodSelecting]
  );

  const handleCloseModalCart = () => {
    refModalCart.current.closeModal();
  };
  const handleCloseModalBill = () => {
    refModalBill.current.closeModal();
  };

  const modalCart = useMemo(
    () => (
      <Modal
        ref={refModalCart}
        component={
          <ModalContentCartOrder
            handleCloseModal={handleCloseModalCart}
            foodSelecting={foodSelecting}
            totalPriceOnOrder={totalPriceOnOrder}
            handleOnClickIncreaseFood={handleOnClickIncreaseFood}
            handleOnClickDecreaseFood={handleOnClickDecreaseFood}
            handleOnOrderFood={handleOnOrderFood}
          />
        }
      >
        <Button className={cx("btnBill")}>
          <AiOutlineShoppingCart />
        </Button>
      </Modal>
    ),
    [foodSelecting]
  );

  return (
    <div className={cx("container")}>
      <div className={cx("wrap")}>
        <div className={cx("header")}>
          <div className={cx("headerBackBtn")}>
            <Button to="/table">
              <IoMdArrowRoundBack />
            </Button>
          </div>
          <div className={cx("headerTitle")}>THỰC ĐƠN</div>
          <div className={cx("headerAvatar")}>
            <Avatar username={clientName} />
          </div>
        </div>
        <div className={cx("body")}>
          <div className={cx("typeList")}>{renderFoodType}</div>
          <div className={cx("content")}>
            <div className={cx("contentHeader")}>
              <div className={cx("title")}>{selectedType}</div>
              {modalCart}
              <Modal
                ref={refModalBill}
                component={
                  <ModalContentBill handleCloseModal={handleCloseModalBill} />
                }
              >
                <Button className={cx("btnBill")}>
                  <RiBillFill />
                </Button>
              </Modal>
            </div>
            <div className={cx("contentBody")}>
              {menu.map((e, key) => {
                if (e.type === selectedType) {
                  return (
                    <FoodCard
                      key={key}
                      _id={e._id}
                      name={e.name}
                      price={e.price}
                      image={e.image}
                      foodSelecting={foodSelecting}
                      handleOnClickIncreaseFood={handleOnClickIncreaseFood}
                      handleOnClickDecreaseFood={handleOnClickDecreaseFood}
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

export default Menu;
