import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Address.css";

const Address = ({ onRegister }) => {
  const [addressData, setAddressData] = useState({
    address: "",
    state: "",
    zip: "",
    mobileNumber: "",
    idCard: "",
    document: null, // Added field for the uploaded document
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevAddressData) => ({
      ...prevAddressData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAddressData((prevAddressData) => ({
      ...prevAddressData,
      document: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append("address", addressData.address);
    formData.append("state", addressData.state);
    formData.append("zip", addressData.zip);
    formData.append("mobileNumber", addressData.mobileNumber);
    formData.append("idCard", addressData.idCard);
    if (addressData.document) {
      formData.append("document", addressData.document); // Add the uploaded document
    }

    // Call the onRegister function passed as a prop with FormData
    onRegister(formData);
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
          {/* <input
            className="input"
            placeholder="Mobile number"
            name="mobileNumber"
            value={addressData.mobileNumber}
            onChange={handleChange}
          /> */}
          <input
            className="input"
            placeholder="ID card"
            name="idCard"
            value={addressData.idCard}
            onChange={handleChange}
          />

          {/* File input for document upload */}
          <input
            className="file-input"
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            onChange={handleFileChange}
          />

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
