import React, { useEffect, useRef, useState } from "react";
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
import { TableAPI } from "../../services";
import Progress from "../../components/Progress";

const cx = classNames.bind(styles);

const ManagerTable = () => {
  const stage = useSelector((stage) => stage.table.stage);
  const stageCalled = useSelector((stage) => stage.table.stageCalled);
  const table = useSelector((stage) => stage.table.table);
  const tableImage = useSelector((stage) => stage.table.tableImage);
  const dispatch = useDispatch();

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
          dispatch(setTable(res.data));
          dispatch(setStageCalled(selectedStage));
        })
        .catch((err) => err);
    }
  }, [selectedStage]);

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
    setOpenModalFetching(true);
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

    TableAPI.createTable(dataAPI).then((res) => {
      setOpenModalFetching(false);
      modalCreateRef.current.closeModal();
      dispatch(addTable(res.data.data.table));
    });
  };

  const handleUpdateTable = (e, _id) => {
    e.preventDefault();
    setOpenModalFetching(true);
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
    TableAPI.updateTable(dataAPI).then((res) => {
      setOpenModalFetching(false);
      dispatch(setTableImage(res.data.data.tableImage));
      dispatch(updateTable(res.data.data.table));
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
                key={key}
                tableInfo={e}
                tableImage={tableImage[e._id]}
                handleGetTableImage={handleGetTableImage}
                handleUpdateTable={handleUpdateTable}
                handleOnUpdateImage={handleOnUpdateImage}
                handleOption={handleOption}
                option={option}
                setOption={setOption}
                stateTableInfo={stateTableInfo}
                setStateTableInfo={setStateTableInfo}
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
            handleGetTableImage={handleGetTableImage}
            option={option}
            setOption={setOption}
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
