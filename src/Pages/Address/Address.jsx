import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Address.css";

const Address = ({ onRegister }) => {
  const [addressData, setAddressData] = useState({
    address: "",
    state: "",
    zip: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevAddressData) => ({
      ...prevAddressData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the onRegister function passed as a prop
    onRegister(addressData);
    navigate("/homepage");
  };

  return (
    <div className="container">
      <div className="content-container">
        <h1>Address Check</h1>
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Address"
            name="address"
            value={addressData.address}
            onChange={handleChange}
          />
          <div className="input1-container">
            <input
              className="input1"
              placeholder="State"
              name="state"
              value={addressData.state}
              onChange={handleChange}
            />
            <input
              className="input2"
              placeholder="ZIP Code"
              name="zip"
              value={addressData.zip}
              onChange={handleChange}
            />
          </div>
          <div className="button-container">
            <button className="button" type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;
