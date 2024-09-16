import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Delivery.css";

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

        // Set newDelivery's images based on updated uploadedImages
        setNewDelivery((prevDelivery) => ({
          ...prevDelivery,
          images: newImages, // Correctly update newDelivery's images
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
      newImages[index] = null; // Remove the image only at the specific index
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
    // Custom formatting can be applied here if needed.
    const formattedDate = date.toISOString().slice(5, 16); // Remove the year from the formatted date string
    setNewDelivery({ ...newDelivery, deadline: formattedDate });
  };

  const handleAddDelivery = () => {
    addNewDelivery(newDelivery);
    onClose(); // Close the modal after adding
  };

  return (
    <div className="delivery-modal-overlay">
      <div className="delivery-modal-content">
        <div className="delivery-container">
          <button className="delivery-close-modal" onClick={onClose}>
            x
          </button>
          <div className="delivery-content">
            <h2 className="delivery-h2">Add Delivery</h2>
            <div className="delivery-inputs-container">
              <input
                className="delivery-input"
                type="text"
                name="name"
                placeholder="Delivery Name"
                value={newDelivery.name}
                onChange={handleInputChange}
              />
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
              <input
                className="delivery-input"
                type="text"
                name="description"
                placeholder="Description"
                value={newDelivery.description}
                onChange={handleInputChange}
              />
              <input
                className="delivery-input"
                type="number"
                name="price"
                placeholder="Price in CHF"
                value={newDelivery.price}
                onChange={handleInputChange}
              />
              <input
                className="delivery-input"
                type="number"
                name="weightinKg"
                placeholder="Weight in Kg"
                value={newDelivery.weightinKg}
                onChange={handleInputChange}
              />
              <input
                className="delivery-input"
                type="number"
                name="length"
                placeholder="Length"
                value={newDelivery.length}
                onChange={handleInputChange}
              />
              <input
                className="delivery-input"
                type="number"
                name="height"
                placeholder="Height"
                value={newDelivery.height}
                onChange={handleInputChange}
              />
              <input
                className="delivery-input"
                type="number"
                name="width"
                placeholder="Width"
                value={newDelivery.width}
                onChange={handleInputChange}
              />
              <input
                className="delivery-input"
                type={inputType.pickupTim}
                name="pickupTim"
                placeholder="Pickup Time"
                value={newDelivery.pickupTim}
                onFocus={() =>
                  setInputType({ ...inputType, pickupTim: "datetime-local" })
                }
                onBlur={() =>
                  newDelivery.pickupTim === "" &&
                  setInputType({ ...inputType, pickupTim: "text" })
                }
                onChange={handleInputChange}
              />
              <DatePicker
                className="delivery-input"
                selected={
                  newDelivery.deadline
                    ? new Date(`2024-${newDelivery.deadline}`)
                    : null
                }
                onChange={handleDateChange}
                showTimeSelect
                showMonthDropdown
                showDayDropdown
                dateFormat="MMMM d, h:mm aa"
                placeholderText="Deadline"
              />
            </div>
          </div>
          <div className="delivery-img-container">
            <div className="image-grid-container">
              {/* Main central large box */}
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
                      onClick={() => handleImageDelete(0)} // Delete specific image in this box
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <label htmlFor={`file-input-0`} className="upload-label">
                    <span className="plus-icon">+</span>
                  </label>
                )}
                {/* Hidden input for file upload for the large box */}
                <input
                  type="file"
                  id={`file-input-0`}
                  onChange={(event) => handleImageUpload(event, 0)} // Upload image for the large box
                  style={{ display: "none" }}
                />
              </div>

              {/* Smaller boxes surrounding the large one */}
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
                        onClick={() => handleImageDelete(box)} // Delete specific image in this box
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-input-${box}`}
                      className="upload-label"
                    >
                      <span className="plus-icon">+</span>
                    </label>
                  )}
                  {/* Hidden input for file upload for each smaller box */}
                  <input
                    type="file"
                    id={`file-input-${box}`}
                    onChange={(event) => handleImageUpload(event, box)} // Upload image for the specific smaller box
                    style={{ display: "none" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="Container-delivery-button">
          <button className="delivery-button" onClick={handleAddDelivery}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
