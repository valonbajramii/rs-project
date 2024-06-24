import React from "react";
import "./DeliveryOptions.css";

const DeliveryOptions = () => {
  return (
    <div className="delivery-option-container">
      <h2 className="deliver-option-h2">Choose Delivery</h2>
      <div>
        <p>John Doe</p>
        <p>Rating: 4.5</p>
        <p>100.- CHF</p>
      </div>
      <div>
        <p>Jane Doe</p>
        <p>Rating: 4.7</p>
        <p>120.- CHF</p>
      </div>
      {/* More delivery options as needed */}
    </div>
  );
};

export default DeliveryOptions;
