import React, { useState } from "react";
import "./DeliveryForm.css";

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

  // Handler to update form values and notify the parent component
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      updateFilterCriteria(updatedValues); // Notify parent with updated criteria
      return updatedValues;
    });
  };

  return (
    <div className="form-container">
      <h2 className="form-h2">Get a Delivery</h2>
      <div className="form-inputs-container">
        <input
          className="form-input"
          type="text"
          name="location"
          placeholder="Start Location"
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
        <input
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
        />
      </div>
    </div>
  );
};

export default DeliveryForm;
