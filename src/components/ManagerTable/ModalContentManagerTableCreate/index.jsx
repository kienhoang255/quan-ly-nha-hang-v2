import React from "react";
import classNames from "classnames/bind";
import { AiFillDelete, AiFillEye, AiOutlineSetting } from "react-icons/ai";

import styles from "./index.module.scss";

import TextInput from "../../TextInput";
import Button from "../../Button";
import { imageToBase64 } from "../../../utils";

import emptyImg from "../../../assets/images/placeholder-400x400.png";
import { FcCancel } from "react-icons/fc";

const cx = classNames.bind(styles);

const ModalContentManagerTableCreate = ({
  tableImg,
  setTableImg,
  previewImg,
  setPreviewImg,
  handleCreateNewTable,
  option,
  setOption,
}) => {
  const array = [
    { name: "Ảnh chính", id: "image1" },
    { name: "Ảnh 2", id: "image2" },
    { name: "Ảnh 3", id: "image3" },
    { name: "Ảnh 4", id: "image4" },
  ];

  return (
    <div className={cx("container")}>
      <form className={cx("content")} onSubmit={(e) => handleCreateNewTable(e)}>
        <div className={cx("title")}>Thêm bàn ăn</div>
        <div className={cx("body")}>
          <div
            className={cx("bodyLeft")}
            style={{ backgroundImage: `url(${previewImg || emptyImg})` }}
          ></div>
          <div className={cx("bodyRight")}>
            <div className={cx("bodyRightForm")}>
              <TextInput type="number" id="stage" placeholder="Tầng" />
              <TextInput
                type="number"
                id="numOfPeople"
                placeholder="Số lượng người"
              />
              {array.map((e, key) => (
                <div key={key} className={cx("imageInput")}>
                  <div
                    className={cx("imageInputPreview")}
                    style={{
                      backgroundImage: `url(${tableImg[e.id] || emptyImg})`,
                    }}
                  ></div>
                  <TextInput
                    className={cx("imageInputInput")}
                    type="file"
                    id={e.id}
                    placeholder={e.name}
                    onChange={(event) => {
                      imageToBase64(event.target.files[0], (base64) => {
                        setTableImg((prev) => ({
                          ...prev,
                          [e.id]: base64,
                        }));
                        setPreviewImg(base64);
                      });
                    }}
                  />
                  <Button
                    className={cx("imageInputBtn")}
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewImg(tableImg[e.id])}
                  >
                    <AiFillEye />
                  </Button>
                  <Button
                    className={cx("imageInputBtn")}
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setTableImg((prev) => ({ ...prev, [e.id]: "" }))
                    }
                  >
                    <AiFillDelete />
                  </Button>
                </div>
              ))}
            </div>
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
                  if (option.index >= 0) {
                    let clone = option.options;
                    clone.splice(option.index, 1, option.option);
                    setOption((prev) => ({
                      ...prev,
                      options: clone,
                    }));
                  } else
                    setOption((prev) => ({
                      ...prev,
                      options: [...prev.options, option.option],
                    }));
                  setOption((prev) => ({ ...prev, option: "" }));
                }}
              >
                {option.index >= 0 ? "Sửa" : "Thêm"}
              </Button>
            </div>
            <div className={cx("optionList")}>
              {option.options?.map((e, key) => (
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
                        // handleOption().cancelUpdate();
                        setOption((prev) => ({
                          ...prev,
                          option: "",
                          index: -1,
                        }));
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
                        let clone = option.options;
                        clone.splice(key, 1);
                        setOption((prev) => ({
                          ...prev,
                          options: clone,
                        }));
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
        <div className={cx("footer")}>
          <Button type="button" variant="outline">
            Hủy
          </Button>
          <Button type="submit">Thêm</Button>
        </div>
      </form>
    </div>
  );
};

export default ModalContentManagerTableCreate;
