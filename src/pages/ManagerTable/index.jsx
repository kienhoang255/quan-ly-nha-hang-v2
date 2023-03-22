import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import styles from "./index.module.scss";

import { AiOutlinePlus } from "react-icons/ai";

import ModalContentManagerTableCreate from "../../components/ManagerTable/ModalContentManagerTableCreate";
import MTBCard from "../../components/ManagerTable/MTBCard";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

import {
  addOption,
  removeOption,
  setStage,
  setStageCalled,
  setTable,
  setTableImage,
  updateOption,
  updateTable,
  updateTableImage,
} from "../../redux/tableSlice";
import { TableAPI } from "../../services";

const cx = classNames.bind(styles);

const ManagerTable = () => {
  const stage = useSelector((stage) => stage.table.stage);
  const stageCalled = useSelector((stage) => stage.table.stageCalled);
  const table = useSelector((stage) => stage.table.table);
  const tableImage = useSelector((stage) => stage.table.tableImage);
  const options = useSelector((stage) => stage.table.options);
  const dispatch = useDispatch();

  const [tableImg, setTableImg] = useState({});
  const [previewImg, setPreviewImg] = useState();

  const [selectedStage, setSelectedStage] = useState();

  const [option, setOption] = useState({ option: "", index: undefined });

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
    };

    TableAPI.createTable(dataAPI).then((res) => console.log(res.data.data));
  };

  const handleUpdateTable = (e, _id) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { stage, numOfPeople } = Object.fromEntries(form.entries());
    const { image1, image2, image3, image4 } = tableImage[_id];
    console.log(options);
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
      dispatch(setTableImage(res.data.data.tableImage));
      dispatch(updateTable(res.data.data.table));
    });
  };

  const handleOption = (index) => {
    return {
      remove() {
        dispatch(removeOption(index));
      },
      setUpdate() {
        setOption((prev) => ({ ...prev, index: index }));
      },
      cancelUpdate() {
        setOption((prev) => ({ ...prev, index: undefined }));
      },
      add() {
        if (option.index >= 0) dispatch(updateOption(option));
        else dispatch(addOption(option.option));
        setOption((prev) => ({ ...prev, index: undefined }));
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
                options={options}
                setOption={setOption}
              />
            );
          }
        })}
      </div>
      <Modal
        component={
          <ModalContentManagerTableCreate
            tableImg={tableImg}
            setTableImg={setTableImg}
            previewImg={previewImg}
            setPreviewImg={setPreviewImg}
            handleCreateNewTable={handleCreateNewTable}
            handleGetTableImage={handleGetTableImage}
          />
        }
      >
        <Button className={cx("addBtn")} variant="circle">
          <AiOutlinePlus />
        </Button>
      </Modal>
    </div>
  );
};

export default ManagerTable;
