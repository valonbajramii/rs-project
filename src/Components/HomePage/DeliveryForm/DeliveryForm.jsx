import React, { useState, useEffect } from "react";
import "./DeliveryForm.css";
import MyLocationIcon from "../../../icons/MyLocationIcon.svg";
import Three from "../../../icons/Three.svg";
import destinationIcon from "../../../icons/Destionation-icon.svg";
import Clock from "../../../icons/Clock.svg";
import swapIcon from "../../../icons/swapIcon.svg";
import { useMediaQuery } from "react-responsive";

const DeliveryForm = ({ updateFilterCriteria }) => {
  // Local state to manage form input values
  const [formValues, setFormValues] = useState({
    location: "",
    destination: "",
    radius: "",
    length: "",
    height: "",
    pickupTime: "",
  });

  const [selectedButton, setSelectedButton] = useState("");

  const isMobile = useMediaQuery({ maxWidth: 480 });
  // const [isMobile, setIsMobile] = useState(false);

  // // Detect if the user is on mobile
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth <= 768); // Mobile breakpoint
  //   };

  //   handleResize(); // Initial check
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // Handler to update form values and notify the parent component
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      updateFilterCriteria(updatedValues); // Notify parent with updated criteria
      return updatedValues;
    });
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="form-container">
      <h2 className="form-h2">Where are you going today?</h2>
      <div className="input-icons-container">
        <div className="form-icons-container">
          <img className="my-location-icon" src={MyLocationIcon} />
          <img className="three" src={Three} />
          <img className="destination-icon" src={destinationIcon} />
        </div>
        <div className="form-inputs-container">
          <input
            className="form-input"
            type="text"
            name="location"
            placeholder="My Location"
            value={formValues.location}
            onChange={handleChange}
          />
          <input
            className="form-input"
            type="text"
            name="destination"
            placeholder="Destination"
            value={formValues.destination}
            onChange={handleChange}
          />
          {/* <input
          className="form-input"
          type="number"
          name="radius"
          placeholder="Radius"
          value={formValues.radius}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="number"
          name="length"
          placeholder="Length"
          value={formValues.length}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="number"
          name="height"
          placeholder="Height"
          value={formValues.height}
          onChange={handleChange}
        />
        <input
          className="form-input"
          type="datetime-local"
          name="pickupTime"
          placeholder="Pickup Time"
          value={formValues.pickupTime}
          onChange={handleChange}
        /> */}
        </div>
        {isMobile && (
          <img src={swapIcon} alt="Swap Icon" className="mobile-only-icon" />
        )}
      </div>
      <div className="form-buttons-container">
        <button
          className={`form-button ${selectedButton === "Home" ? "active" : ""}`}
          onClick={() => handleButtonClick("Home")}
        >
          Home
        </button>
        <button
          className={`form-button ${selectedButton === "Work" ? "active" : ""}`}
          onClick={() => handleButtonClick("Work")}
        >
          Work
        </button>
        <button
          className={`form-button ${
            selectedButton === "Other" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("Other")}
        >
          Other
        </button>
      </div>
      {/* <hr className="form-hr" /> */}
      <div className="last-location-container">
        <img className="clock" src={Clock} />
        <div className="form-text-container">
          <h3 className="form-h3">Sette Restaurant</h3>
          <p className="form-p">Rr, Nr.255 Agim Ramadani, Prishtina 10000</p>
        </div>
      </div>
      {/* <hr className="form-hr" /> */}
      <p className="form-p2">See All Places</p>
      <button className="form-confirm-button">Confirm</button>
    </div>
  );
};

export default DeliveryForm;
