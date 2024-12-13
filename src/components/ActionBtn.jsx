import React from "react";

const ActionBtn = (props) => {
  return (
    <div>
      <span
        className="input-group-text"
        id="basic-addon2"
        title={props.title}
        onClick={props.Action}
      >
        {props.label}
      </span>
    </div>
  );
};

export default ActionBtn;
