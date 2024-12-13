import React from "react";
import "../App.css";
import ActionBtn from "./ActionBtn";
import helper from "../helper";

const TaskC = (props) => {
  return (
    <>
      <div className="content">
        <div className="d-flex justify-content-between align-items-start mt-2 flex-wrap">
          <div>
            <strong className="ms-2">
              {helper.truncateText(props.label, 30)}
            </strong>
          </div>

          <div className="d-flex">
            {props.viewDetails && (
              <ActionBtn
                label={
                  <i className="fa fa-book text-primary">
                    <span className="ms-2">View</span>
                  </i>
                }
                title="View details"
                Action={props.viewDetails}
              />
            )}
            {props.editTodo && (
              <ActionBtn
                label={
                  <i className="fa fa-edit text-primary">
                    <span className="ms-2">Edit</span>
                  </i>
                }
                title="Edit todo"
                Action={props.editTodo}
              />
            )}
            <ActionBtn
              label={
                <i className="fa fa-trash text-danger">
                  <span className="ms-2">Delete</span>
                </i>
              }
              title="Delete todo permanently"
              Action={props.deleteTodo}
            />

            {props.restore && (
              <div className="ms-3">
                <ActionBtn
                  label={
                    <i className="fa fa-undo text-success">
                      <span className="ms-2">Restore</span>
                    </i>
                  }
                  title="Restore todo"
                  Action={props.restoreTodo}
                />
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-start mb-2">
          {helper.truncateText(props.desc, 30)}
        </div>
      </div>
    </>
  );
};

export default TaskC;
