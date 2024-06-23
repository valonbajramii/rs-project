import React from "react";
import "./Address.css";

const Address = () => {
  return (
    <div className="container">
      <div className="content-container">
        <h1>Address Check</h1>
        <div className="input-container">
          <input className="input" placeholder="Address" />
          <div className="input1-container">
            <input className="input1" placeholder="State" />
            <input className="input2" placeholder=" ZIP Code" />
          </div>
        </div>
        <div className="button-container">
          <button className="button">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Address;
