import React, { useState } from "react";
import "./DeliveryEditModal.css"; // Add your own styles
import EditImagesModal from "../EditImagesModal/EditImagesModal";

const DeliveryEditModal = ({ delivery, onSave, onClose }) => {
  const [updatedDelivery, setUpdatedDelivery] = useState({ ...delivery });
  const [isEditingImages, setIsEditingImages] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDelivery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(updatedDelivery);
  };

  const handleImageUpdate = (newImages) => {
    setUpdatedDelivery((prev) => ({ ...prev, images: newImages }));
  };

  return (
    <div className="edit-modal-container">
      <div className="edit-modal-content">
        <button onClick={onClose}>Close</button>
        <h2>Edit Delivery</h2>
        <input
          type="text"
          name="location"
          value={updatedDelivery.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <input
          type="text"
          name="destination"
          value={updatedDelivery.destination}
          onChange={handleChange}
          placeholder="Destination"
        />
        <input
          type="text"
          name="description"
          value={updatedDelivery.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="price"
          value={updatedDelivery.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          type="number"
          name="weightinKg"
          value={updatedDelivery.weightinKg}
          onChange={handleChange}
          placeholder="Weight (Kg)"
        />
        <input
          type="number"
          name="length"
          value={updatedDelivery.length}
          onChange={handleChange}
          placeholder="Length (cm)"
        />
        <input
          type="number"
          name="height"
          value={updatedDelivery.height}
          onChange={handleChange}
          placeholder="Height (cm)"
        />
        <input
          type="number"
          name="width"
          value={updatedDelivery.width}
          onChange={handleChange}
          placeholder="Width (cm)"
        />
        <input
          type="datetime-local"
          name="pickupTim"
          value={updatedDelivery.pickupTim}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="deadline"
          value={updatedDelivery.deadline}
          onChange={handleChange}
        />
        <button onClick={() => setIsEditingImages(true)}>Edit Images</button>
        <button onClick={handleSave}>Save Changes</button>
      </div>
      {/* Show the EditImagesModal when the button is clicked */}
      {isEditingImages && (
        <EditImagesModal
          images={updatedDelivery.images}
          onClose={() => setIsEditingImages(false)}
          onSave={handleImageUpdate}
        />
      )}
    </div>
  );
};

export default DeliveryEditModal;
