import React from "react";
import classNames from "classnames/bind";
import { AiFillDelete, AiFillEye } from "react-icons/ai";

import styles from "./index.module.scss";

import TextInput from "../../TextInput";
import Button from "../../Button";
import imageToBase64 from "../../../utils";

import emptyImg from "../../../assets/images/placeholder-400x400.png";

const cx = classNames.bind(styles);

const ModalContentManagerTableCreate = ({
  id_table,
  tableImg,
  setTableImg,
  previewImg,
  setPreviewImg,
  handleCreateNewTable,
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
            </div>
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
