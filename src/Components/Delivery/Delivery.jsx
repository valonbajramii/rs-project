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
  });

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    const imageArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        imageArray.push(reader.result);
        if (i === files.length - 1) {
          setUploadedImages((prevImages) =>
            [...prevImages, ...imageArray].slice(0, 5)
          ); // Limit to 5 images
          setNewDelivery((prevDelivery) => ({
            ...prevDelivery,
            images: [...prevDelivery.images, ...imageArray].slice(0, 5),
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageDelete = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setNewDelivery((prevDelivery) => ({
      ...prevDelivery,
      images: updatedImages,
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
            {uploadedImages.length < 5 && (
              <>
                <input
                  type="file"
                  id="file-input"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="file-input"
                  className="deliver-custom-file-upload"
                >
                  Upload up to {5 - uploadedImages.length} images
                </label>
              </>
            )}
            <div className="uploaded-images-container">
              {uploadedImages.map((image, index) => (
                <div key={index} className="uploaded-image-container">
                  <img
                    className="deliveri-image"
                    src={image}
                    alt={`Uploaded ${index}`}
                  />
                  <button
                    className="delete-button"
                    onClick={() => handleImageDelete(index)}
                  >
                    x
                  </button>
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
