import React, { useState } from "react";
import "./Delivery.css";

const Delivery = ({ onClose, addNewDelivery }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [newDelivery, setNewDelivery] = useState({
    image: null,
    location: "",
    destination: "",
    description: "",
    price: "",
    weightinKg: "",
    length: "",
    height: "",
    width: "",
    pickupTim: "",
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setNewDelivery({ ...newDelivery, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setUploadedImage(null);
    setNewDelivery({ ...newDelivery, image: null });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDelivery({ ...newDelivery, [name]: value });
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
                type="datetime-local"
                name="pickupTim"
                placeholder="Pickup Time"
                value={newDelivery.pickupTim}
                onChange={handleInputChange}
              />
              <div className="Container-delivery-button">
                <button className="delivery-button" onClick={handleAddDelivery}>
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="delivery-img-container">
            {!uploadedImage && (
              <>
                <input
                  type="file"
                  id="file-input"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="file-input"
                  className="deliver-custom-file-upload"
                >
                  Upload image
                </label>
              </>
            )}
            {uploadedImage && (
              <div className="uploaded-image-container">
                <img
                  className="deliveri-image"
                  src={uploadedImage}
                  alt="Uploaded"
                />
                <button className="delete-button" onClick={handleImageDelete}>
                  x
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
