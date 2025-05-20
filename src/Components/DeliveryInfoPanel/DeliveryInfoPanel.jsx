import React, { useState } from "react";
import "./DeliveryInfoPanel.css";
import messageIcon from "../../icons/message-square.svg";
import { v4 as uuidv4 } from "uuid";

const DeliveryInfoPanel = ({ deliveryDetails, user, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? deliveryDetails.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === deliveryDetails.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleRequestDelivery = () => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const updatedDeliveries = deliveries.map((delivery) => {
      if (delivery.id === deliveryDetails.id) {
        const newRequest = {
          id: uuidv4(),
          requester: user.email,
          status: "Pending",
          timestamp: new Date().toISOString(),
          deliveryName: deliveryDetails.name,
        };
        return {
          ...delivery,
          requests: [...(delivery.requests || []), newRequest],
        };
      }
      return delivery;
    });
    localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
    alert("Delivery request sent!");
    onClose();
  };

  const currentImage = deliveryDetails.images[currentImageIndex];

  return (
    <div className="delivery-info-panel-content">
      <button className="panel-close-button" onClick={onClose}>
        ×
      </button>

      <div className="image-gallery">
        <div className="main-image-container">
          <button className="nav-button left" onClick={handlePrevClick}>
            &lt;
          </button>
          <img className="main-image" src={currentImage} alt="Delivery" />
          <button className="nav-button right" onClick={handleNextClick}>
            &gt;
          </button>

          <div className="mobile-indicator-dots">
            {deliveryDetails.images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImageIndex ? "active" : ""}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>

        <div className="thumbnail-images-container">
          {deliveryDetails.images
            .filter((_, index) => index !== currentImageIndex)
            .map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index}`}
                className="thumbnail-image"
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
        </div>
      </div>

      <div className="package-info-section">
        <h2 className="package-name">{deliveryDetails.name}</h2>
        <p className="package-description">{deliveryDetails.description}</p>

        <div className="price-section">
          <span className="price-label">Delivery Price</span>
          <span className="price-value">{deliveryDetails.price} CHF</span>
        </div>

        <div className="location-section">
          <h3 className="section-heading">Location to Destination</h3>
          <div className="location-dots">
            <span className="location-dot">☉</span>
            <span className="location-text">{deliveryDetails.location}</span>
            <span className="location-arrow">⋯</span>
            <span className="location-dot">☐</span>
            <span className="location-text">{deliveryDetails.destination}</span>
          </div>
        </div>
      </div>

      <div className="dimensions-section">
        <h3 className="section-heading">Dimensions</h3>
        <div className="dimensions-grid">
          <div className="dimension-item">
            <span className="dimension-label">Weight:</span>
            <span className="dimension-value">
              {deliveryDetails.weightinKg} Kg
            </span>
          </div>
          <div className="dimension-item">
            <span className="dimension-label">Length:</span>
            <span className="dimension-value">{deliveryDetails.length} cm</span>
          </div>
          <div className="dimension-item">
            <span className="dimension-label">Height:</span>
            <span className="dimension-value">{deliveryDetails.height} cm</span>
          </div>
          <div className="dimension-item">
            <span className="dimension-label">Width:</span>
            <span className="dimension-value">{deliveryDetails.width} cm</span>
          </div>
        </div>
      </div>

      <div className="owner-container">
        <h3 className="section-heading">Owner</h3>
        <div className="owner-button-section">
          <h2>U</h2>
          <div className="owner-info">
            <span className="owner-name">{user.name}</span>
            <span className="owner-phone">{user.phone}044231231</span>
          </div>

          <div className="deliveryinfomdal-buttons-container">
            {deliveryDetails.createdBy !== user.email && (
              <button
                onClick={handleRequestDelivery}
                className="infomodal-request-button"
              >
                Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfoPanel;
