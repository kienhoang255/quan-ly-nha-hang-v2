import React, { useEffect, useMemo, useRef, useState } from "react";
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
  delEmployee,
  setEmployee,
  setPaginationCount,
  setPaginationLimit,
  setPaginationPage,
  updateEmployee,
} from "../../redux/employeeSlice";
import { isEmail, isLength, isNull, isPhoneNumber } from "../../utils";
import { AiTwotoneSetting } from "react-icons/ai";
import ModalLoader from "../../components/ModalLoader";
import CheckBox from "../../components/CheckBox";

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
    status: true,
  });
  const [openModalFetching, setOpenModalFetching] = useState(false);
  const [fetchingSearch, setFetchingSearch] = useState(true);

  const [errMes, setErrMes] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    error: "",
  });

  const refsById = useMemo(() => {
    const refs = {};
    employeeList.data.forEach((item) => {
      refs[item._id] = React.createRef(null);
    });
    return refs;
  }, [employeeList]);

  // Call api on search/ pagination
  useEffect(() => {
    setFetchingSearch(true);
    const debounce = setTimeout(() => {
      EmployeeAPI.searchEmployee(search).then((res) => {
        dispatch(setEmployee(res.data.data));
        dispatch(setPaginationCount(res.data.paginationCount));
        dispatch(setPaginationLimit(res.data.paginationLimit));
        dispatch(setPaginationPage(res.data.paginationPage));
        setFetchingSearch(false);
      });
    }, search.timeDebounce);

    return () => clearTimeout(debounce);
  }, [search.q, search.page, search.status]);

  // Change page - 1
  const handleOnChangePagination = (e) => {
    setSearch((prev) => ({ ...prev, page: e - 1, timeDebounce: 0 }));
  };

  // Close modal
  const handleCloseModal = (id) => {
    if (id) refsById[id].current.closeModal();
    else modalRef.current.closeModal();
  };

  // Validate info employee
  const handleValidate = (employeeInfo, checkPassword = false) => {
    let result;
    const email = employeeInfo.email;
    const phone = employeeInfo.phone;
    const username = employeeInfo.username;
    const password = employeeInfo.password;

    // Check username null
    if (!isNull(username)) {
      setErrMes((prev) => ({ ...prev, username: "Không được để trống" }));
    } else {
      // Check username length
      if (!isLength(username, 4)) {
        setErrMes((prev) => ({ ...prev, username: "Tối thiểu 4 ký tự" }));
      } else {
        setErrMes((prev) => ({ ...prev, username: "" }));
      }
    }

    // Check password null
    if (!isNull(password)) {
      setErrMes((prev) => ({ ...prev, password: "Không được để trống" }));
    } else {
      // Check length password
      if (!isLength(password, 8)) {
        setErrMes((prev) => ({ ...prev, password: "Tối thiểu 8 ký tự" }));
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

    // checkPassword is false skip check password
    if (checkPassword) {
      // If email and phone number are existing check bolt
      if (email && phone) {
        if (
          isLength(password, 8) &&
          isLength(username, 4) &&
          isEmail(email) &&
          isPhoneNumber(phone)
        ) {
          result = true;
        } else result = false;
        // Else only check one
      } else if (
        isLength(password, 8) &&
        isLength(username, 4) &&
        (isEmail(email) || isPhoneNumber(phone))
      ) {
        result = true;
        //
      } else result = false;
    } else {
      // If email and phone number are existing check bolt
      if (email && phone) {
        if (isLength(username, 4) && isEmail(email) && isPhoneNumber(phone)) {
          result = true;
        } else result = false;
        // Else only check one
      } else if (
        isLength(username, 4) &&
        (isEmail(email) || isPhoneNumber(phone))
      ) {
        result = true;
      } else result = false;
    }

    return result;
  };

  // Create new
  const handleOnCreateNewEmployee = (employeeInfo) => {
    // Validate
    if (handleValidate(employeeInfo, true)) {
      setOpenModalFetching(true);
      EmployeeAPI.newEmployee(employeeInfo)
        .then((res) => {
          setOpenModalFetching(false);
          dispatch(addEmployee(res.data.data));
          handleCloseModal();
        })
        .catch((err) => {
          setOpenModalFetching(false);
          switch (err?.response?.status) {
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

  // Update
  const handleUpdateEmployee = (employeeInfo) => {
    if (handleValidate(employeeInfo, false)) {
      setOpenModalFetching(true);
      EmployeeAPI.updateEmployee(employeeInfo)
        .then((res) => {
          setOpenModalFetching(false);
          dispatch(updateEmployee(res.data.data));
          handleCloseModal(res.data.data._id);
        })
        .catch((err) => {
          setOpenModalFetching(false);
          switch (err?.response?.status) {
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

  const handleDeleteEmployee = (id) => {
    setOpenModalFetching(true);
    EmployeeAPI.deleteEmployee(id)
      .then((res) => {
        setOpenModalFetching(false);
        dispatch(delEmployee(res.data.data));
        handleCloseModal(res.data.data._id);
      })
      .catch((err) => {
        setOpenModalFetching(false);
      });
  };

  const handleRestoreEmployee = (id) => {
    setOpenModalFetching(true);
    EmployeeAPI.restoreEmployee(id)
      .then((res) => {
        setOpenModalFetching(false);
        dispatch(delEmployee(res.data.data));
        handleCloseModal(res.data.data._id);
      })
      .catch((err) => {
        setOpenModalFetching(false);
      });
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
              q: e.target.value.trim(),
              timeDebounce: 700,
            }));
          }}
          onClear={(e) => {
            setSearch((prev) => ({ ...prev, q: "", timeDebounce: 700 }));
          }}
        />
        <div className={cx("searchStatus")}>
          <CheckBox
            className={cx("working", search.status === false && "disable")}
            label="Hoạt động"
            id="trueStatus"
            type="radio"
            name="status"
            active={search.status === true && true}
            onChange={() => {
              setSearch((prev) => ({
                ...prev,
                status: true,
                timeDebounce: 700,
              }));
            }}
          />
          <CheckBox
            className={cx("stopWorking", search.status === true && "disable")}
            label="Dừng hoạt động"
            id="falseStatus"
            type="radio"
            name="status"
            active={search.status === false && true}
            onChange={() => {
              setSearch((prev) => ({
                ...prev,
                status: false,
                timeDebounce: 700,
              }));
            }}
          />
        </div>
        <Modal
          ref={modalRef}
          component={
            <ModalContentAddEmployee
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
            <div className={cx("headerCell")}>Chỉnh sửa</div>
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

                  <div className={cx("bodyCell")}>{employee.address}</div>
                  <Modal
                    ref={refsById[employee._id]}
                    component={
                      <ModalContentAddEmployee
                        setting
                        infoEmployee={employee}
                        handleUpdateEmployee={handleUpdateEmployee}
                        handleCloseModal={handleCloseModal}
                        errMes={errMes}
                        handleDeleteEmployee={handleDeleteEmployee}
                        handleRestoreEmployee={handleRestoreEmployee}
                      />
                    }
                  >
                    <Button variant="outline" className={cx("bodyCell", "btn")}>
                      <div className={cx("settingBtn")}>
                        <AiTwotoneSetting />
                      </div>
                    </Button>
                  </Modal>
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
      <ModalLoader show={openModalFetching} />
    </div>
  );
};

export default ManagerEmployee;
