import React, { memo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiFillCloseCircle,
} from "react-icons/ai";
import Tippy from "@tippyjs/react";

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
  dropdown = false,
  listDropdown,
  setInputValueOnDropdown,
  autoComplete,
  ...props
}) => {
  const [defaultType, setType] = useState(type);
  const [hideReveal, setHideReveal] = useState(false);
  const [inputValue, setInputValue] = useState(value ? value : "");
  const [showTippy, setShowTippy] = useState(false);

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

  function handleAutoComplete(inputValue) {
    let result = [];
    result = listDropdown?.filter((value) =>
      value.toLowerCase()?.includes(inputValue.toLowerCase())
    );

    if (result.length == 0) {
      result = ["Không có dữ liệu"];
    }
    return result;
  }

  return (
    <>
      {type !== "file" ? (
        <div>
          <Tippy
            visible={showTippy}
            placement="bottom-start"
            interactive={true}
            onClickOutside={() => {
              setShowTippy(false);
            }}
            content={
              dropdown ? (
                <div className={cx("dropDown")}>
                  {autoComplete && handleAutoComplete(value)
                    ? handleAutoComplete(value)?.map((e, key) => (
                        <div
                          key={key}
                          className={cx("itemDropdown")}
                          onClick={() => {
                            setInputValueOnDropdown(e);
                            setShowTippy(false);
                          }}
                        >
                          {e}
                        </div>
                      ))
                    : listDropdown?.map((e, key) => (
                        <div
                          key={key}
                          className={cx("itemDropdown")}
                          onClick={() => {
                            setInputValueOnDropdown(e);
                            setShowTippy(false);
                          }}
                        >
                          {e}
                        </div>
                      ))}
                </div>
              ) : (
                <></>
              )
            }
          >
            <div
              className={cx("container")}
              onClick={() => {
                setShowTippy(true);
              }}
            >
              {rightIcon && (
                <div className={cx("rightIcon")}>
                  <RightIcon />
                </div>
              )}
              <input
                {...props}
                className={cx("input", { [className]: className })}
                id={id}
                name={id}
                type={defaultType}
                placeholder=" "
                autoComplete="one-time-code"
                value={rightIcon ? value : value}
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
          </Tippy>
        </div>
      ) : (
        <TypeIsFile />
      )}
    </>
  );
};

export default memo(TextInput);
