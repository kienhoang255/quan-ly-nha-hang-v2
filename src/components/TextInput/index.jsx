import React, { memo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillCloseCircle,
} from "react-icons/ai";

const cx = classNames.bind(styles);

const TextInput = ({
  id = "text",
  type = "text",
  placeholder = "Text Field",
  rightIcon = false,
  value,
  onChange,
  className,
  defaultValue,
  onClear,
}) => {
  const [defaultType, setType] = useState(type);
  const [hideReveal, setHideReveal] = useState(false);
  const [inputValue, setInputValue] = useState(value ? value : "");

  const PasswordHideReveal = () => (
    <div
      className={cx("hideReveal")}
      onClick={() => {
        setHideReveal(!hideReveal);
        hideReveal ? setType("password") : setType("text");
      }}
    >
      {hideReveal ? <AiFillEye /> : <AiFillEyeInvisible />}
    </div>
  );

  const ClearText = () => (
    <div className={cx("clearText")} onClick={handleClearText}>
      <AiFillCloseCircle />
    </div>
  );

  const RightIcon = () => {
    switch (type) {
      case "password":
        return <PasswordHideReveal />;
      default:
        return <ClearText />;
    }
  };

  const TypeIsFile = () => (
    <div className={cx("file")}>
      <label htmlFor={id} className={cx("fileBtn", { [className]: className })}>
        {placeholder}
      </label>
      <input
        type="file"
        id={id}
        name={id}
        accept="image/*"
        style={{ display: "none" }}
        onChange={onChange}
      />
    </div>
  );

  const handleClearText = () => {
    setInputValue("");
    onChange && onClear("");
  };

  const handleOnChangeInput = (e) => {
    setInputValue(e.target.value);
    onChange && onChange(e);
  };

  return (
    <>
      {type !== "file" ? (
        <div className={cx("container")}>
          {rightIcon && (
            <div className={cx("rightIcon")}>
              <RightIcon />
            </div>
          )}
          <input
            className={cx("input", { [className]: className })}
            id={id}
            name={id}
            type={defaultType}
            placeholder=" "
            value={rightIcon ? inputValue : value}
            onChange={(e) => {
              if (rightIcon) {
                handleOnChangeInput(e);
              } else onChange(e);
            }}
            defaultValue={defaultValue}
          />
          <label className={cx("label")} htmlFor={id}>
            {placeholder}
          </label>
        </div>
      ) : (
        <TypeIsFile />
      )}
    </>
  );
};

export default memo(TextInput);
