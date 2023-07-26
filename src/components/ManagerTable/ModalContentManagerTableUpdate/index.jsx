import React, { useEffect } from "react";
import classNames from "classnames/bind";
import { AiFillDelete, AiFillEye, AiOutlineSetting } from "react-icons/ai";
import { FcCancel } from "react-icons/fc";

import styles from "./index.module.scss";

import TextInput from "../../TextInput";
import Button from "../../Button";
import { imageToBase64 } from "../../../utils";

import emptyImg from "../../../assets/images/placeholder-400x400.png";

const cx = classNames.bind(styles);

const ModalContentManagerTableUpdate = ({
  tableImage,
  previewImgRedux,
  setPreviewImgRedux,
  handleUpdateTable,
  handleDeleteTable,
  tableInfo,
  handleOnUpdateImage,
  handleCloseModal,
  handleOption,
  option,
  setOption,
  stateTableInfo,
  setStateTableInfo,
  errNOP,
}) => {
  const array = [
    { name: "Ảnh chính", id: "image1", imgAPI: tableImage?.image1 },
    { name: "Ảnh 2", id: "image2", imgAPI: tableImage?.image2 },
    { name: "Ảnh 3", id: "image3", imgAPI: tableImage?.image3 },
    { name: "Ảnh 4", id: "image4", imgAPI: tableImage?.image4 },
  ];

  useEffect(() => {
    setStateTableInfo(tableInfo);
  }, []);

  return (
    <div className={cx("container")}>
      <form
        className={cx("content")}
        onSubmit={(e) => handleUpdateTable(e, tableInfo._id)}
      >
        <div className={cx("title")}>Cập nhật bàn ăn</div>
        <div className={cx("body")}>
          <div
            className={cx("bodyLeft")}
            style={{
              backgroundImage: `url(${
                previewImgRedux || tableImage?.image1 || emptyImg
              })`,
            }}
          ></div>
          <div className={cx("bodyRight")}>
            <div className={cx("bodyRightForm")}>
              <TextInput
                id="stage"
                type="number"
                placeholder="Tầng"
                value={stateTableInfo?.stage}
                onChange={(e) => {
                  setStateTableInfo((prev) => ({
                    ...prev,
                    stage: e.target.value,
                  }));
                }}
              />
              <div className={cx("err")}> {errNOP.stage}</div>
              <TextInput
                id="numOfPeople"
                type="number"
                placeholder="Số lượng người"
                value={stateTableInfo?.numOfPeople}
                onChange={(e) => {
                  setStateTableInfo((prev) => ({
                    ...prev,
                    numOfPeople: e.target.value,
                  }));
                }}
              />
              <div className={cx("err")}>{errNOP.NOP}</div>
              {array.map((e, key) => (
                <div key={key} className={cx("imageInput")}>
                  <div
                    className={cx("imageInputPreview")}
                    style={{
                      backgroundImage: `url(${e.imgAPI || emptyImg})`,
                    }}
                  ></div>
                  <TextInput
                    className={cx("imageInputInput")}
                    type="file"
                    id={e.id}
                    placeholder={e.name}
                    onChange={(event) => {
                      imageToBase64(event.target.files[0], (base64) => {
                        handleOnUpdateImage({
                          _id: tableInfo._id,
                          [e.id]: base64,
                        });
                        setPreviewImgRedux(base64);
                      });
                    }}
                  />
                  <Button
                    className={cx("imageInputBtn")}
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewImgRedux([e.imgAPI])}
                  >
                    <AiFillEye />
                  </Button>
                  <Button
                    className={cx("imageInputBtn")}
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleOnUpdateImage({
                        _id: tableInfo._id,
                        [e.id]: "",
                      });
                    }}
                  >
                    <AiFillDelete />
                  </Button>
                </div>
              ))}
            </div>

            <div className={cx("option")}>
              <div className={cx("optionAdd")}>
                <TextInput
                  className={cx("optionText")}
                  type="add"
                  id="option"
                  placeholder="Mô tả"
                  value={option.option}
                  onChange={(e) => {
                    setOption((prev) => ({ ...prev, option: e.target.value }));
                  }}
                />
                <Button
                  className={cx("optionBtn")}
                  onClick={() => {
                    handleOption(tableInfo._id).add();
                    setOption((prev) => ({ ...prev, option: "" }));
                  }}
                >
                  {option.index >= 0 ? "Sua" : "Thêm"}
                </Button>
              </div>
              <div className={cx("optionList")}>
                {tableImage?.options?.map((e, key) => (
                  <div
                    className={cx(
                      "optionListItem",
                      option.index === key && "optionListItemSelected"
                    )}
                    key={key}
                  >
                    <p className={cx("optionListItemDetail")}>{e}</p>
                    {option.index !== key && (
                      <Button
                        className={cx("optionListItemSetBtn")}
                        onClick={() => {
                          setOption((prev) => ({
                            ...prev,
                            option: e,
                            index: key,
                          }));
                        }}
                      >
                        <AiOutlineSetting />
                      </Button>
                    )}
                    {option.index === key && (
                      <Button
                        className={cx("optionListItemCancelBtn")}
                        variant="outline"
                        onClick={() => {
                          handleOption().cancelUpdate();
                          setOption((prev) => ({ ...prev, option: "" }));
                        }}
                      >
                        <FcCancel />
                      </Button>
                    )}
                    {option.index !== key && (
                      <Button
                        className={cx("optionListItemDelBtn")}
                        variant="outline"
                        onClick={() => {
                          handleOption(tableInfo._id, key).remove();
                        }}
                      >
                        <AiFillDelete />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={cx("footer")}>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleCloseModal(tableInfo._id)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDeleteTable(tableInfo._id)}
          >
            Xoá
          </Button>
          <Button type="submit">Cập nhật</Button>
        </div>
      </form>
    </div>
  );
};

export default ModalContentManagerTableUpdate;
