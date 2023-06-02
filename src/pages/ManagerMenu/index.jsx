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
import Skeleton from "../../components/Skeleton";

import { AiFillSetting } from "react-icons/ai";

import { MenuAPI } from "../../services";

import {
  addFood,
  deleteFood,
  setFoodType,
  setFoodTypeCalled,
  setMenu,
  updateFood,
} from "../../redux/menuSlice";
import ModalSettingMenu from "../../components/ModalSettingMenu";
import { isNull, isNumber } from "../../utils";

const cx = classNames.bind(styles);
const ManagerMenu = () => {
  const dispatch = useDispatch();

  const foodType = useSelector((state) => state.menu.foodType);
  const foodTypeCalled = useSelector((state) => state.menu.foodTypeCalled);
  const menu = useSelector((state) => state.menu.menu);
  // For add/delete/remove food
  const [fetching, setFetching] = useState(false);
  // For get element
  const [fetchingGet, setFetchingGet] = useState(false);

  const [selectedType, setSelectedType] = useState();
  const [disClickOutside, setDisClicksOutside] = useState(false);
  const [errMes, setErrMes] = useState({
    image: "",
    name: "",
    type: "",
    price: "",
  });

  const ref = useRef();

  const refsById = useMemo(() => {
    const refs = {};
    menu.forEach((item) => {
      refs[item._id] = React.createRef(null);
    });
    return refs;
  }, [menu]);

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
          setFetchingGet(false);
          setSelectedType(res.data[0]);
        })
        .catch((err) => console.log(err));
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

  // Handle on event delete food set "setSelectedType" the first one of "foodType"
  useEffect(() => {
    if (!foodTypeCalled.find((e) => e === selectedType)) {
      setSelectedType(foodType[0]);
    }
    // if (menu.filter((e) => e.type === selectedType).length === 0) {
    //   setSelectedType(foodType[0]);
    // }
  }, [foodType]);

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

  const handleCloseModalUpdate = (id) => {
    refsById[id].current.closeModal();
  };

  const handleFoodValue = (data) => {
    const checkEmptyName = isNull(data.name);
    const checkEmptyType = isNull(data.type);
    const checkEmptyPrice = isNull(data.price);
    const checkEmptyImg = isNull(data.image);

    const checkNumber = isNumber(data.price);

    if (!checkEmptyName)
      setErrMes((prev) => ({ ...prev, name: "Không được để trống" }));
    else setErrMes((prev) => ({ ...prev, name: "" }));

    if (!checkEmptyType)
      setErrMes((prev) => ({ ...prev, type: "Không được để trống" }));
    else setErrMes((prev) => ({ ...prev, type: "" }));

    if (!checkEmptyPrice)
      setErrMes((prev) => ({ ...prev, price: "Không được để trống" }));
    else {
      if (!checkNumber) {
        setErrMes((prev) => ({ ...prev, price: "Đây không phải số" }));
      } else setErrMes((prev) => ({ ...prev, price: "" }));
    }

    if (!checkEmptyImg)
      setErrMes((prev) => ({ ...prev, image: "Chưa chọn ảnh" }));
    else setErrMes((prev) => ({ ...prev, image: "" }));

    if (checkEmptyType && checkNumber && checkEmptyName && checkEmptyImg) {
      return true;
    }

    return false;
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

  const handleDeleteFood = (id) => {
    setFetching(true);
    MenuAPI.deleteFood(id).then((res) => {
      dispatch(deleteFood(res.data.data));
      setFetching(false);
      handleCloseModalUpdate(id);
    });
  };

  const handleUpdateFood = (id, data) => {
    setFetching(true);
    MenuAPI.updateFood({ _id: id, ...data }).then((res) => {
      dispatch(updateFood(res.data.data));
      setFetching(false);
      handleCloseModalUpdate(id);
    });
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
                hasValue={disClickOutside}
                component={
                  <ModalSettingMenu
                    foodType={foodType}
                    handleCloseModal={handleCloseModal}
                    handleCreateFood={handleCreateFood}
                    fetching={fetching}
                    errMes={errMes}
                    setDisClicksOutside={setDisClicksOutside}
                  />
                }
              >
                <Button className={cx("btnBill")}>
                  <AiFillSetting />
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
                  if (e.type === selectedType) {
                    return (
                      <FoodCard
                        key={key}
                        data={e}
                        _id={e._id}
                        name={e.name}
                        price={e.price}
                        image={e.image}
                        refs={refsById[e._id]}
                        foodType={foodType}
                        setting={true}
                        handleDeleteFood={handleDeleteFood}
                        handleUpdateFood={handleUpdateFood}
                        errMes={errMes}
                        disClickOutside={disClickOutside}
                        setDisClicksOutside={setDisClicksOutside}
                        fetching={fetching}
                        handleCloseModal={handleCloseModalUpdate}
                      />
                    );
                  }
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerMenu;
