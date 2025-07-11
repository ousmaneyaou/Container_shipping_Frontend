import React from "react";
import "../Styles/Toast.css";

const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>
        ✖
      </button>
    </div>
  );
};

export default Toast;
