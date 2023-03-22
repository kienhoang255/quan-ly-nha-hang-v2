import React, { forwardRef, memo, useImperativeHandle, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";

const cx = classNames.bind(styles);

const Modal = forwardRef(({ children, component, hasValue }, ref) => {
  const [modal, setModal] = useState(false);
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);

  useImperativeHandle(ref, () => ({
    closeModal() {
      handleControlModal();
    },
    value: modal,
  }));

  const handleControlModal = () => {
    setIsOpenAnimation(!isOpenAnimation);
    setTimeout(() => {
      setModal(!modal);
    }, 150);
  };

  const handleOnClickOutSideContent = () => {
    if (!hasValue) {
      setIsOpenAnimation(!isOpenAnimation);
      setTimeout(() => {
        setModal(!modal);
      }, 150);
    }
  };

  const handleStopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div onClick={handleControlModal}>{children}</div>
      {modal && (
        <div
          className={cx(
            "container",
            isOpenAnimation ? "openContainer" : "closeContainer"
          )}
          onClick={handleOnClickOutSideContent}
        >
          <div
            className={cx(
              "content",
              isOpenAnimation ? "openContent" : "closeContent"
            )}
            onClick={handleStopPropagation}
          >
            {component}
          </div>
        </div>
      )}
    </>
  );
});

export default memo(Modal);
