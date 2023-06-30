import React from "react";

const RadioBtn = ({ name, id }) => {
  return (
    <div>
      <input type="radio" id={id} name={name} />
      <label htmlFor={name}>{e}</label>
    </div>
  );
};

export default RadioBtn;
