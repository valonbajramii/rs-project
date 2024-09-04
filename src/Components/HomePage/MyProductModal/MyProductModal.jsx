import React from "react";
import "./MyProductModal.css";

const MyProductModal = ({ onClose }) => {
  return (
    <div className="myproductmodal-container">
      <div className="myproductmodal-content">
        <button onClick={onClose}>x</button>
        <p>hello</p>
      </div>
    </div>
  );
};

export default MyProductModal;
