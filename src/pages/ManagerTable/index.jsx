import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";

import { AiOutlinePlus } from "react-icons/ai";

import ModalContentManagerTableCreate from "../../components/ManagerTable/ModalContentManagerTableCreate";
import MTBCard from "../../components/ManagerTable/MTBCard";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

import {
  addTable,
  addTableImageOptions,
  deleteTable,
  removeTableImageOptions,
  setStage,
  setStageCalled,
  setTable,
  setTableImage,
  updateTable,
  updateTableImage,
  updateTableImageOptions,
  updateTableInfo,
} from "../../redux/tableSlice";
import { BookingAPI, TableAPI } from "../../services";
import Progress from "../../components/Progress";
import { setBooking, setBookingOnly } from "../../redux/bookingSlice";
import moment from "moment";
import { isMax, isNull } from "../../utils";

const cx = classNames.bind(styles);

const ManagerTable = () => {
  const dispatch = useDispatch();

  const stage = useSelector((stage) => stage.table.stage);
  const stageCalled = useSelector((stage) => stage.table.stageCalled);
  const table = useSelector((stage) => stage.table.table);
  const tableImage = useSelector((stage) => stage.table.tableImage);
  const booking = useSelector((stage) => stage.booking.booking);

  const date = moment([]).format("YYYY-MM-DD");
  const time = moment([]).format("HHmm");

  const refsById = useMemo(() => {
    const refs = {};
    table.forEach((item) => {
      refs[item._id] = React.createRef(null);
    });
    return refs;
  }, [table]);

  const modalCreateRef = useRef();

  const [tableImg, setTableImg] = useState({});
  const [previewImg, setPreviewImg] = useState();
  const [selectedStage, setSelectedStage] = useState();
  const [option, setOption] = useState({ option: "", index: -1, options: [] });
  const [openModalFetching, setOpenModalFetching] = useState(false);
  const [stateTableInfo, setStateTableInfo] = useState({
    _id: "",
    stage: "",
    numOfPeople: "",
  });
  const [errNOP, setErrNOP] = useState({});

  // For first time render
  useEffect(() => {
    // Set selected stage for first render
    setSelectedStage(stage[0]);
    // Check stage exist
    if (!stage[0]) {
      TableAPI.getStage().then((res) => {
        dispatch(setStage(res.data));
        // Set selected stage after call api
        setSelectedStage(res.data[0]);
      });
    }
  }, []);

  // Call api when change 'selectedStage'
  useEffect(() => {
    const checkExistStageCalled = stageCalled.find((e) => e === selectedStage);
    if (!checkExistStageCalled && selectedStage !== undefined) {
      TableAPI.getTableByStage(selectedStage)
        .then((res) => {
          BookingAPI.getAllBooking({
            dateCheckIn: date,
            status: "pending",
          }).then((res1) => {
            dispatch(setBookingOnly(res1.data));
            dispatch(
              setTable({
                booking: res1.data,
                table: res.data,
                deathTime: time,
              })
            );
          });
          dispatch(setStageCalled(selectedStage));
        })
        .catch((err) => err);
    }
  }, [selectedStage, booking]);

  // Change selected stage
  const handleOnClickStage = (stage) => {
    setSelectedStage(stage);
  };

  // Get image by id
  const handleGetTableImage = (id) => {
    // If exist cancel call api
    if (!tableImage[id]) {
      TableAPI.getTableImage(id).then((res) => {
        // Check data exist => optimized set to redux
        if (res.data.data) dispatch(setTableImage(res.data.data));
      });
    }
  };

  // Update table image in redux
  const handleOnUpdateImage = (data) => {
    dispatch(updateTableImage(data));
  };

  // Create new table
  const handleCreateNewTable = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { stage, numOfPeople } = Object.fromEntries(form.entries());
    const { image1, image2, image3, image4 } = tableImg;
    const dataAPI = {
      stage,
      numOfPeople,
      image1,
      image2,
      image3,
      image4,
      options: option.options,
    };

    const nOPMax = isMax(dataAPI.numOfPeople, 40);
    const isStageEmpty = isNull(dataAPI.stage);
    const isNOPEmpty = isNull(dataAPI.numOfPeople);

    if (!isNOPEmpty && !dataAPI.numOfPeople) {
      setErrNOP((prev) => ({ ...prev, NOP: "Không được để trống" }));
    } else {
      if (nOPMax) {
        setErrNOP((prev) => ({
          ...prev,
          NOP: "Số lượng người quá lớn, tối đa 40",
        }));
      } else setErrNOP((prev) => ({ ...prev, NOP: "" }));
    }

    if (!isStageEmpty && !dataAPI.stage)
      setErrNOP((prev) => ({ ...prev, stage: "Không được để trống" }));
    else setErrNOP((prev) => ({ ...prev, stage: "" }));

    if (
      !nOPMax &&
      isStageEmpty &&
      isNOPEmpty &&
      !!dataAPI.stage &&
      !!dataAPI.numOfPeople
    ) {
      setOpenModalFetching(true);
      setErrNOP("");
      TableAPI.createTable(dataAPI).then((res) => {
        dispatch(addTable(res.data.data.table));
        setOpenModalFetching(false);
        modalCreateRef.current.closeModal();
      });
    }
  };

  const handleUpdateTable = (e, _id) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { stage, numOfPeople } = Object.fromEntries(form.entries());
    const { image1, image2, image3, image4, options } = tableImage[_id];
    const dataAPI = {
      _id,
      stage,
      numOfPeople,
      image1,
      image2,
      image3,
      image4,
      options,
    };

    const nOPMax = isMax(dataAPI.numOfPeople, 40);
    const isStageEmpty = isNull(dataAPI.stage);
    const isNOPEmpty = isNull(dataAPI.numOfPeople);

    if (!isNOPEmpty && !dataAPI.numOfPeople) {
      setErrNOP((prev) => ({ ...prev, NOP: "Không được để trống" }));
    } else {
      if (nOPMax) {
        setErrNOP((prev) => ({
          ...prev,
          NOP: "Số lượng người quá lớn, tối đa 40",
        }));
      } else setErrNOP((prev) => ({ ...prev, NOP: "" }));
    }

    if (!isStageEmpty && !dataAPI.stage)
      setErrNOP((prev) => ({ ...prev, stage: "Không được để trống" }));
    else setErrNOP((prev) => ({ ...prev, stage: "" }));

    if (
      !nOPMax &&
      isStageEmpty &&
      isNOPEmpty &&
      !!dataAPI.stage &&
      !!dataAPI.numOfPeople
    ) {
      setOpenModalFetching(true);
      setErrNOP("");
      TableAPI.updateTable(dataAPI).then((res) => {
        handleCloseModal(_id);
        setOpenModalFetching(false);
        dispatch(setTableImage(res.data.data.tableImage));
        dispatch(updateTable(res.data.data.table));
      });
    }
  };

  const handleDeleteTable = (_id) => {
    setOpenModalFetching(true);
    TableAPI.deleteTable(_id).then((res) => {
      handleCloseModal(_id);
      setOpenModalFetching(false);
      dispatch(deleteTable(res.data.data));
    });
  };

  const handleOption = (_id, key) => {
    return {
      remove() {
        dispatch(removeTableImageOptions({ _id, index: key }));
      },
      cancelUpdate() {
        setOption((prev) => ({ ...prev, index: undefined }));
      },
      add() {
        if (option.index >= 0)
          dispatch(
            updateTableImageOptions({
              _id,
              option: option.option,
              index: option?.index,
            })
          );
        else dispatch(addTableImageOptions({ _id, option: option.option }));
      },
    };
  };

  const handleCloseModal = (id) => {
    refsById[id].current.closeModal();
  };

  return (
    <div className={cx("container")}>
      <div className={cx("title")}>Cài đặt bàn ăn</div>
      <div className={cx("pagination")}>
        {stage.map((e, key) => (
          <Button
            key={key}
            className={cx("stageBtn")}
            onClick={() => handleOnClickStage(e)}
            variant={selectedStage === e ? "normal" : "outline"}
          >
            {e}
          </Button>
        ))}
      </div>
      <div className={cx("content")}>
        {table.map((e, key) => {
          if (e.stage === selectedStage) {
            return (
              <MTBCard
                errNOP={errNOP}
                refs={refsById[e._id]}
                key={key}
                tableInfo={e}
                tableImage={tableImage[e._id]}
                handleGetTableImage={handleGetTableImage}
                handleUpdateTable={handleUpdateTable}
                handleDeleteTable={handleDeleteTable}
                handleOnUpdateImage={handleOnUpdateImage}
                handleOption={handleOption}
                option={option}
                setOption={setOption}
                stateTableInfo={stateTableInfo}
                setStateTableInfo={setStateTableInfo}
                handleCloseModal={handleCloseModal}
              />
            );
          }
        })}
      </div>

      <Modal
        ref={modalCreateRef}
        component={
          <ModalContentManagerTableCreate
            tableImg={tableImg}
            setTableImg={setTableImg}
            previewImg={previewImg}
            setPreviewImg={setPreviewImg}
            handleCreateNewTable={handleCreateNewTable}
            option={option}
            setOption={setOption}
            errNOP={errNOP}
          />
        }
      >
        <Button className={cx("addBtn")} variant="circle">
          <AiOutlinePlus />
        </Button>
      </Modal>
      {/* Modal appear depend on update/add table */}
      <Modal open={openModalFetching} component={<Progress />}></Modal>
    </div>
  );
};

export default ManagerTable;
