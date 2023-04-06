import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import { FaUserPlus } from "react-icons/fa";

import styles from "./index.module.scss";

import Modal from "../../components/Modal";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
import Pagination from "../../components/Pagination";
import ModalContentAddEmployee from "../../components/ManagerEmployee/ModalContentAddEmployee";
import Progress from "../../components/Progress";

import { EmployeeAPI } from "../../services";
import {
  addEmployee,
  setEmployee,
  setPaginationCount,
  setPaginationLimit,
  setPaginationPage,
} from "../../redux/employeeSlice";
import { isEmail, isLength, isNull, isPhoneNumber } from "../../utils";

const cx = classNames.bind(styles);

const ManagerEmployee = () => {
  const dispatch = useDispatch();
  const employeeList = useSelector((state) => state.employee);
  const totalPage = useSelector((state) => state.employee.paginationPage);

  const modalRef = useRef();

  const [search, setSearch] = useState({
    q: "",
    page: 0,
    timeDebounce: 0,
  });
  const [openModalFetching, setOpenModalFetching] = useState(false);
  const [fetchingSearch, setFetchingSearch] = useState(true);
  const [employeeInfo, setEmployeeInfo] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    avatar: undefined,
    job: [],
  });
  const [errMes, setErrMes] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    error: "",
  });

  // Call api on search/ pagination
  useEffect(() => {
    const debounce = setTimeout(() => {
      setFetchingSearch(true);
      EmployeeAPI.searchEmployee(search).then((res) => {
        dispatch(setEmployee(res.data.data));
        dispatch(setPaginationCount(res.data.paginationCount));
        dispatch(setPaginationLimit(res.data.paginationLimit));
        dispatch(setPaginationPage(res.data.paginationPage));
        setFetchingSearch(false);
      });
    }, search.timeDebounce);

    return () => clearTimeout(debounce);
  }, [search.q, search.page]);

  // Change page - 1
  const handleOnChangePagination = (e) => {
    setSearch((prev) => ({ ...prev, page: e - 1, timeDebounce: 0 }));
  };

  // Close modal
  const handleCloseModal = () => {
    modalRef.current.closeModal();
  };

  // Validate info employee
  const handleValidate = () => {
    const email = employeeInfo.email;
    const phone = employeeInfo.phone;
    const username = employeeInfo.username;
    const password = employeeInfo.password;

    // Check username null
    if (!isNull(username)) {
      setErrMes((prev) => ({ ...prev, username: "Khong dc de trong" }));
    } else {
      // Check username length
      if (!isLength(username, 8)) {
        setErrMes((prev) => ({ ...prev, username: "Ngan" }));
      } else {
        setErrMes((prev) => ({ ...prev, username: "" }));
      }
    }

    // Check password null
    if (!isNull(password)) {
      setErrMes((prev) => ({ ...prev, password: "Khong dc de trong" }));
    } else {
      // Check length password
      if (!isLength(password, 8)) {
        setErrMes((prev) => ({ ...prev, password: "Ngan" }));
      } else {
        setErrMes((prev) => ({ ...prev, password: "" }));
      }
    }

    // Check email or phone number is null
    if (!isNull(email) && !isNull(phone)) {
      setErrMes((prev) => ({
        ...prev,
        email: "Chọn 1 trong 2",
        phone: "Chọn 1 trong 2",
      }));
    } else {
      // Check email is correct if email not null
      if (!isEmail(email) && isNull(email)) {
        setErrMes((prev) => ({
          ...prev,
          email: "Email của bạn không hợp lệ!",
        }));
      } else {
        setErrMes((prev) => ({ ...prev, email: "" }));
      }

      // Check phone is correct if phone not null
      if (!isPhoneNumber(phone) && isNull(phone)) {
        setErrMes((prev) => ({ ...prev, phone: "SĐT của bạn không hợp lệ!" }));
      } else {
        setErrMes((prev) => ({ ...prev, phone: "" }));
      }
    }

    // Return
    if (
      isLength(username, 8) &&
      isLength(password, 8) &&
      (isEmail(email) || isPhoneNumber(phone))
    )
      return true;
    else return false;
  };

  // Create new
  const handleOnCreateNewEmployee = () => {
    // Validate
    if (handleValidate()) {
      setOpenModalFetching(true);
      EmployeeAPI.newEmployee(employeeInfo)
        .then((res) => {
          setOpenModalFetching(false);
          handleCloseModal();
          dispatch(addEmployee(res.data.data));
          setErrMes(() => ({}));
        })
        .catch((err) => {
          setOpenModalFetching(false);
          switch (err.response.status) {
            case 401:
              setErrMes(() => ({
                phone: "Số điện thoại đã tồn tại!",
              }));
              break;

            case 402:
              setErrMes(() => ({
                email: "Email đã tồn tại!",
              }));
              break;

            default:
              setErrMes(() => ({
                error: "Cõ lỗi xảy ra! Xin vui lòng thử lại sau!",
              }));
          }
        });
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>DANH SÁCH NHÂN VIÊN</div>
      <div className={cx("search")}>
        <TextInput
          placeholder="Tìm kiếm"
          value={search.q}
          rightIcon
          onChange={(e) => {
            setSearch((prev) => ({
              ...prev,
              q: e.target.value,
              timeDebounce: 700,
            }));
          }}
          onClear={(e) => {
            setSearch((prev) => ({ ...prev, q: "", timeDebounce: 700 }));
          }}
        />
        <Modal
          ref={modalRef}
          component={
            <ModalContentAddEmployee
              employeeInfo={employeeInfo}
              setEmployeeInfo={setEmployeeInfo}
              handleOnCreateNewEmployee={handleOnCreateNewEmployee}
              handleCloseModal={handleCloseModal}
              errMes={errMes}
            />
          }
        >
          <Button variant="outline" className={cx("addEmployee")}>
            <FaUserPlus />
          </Button>
        </Modal>
      </div>
      <div className={cx("body")}>
        <div className={cx("table")}>
          <div className={cx("headerTable")}>
            <div className={cx("headerCell")}>No.</div>
            <div className={cx("headerCell")}>Tên</div>
            <div className={cx("headerCell")}>SĐT</div>
            <div className={cx("headerCell")}>Email</div>
            <div className={cx("headerCell")}>Địa chỉ</div>
          </div>
          {fetchingSearch ? (
            <div className={cx("fetching")}>
              <Progress />
            </div>
          ) : (
            <>
              {employeeList.data?.map((employee, key) => (
                <div key={key} className={cx("bodyTable")}>
                  <div className={cx("bodyCell")}>{key + 1}</div>
                  <div className={cx("bodyCell", "left")}>
                    <Avatar avatar={employee.avatar} />
                    {employee.username}
                  </div>
                  <div className={cx("bodyCell")}>{employee.phone}</div>
                  <div className={cx("bodyCell")}>{employee.email}</div>

                  <div className={cx("bodyCell", "actionBtn")}>
                    {employee.address}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <Pagination
        start={1}
        end={totalPage}
        onChange={handleOnChangePagination}
        className={cx("pagination")}
      />
      <Modal open={openModalFetching} component={<Progress />}></Modal>
    </div>
  );
};

export default ManagerEmployee;
