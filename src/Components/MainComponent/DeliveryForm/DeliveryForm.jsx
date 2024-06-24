import React from "react";
import "./DeliveryForm.css";

const DeliveryForm = () => {
  return (
    <div className="form-container">
      <h2 className="form-h2">Get a Delivery</h2>
      <div className="form-inputs-container">
        <input
          className="form-input"
          type="text"
          placeholder="Start Location"
        />
        <input className="form-input" type="text" placeholder="Destination" />
        <input className="form-input" type="number" placeholder="Radius" />
        <input className="form-input" type="number" placeholder="Length" />
        <input className="form-input" type="number" placeholder="Height" />
        <input
          className="form-input"
          type="datetime-local"
          placeholder="Pickup Time"
        />
      </div>
    </div>
  );
};

export default DeliveryForm;
