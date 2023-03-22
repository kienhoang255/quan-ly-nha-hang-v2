import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import { AiFillSetting } from "react-icons/ai";
import { MdPeopleAlt } from "react-icons/md";

import styles from "./index.module.scss";

import Button from "../../Button";

import Modal from "../../Modal";
import ModalContentManagerTableUpdate from "../ModalContentManagerTableUpdate";

import emptyImg from "../../../assets/images/placeholder-400x400.png";

const cx = classNames.bind(styles);

const MTBCard = ({
  handleGetTableImage,
  tableInfo,
  tableImage,
  handleUpdateTable,
  handleOnUpdateImage,
  handleOption,
  option,
  options,
  setOption,
}) => {
  const [previewImgRedux, setPreviewImgRedux] = useState();
  useEffect(() => {
    if (tableInfo._id) {
      handleGetTableImage(tableInfo._id);
    }
  }, [tableInfo._id]);

  const ref = useRef();

  const handleCloseModal = () => {
    ref.current.closeModal();
  };

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <div
          className={cx("imgPreview")}
          style={{ backgroundImage: `url(${tableImage?.image1 || emptyImg})` }}
        ></div>
        <div className={cx("detail")}>
          <div className={cx("name")}>{tableInfo.name}</div>
          <div className={cx("numberOfPeople")}>
            <MdPeopleAlt /> {tableInfo.numOfPeople}
          </div>
        </div>
        <Modal
          ref={ref}
          component={
            <ModalContentManagerTableUpdate
              tableInfo={tableInfo}
              tableImage={tableImage}
              handleUpdateTable={handleUpdateTable}
              handleOnUpdateImage={handleOnUpdateImage}
              previewImgRedux={previewImgRedux}
              setPreviewImgRedux={setPreviewImgRedux}
              handleCloseModal={handleCloseModal}
              handleOption={handleOption}
              option={option}
              options={options}
              setOption={setOption}
            />
          }
        >
          <Button className={cx("settingBtn")}>
            <AiFillSetting />
          </Button>
        </Modal>
      </div>
    </div>
  );
};

export default MTBCard;
