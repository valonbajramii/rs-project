import React from "react";
import "./DeliveryInfoModal.css";

const DeliveryInfoModal = ({ show, onClose, deliveryDetails }) => {
  if (!show) {
    return null; // Do not render the modal if `show` is false
  }

  return (
    <div className="DeliveryInfoModal-overlay" onClick={onClose}>
      <div
        className="DeliveryInfoModal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2>Delivery Details</h2>
        <img src={deliveryDetails.image} alt="Delivery Icon" />
        <p>Location: {deliveryDetails.location}</p>
        <p>Destination: {deliveryDetails.destination}</p>
        <p>Description: {deliveryDetails.description}</p>
        <p>Price: {deliveryDetails.price}.- CHF</p>
        <p>Weight: {deliveryDetails.weightinKg} Kg</p>
        <p>Length: {deliveryDetails.length} cm</p>
        <p>Height: {deliveryDetails.hight} cm</p>
        <p>Width: {deliveryDetails.width} cm</p>
        <p>Pickup Time: {deliveryDetails.pickupTim}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DeliveryInfoModal;