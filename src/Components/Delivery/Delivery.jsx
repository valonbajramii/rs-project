import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Delivery.css";
import chevronLeft from "../../images/chevron-left.svg";

const Delivery = ({ onClose, addNewDelivery }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [inputType, setInputType] = useState({
    pickupTim: "text",
    deadline: "text",
  });
  const [newDelivery, setNewDelivery] = useState({
    images: [],
    name: "",
    location: "",
    destination: "",
    description: "",
    price: "",
    weightinKg: "",
    length: "",
    height: "",
    width: "",
    pickupTim: "",
    deadline: "",
    requests: [],
  });

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUploadedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = reader.result;

        setNewDelivery((prevDelivery) => ({
          ...prevDelivery,
          images: newImages,
        }));

        return newImages;
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = (index) => {
    setUploadedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });

    setNewDelivery((prevDelivery) => ({
      ...prevDelivery,
      images: [...uploadedImages],
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDelivery({ ...newDelivery, [name]: value });
  };

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().slice(5, 16);
    setNewDelivery({ ...newDelivery, deadline: formattedDate });
  };

  const handleAddDelivery = () => {
    addNewDelivery(newDelivery);
    onClose();
  };

  return (
    <div className="delivery-form-container">
      <div className="delivery-modal-content">
        <div className="delivery-container">
          <div className="delivery-content">
            <div className="back-button-and-text">
              <img
                src={chevronLeft}
                className="chevron-left"
                alt="Back"
                onClick={onClose}
              />
              <h2 className="delivery-h2">Add new package</h2>
            </div>

            <div className="delivery-inputs-container">
              <div className="form-section">
                <h3 className="section-title">Package Name</h3>
                <input
                  className="delivery-input"
                  type="text"
                  name="name"
                  placeholder="Aspirator"
                  value={newDelivery.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-section">
                <h3 className="section-title">Location and Destination</h3>
                <div className="input-group">
                  <input
                    className="delivery-input"
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={newDelivery.location}
                    onChange={handleInputChange}
                  />
                  <input
                    className="delivery-input"
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    value={newDelivery.destination}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Description</h3>
                <textarea
                  className="delivery-textarea"
                  name="description"
                  placeholder=""
                  value={newDelivery.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
            </div>
          </div>
          <hr className="vertical" />
          <div className="delivery-img-container">
            <div className="form-section">
              <h3 className="h3-section-title">
                {window.innerWidth <= 485 ? "Dimensions" : "Additional Info"}
              </h3>
              <div className="additional-info-grid">
                <div className="delivery-info-group">
                  <label className="dimension-label">Weight</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="weightinKg"
                      placeholder={
                        window.innerWidth <= 485 ? "Weight in kg" : ""
                      }
                      value={newDelivery.weightinKg}
                      onChange={handleInputChange}
                    />
                    <span className="unit">Kg</span>
                  </div>
                </div>

                <div className="delivery-info-group">
                  <label className="dimension-label">Length</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="length"
                      placeholder={
                        window.innerWidth <= 485 ? "Length in cm" : ""
                      }
                      value={newDelivery.length}
                      onChange={handleInputChange}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>

                <div className="delivery-info-group">
                  <label className="dimension-label">Height</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="height"
                      placeholder={
                        window.innerWidth <= 485 ? "Height in cm" : ""
                      }
                      value={newDelivery.height}
                      onChange={handleInputChange}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>

                <div className="delivery-info-group">
                  <label className="dimension-label">Width</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="width"
                      placeholder={
                        window.innerWidth <= 485 ? "Width in cm" : ""
                      }
                      value={newDelivery.width}
                      onChange={handleInputChange}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="section-title">Images</h3>
            <div className="image-grid-container">
              <div className="image-box large-box">
                {uploadedImages[0] ? (
                  <div className="uploaded-image-container">
                    <img
                      className="delivery-image"
                      src={uploadedImages[0]}
                      alt="Main"
                    />
                    <button
                      className="delivery-delete-button"
                      onClick={() => handleImageDelete(0)}
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`file-input-0`}
                    className="delivery-upload-label"
                  >
                    <span className="plus-icon">+</span>
                  </label>
                )}
                <input
                  type="file"
                  id={`file-input-0`}
                  onChange={(event) => handleImageUpload(event, 0)}
                  style={{ display: "none" }}
                />
              </div>

              {[1, 2, 3, 4].map((box, index) => (
                <div key={index} className="image-box small-box">
                  {uploadedImages[box] ? (
                    <div className="uploaded-image-container">
                      <img
                        className="delivery-image"
                        src={uploadedImages[box]}
                        alt={`Uploaded ${box}`}
                      />
                      <button
                        className="delivery-delete-button"
                        onClick={() => handleImageDelete(box)}
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-input-${box}`}
                      className="delivery-upload-label"
                    >
                      <span className="plus-icon">+</span>
                    </label>
                  )}
                  <input
                    type="file"
                    id={`file-input-${box}`}
                    onChange={(event) => handleImageUpload(event, box)}
                    style={{ display: "none" }}
                  />
                </div>
              ))}
            </div>
            <div className="form-section">
              <h3 className="section-title">Price</h3>
              <div className="input-with-unit-price">
                <input
                  className="delivery-input"
                  type="number"
                  name="price"
                  placeholder={window.innerWidth <= 485 ? "in CHF" : ""}
                  value={newDelivery.price}
                  onChange={handleInputChange}
                />
                <span className="unit">CHF</span>
              </div>
            </div>
            <div className="Container-delivery-button">
              <button className="delivery-button" onClick={handleAddDelivery}>
                Add New Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
