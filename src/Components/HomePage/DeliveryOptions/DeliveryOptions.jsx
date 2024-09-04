import React, { useState } from "react";
import "./DeliveryOptions.css";
// import CarIcon from "../../../icons/car-front-fill.svg";
import DeliveryInfoModal from "../../DeliveryInfoModal/DeliveryInfoModal";

const DeliveryOptions = ({ deliveryOptions, deleteDelivery, user  }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleIconClick = (option) => {
    setSelectedDelivery(option); // Set the selected delivery option
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false); // Hide the modal
    setSelectedDelivery(null); // Clear the selected delivery option
  };

  return (
    <div className="delivery-option-container">
      <h2 className="deliver-option-h2">Choose Delivery</h2>
      <hr />
      <div>
        {deliveryOptions.map((option, index) => (
          <div
            key={index}
            className="delivery-option"
            onClick={() => handleIconClick(option)}
          >
            <div className="delivery-option2">
              <img
                className="car-icon"
                src={option.image}
                alt="Delivery Icon"
                onClick={() => handleIconClick(option)}
              />
              <div className="delivery-options-info">
                <p>{option.name}</p>
                <p>{option.destination}</p>
                <p>Dead Line:{option.deadline}</p>
              </div>
              <p className="deliver-price">{option.price}.- CHF</p>

              {/* Delete button visible only if the delivery was created by the current user */}
              {option.createdBy === user.email && (
                <button onClick={() => deleteDelivery(index)}>Delete</button>
              )}
            </div>
            <hr />
          </div>
        ))}
      </div>
      {/* Conditionally render the Modal */}
      {showModal && selectedDelivery && (
        <DeliveryInfoModal
          show={showModal}
          onClose={closeModal}
          deliveryDetails={selectedDelivery}
          user={user} // Pass the user prop to the modal
        />
      )}
    </div>
  );
};

export default DeliveryOptions;