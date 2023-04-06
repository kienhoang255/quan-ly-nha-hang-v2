import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";

import TextInput from "../../components/TextInput";
import Avatar from "../../components/Avatar";
import Progress from "../../components/Progress";
import Pagination from "../../components/Pagination";

import { EmployeeAPI } from "../../services";
import {
  setEmployee,
  setPaginationCount,
  setPaginationLimit,
  setPaginationPage,
} from "../../redux/employeeSlice";
const cx = classNames.bind(styles);

const Employee = () => {
  const dispatch = useDispatch();
  const employeeList = useSelector((state) => state.employee);
  const totalPage = useSelector((state) => state.employee.paginationPage);

  const [search, setSearch] = useState({
    q: "",
    page: 0,
    timeDebounce: 0,
  });
  const [fetchingSearch, setFetchingSearch] = useState(true);

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
    </div>
  );
};

export default Employee;
