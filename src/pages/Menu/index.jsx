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
import ModalChangeTable from "../../components/ModalChangeTable";
import { updateTable } from "../../redux/tableSlice";
import Skeleton from "../../components/Skeleton";
import { addFood } from "../../redux/menuSlice";
import ModalLoader from "../../components/ModalLoader";

const cx = classNames.bind(styles);
const Menu = () => {
  const navigate = useNavigate();
  const foodType = useSelector((state) => state.menu.foodType);
  const foodTypeCalled = useSelector((state) => state.menu.foodTypeCalled);
  const menu = useSelector((state) => state.menu.menu);
  const tableServing = useSelector((state) => state.tableServing);
  const listTable = useSelector((state) => state.table.table);
  const listStage = useSelector((state) => state.table.stage);

  const dispatch = useDispatch();
  const refModalCart = useRef();
  const refModalBill = useRef();

  const [selectedType, setSelectedType] = useState();
  const [billDetail, setBillDetail] = useState({});
  const [modalCheckOutFetch, setModalCheckOutFetch] = useState(false);
  const [modalBillFetch, setModalBillFetch] = useState(true);
  const [fetchingGet, setFetchingGet] = useState(false);
  const [fetchingOrder, setFetchingOrder] = useState(false);

  // For first time render
  useEffect(() => {
    // Set selected type for first render
    setSelectedType(foodType[0]);
    // Check foodType exist
    if (!foodType[0]) {
      setFetchingGet(true);
      MenuAPI.getAllTypeFood()
        .then((res) => {
          dispatch(setFoodType(res.data));
          // Set selected type after call api
          setSelectedType(res.data[0]);
          setFetchingGet(false);
        })
        .catch((err) => console.log(err));
    }

    // Use id_bill to get id_client then get info client
    function getClientInfoByIdBill(data) {
      BillAPI.getClientInfoByIdBill(tableServing.idBill || data).then((res) => {
        const { avatar, username, email, phone } = res.data;
        dispatch(
          setClientInfo({
            clientAvatar: avatar,
            clientName: username,
            clientEmail: email,
            clientPhone: phone,
          })
        );
      });
      OrderAPI.getFoodOrderedByIdBill(data).then((res) => {
        setBillDetail((prev) => ({ ...prev, foods: res.data }));
        return res.data;
      });
    }

    if (tableServing.idBill) getClientInfoByIdBill();
    // Get id_bill when reload page
    else {
      const tableServingLocalStorage = JSON.parse(
        localStorage.getItem("tableServing")
      );

      getClientInfoByIdBill(tableServingLocalStorage.id_bill);
      dispatch(setTableServing(tableServingLocalStorage));
    }
  }, []);

  // Call api when change 'selectedType'
  useEffect(() => {
    const checkExistFoodType = foodTypeCalled.find((e) => e === selectedType);
    if (!checkExistFoodType && selectedType !== undefined) {
      setFetchingGet(true);
      MenuAPI.getFoodByType(selectedType)
        .then((res) => {
          dispatch(setMenu(res.data));
          dispatch(setFoodTypeCalled(selectedType));
          setFetchingGet(false);
        })
        .catch((err) => err);
    }
  }, [selectedType]);

  // Handle create food order, delete info table serving, direct to table page
  const handleOnOrderFood = () => {
    // Check food order then call api
    if (tableServing.foodSelecting[0]) {
      setFetchingOrder(true);
      OrderAPI.addFoodOrder({
        id_bill: tableServing.id_bill[0],
        foods: tableServing.foodSelecting,
        nameTable: tableServing.nameTable,
      })
        .then((res) => {
          setFetchingOrder(false);
        })
        .catch((err) => setFetchingOrder(false));
    }
    // Clean table serving info
    dispatch(cleanTableServingInfo());
    // Direct to table page
    navigate("/table");
  };

  // Calculator total price on order
  const totalPriceOnOrder = useMemo(() => {
    return tableServing.foodSelecting.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
  }, [tableServing.foodSelecting]);

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
    [tableServing.foodSelecting]
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
    [tableServing.foodSelecting]
  );

  const handleCloseModalCart = () => {
    refModalCart.current.closeModal();
  };
  const handleCloseModalBill = () => {
    refModalBill.current.closeModal();
  };

  const handleGetBill = () => {
    setBillDetail((prev) => ({
      ...prev,
      customerInfo:
        tableServing.clientEmail ||
        tableServing.clientPhone ||
        tableServing.clientName,
    }));
    // Get bill
    BillAPI.getBillByIdBill(tableServing.id_bill).then((res) => {
      setBillDetail((prev) => ({ ...prev, bill: res.data }));
    });

    let promiseList = [];
    billDetail?.foods?.forEach((e) => {
      const find = menu?.find((m) => m?._id === e?.id_food);
      // If exist set name food
      if (find) {
        setBillDetail((prev) => ({
          ...prev,
          name: { ...prev.name, [e?.id_food]: find.name },
        }));
      } else {
        promiseList.push(
          MenuAPI.getFoodById(e?.id_food).then((res) => {
            setBillDetail((prev) => ({
              ...prev,
              name: { ...prev.name, [res.data._id]: res.data.name },
            }));
            dispatch(addFood(res.data));
          })
        );
      }
    });

    Promise.all(promiseList).then(() => {
      setModalBillFetch(false);
    });
  };

  const modalCart = useMemo(
    () => (
      <Modal
        ref={refModalCart}
        component={
          <ModalContentCartOrder
            handleCloseModal={handleCloseModalCart}
            foodSelecting={tableServing.foodSelecting}
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
    [tableServing.foodSelecting]
  );

  const handleCleanTableServing = () => {
    dispatch(cleanTableServingInfo());
  };

  const handleCheckOut = (id_bill) => {
    setModalCheckOutFetch(true);
    BillAPI.checkOut({ id_bill: id_bill }).then((res) => {
      // dispatch(updateTable(res.data.table));
      setTimeout(() => {
        setModalCheckOutFetch(false);
        dispatch(cleanTableServingInfo());
        navigate("/table");
      }, 500);
    });
  };

  return (
    <div className={cx("container")}>
      <div className={cx("wrap")}>
        <div className={cx("header")}>
          <div className={cx("headerBackBtn")}>
            <Button to="/table" onClick={handleCleanTableServing}>
              <IoMdArrowRoundBack />
            </Button>
          </div>
          <div className={cx("headerTitle")}>THỰC ĐƠN</div>

          <Modal
            component={
              <ModalChangeTable listTable={listTable} listStage={listStage} />
            }
          >
            <div className={cx("headerSubTitle")}>{tableServing.nameTable}</div>
          </Modal>
          <div className={cx("headerAvatar")}>
            <Avatar username={tableServing.clientName} />
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
                  <ModalContentBill
                    handleCloseModal={handleCloseModalBill}
                    handleGetBill={handleGetBill}
                    billDetail={billDetail}
                    tableServing={tableServing}
                    handleCheckOut={handleCheckOut}
                    modalCheckOutFetch={modalCheckOutFetch}
                    modalBillFetch={modalBillFetch}
                  />
                }
              >
                <Button className={cx("btnBill")}>
                  <RiBillFill />
                </Button>
              </Modal>
            </div>
            <div className={cx("contentBody")}>
              {fetchingGet ? (
                <>
                  <Skeleton className={cx("skeleton")} />
                  <Skeleton className={cx("skeleton")} />
                  <Skeleton className={cx("skeleton")} />
                </>
              ) : (
                menu.map((e, key) => {
                  if (e.type === selectedType && e.status === true) {
                    return (
                      <FoodCard
                        key={key}
                        _id={e._id}
                        name={e.name}
                        price={e.price}
                        image={e.image}
                        foodSelecting={tableServing.foodSelecting}
                        handleOnClickIncreaseFood={handleOnClickIncreaseFood}
                        handleOnClickDecreaseFood={handleOnClickDecreaseFood}
                      />
                    );
                  }
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalLoader show={fetchingOrder} />
    </div>
  );
};

export default Menu;
