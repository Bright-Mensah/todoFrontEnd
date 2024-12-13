import React, { useEffect, useRef } from "react";

const Modal = ({ closeDetails, body, header, proceedText, proceedBtn }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.keyCode === 27) {
        // Prevent default escape key behavior
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      // Prevent closing on backdrop click
      event.stopPropagation();
    }
  };

  return (
    <>
      <div className="backdrop" onClick={handleClickOutside}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h6>{header}</h6>
        </div>
        <div className="modal-body scrollable">{body}</div>

        <div className="modal-footer ">
          <div className="me-3">
            <button onClick={closeDetails} className="btn btn-secondary">
              Close
            </button>
          </div>

          {proceedBtn && (
            <div className="me-3">
              <button
                onClick={proceedBtn}
                className="text-white btn btn-success"
              >
                {proceedText}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
