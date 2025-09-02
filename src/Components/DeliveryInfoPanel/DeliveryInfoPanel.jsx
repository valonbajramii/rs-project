import React, { useState, useEffect } from "react";
import "./DeliveryInfoPanel.css";
import { v4 as uuidv4 } from "uuid";
import { packagesApi } from "../../API/api";

const DeliveryInfoPanel = ({ deliveryDetails, user, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [packageOwner, setPackageOwner] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(true);

  // Ensure images is always an array
  const images = Array.isArray(deliveryDetails.images)
    ? deliveryDetails.images
    : [];

  // Fetch package owner information
  useEffect(() => {
    const fetchPackageOwner = async () => {
      try {
        setLoadingOwner(true);

        // Get the creator identifier from the package
        const creatorIdentifier =
          deliveryDetails.createdBy || deliveryDetails.userId;

        if (!creatorIdentifier) {
          setPackageOwner({
            name: "Unknown User",
            email: "unknown@example.com",
            phone: "Not available",
            isPlaceholder: true,
          });
          return;
        }

        // If the package was created by the current user, use current user info
        if (creatorIdentifier === user.id || creatorIdentifier === user.email) {
          setPackageOwner(user);
          return;
        }

        // Try to fetch owner info
        try {
          const ownerData = await packagesApi.getUser(creatorIdentifier);
          setPackageOwner(ownerData);
        } catch (error) {
          console.error("Error fetching owner:", error);
          // If we can't get the owner info, show basic info
          setPackageOwner({
            name: "Unknown User",
            email:
              typeof creatorIdentifier === "string" &&
              creatorIdentifier.includes("@")
                ? creatorIdentifier
                : "unknown@example.com",
            phone: "Not available",
            isPlaceholder: true,
          });
        }
      } catch (error) {
        console.error("Error in fetchPackageOwner:", error);
        setPackageOwner({
          name: "Error loading owner",
          email: deliveryDetails.createdBy || "Unknown",
          phone: "Not available",
          isPlaceholder: true,
        });
      } finally {
        setLoadingOwner(false);
      }
    };

    if (deliveryDetails) {
      fetchPackageOwner();
    }
  }, [deliveryDetails, user]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
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

  const currentImage =
    images[currentImageIndex] || "https://via.placeholder.com/150";

  return (
    <div className="delivery-info-panel-content">
      <button className="panel-close-button" onClick={onClose}>
        ×
      </button>

      <div className="image-gallery">
        <div className="main-image-container">
          {images.length > 1 && (
            <>
              <button className="nav-button left" onClick={handlePrevClick}>
                &lt;
              </button>
              <button className="nav-button right" onClick={handleNextClick}>
                &gt;
              </button>
            </>
          )}

          <img className="main-image" src={currentImage} alt="Delivery" />

          {images.length > 1 && (
            <div className="mobile-indicator-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="thumbnail-images-container">
            {images
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
        )}
      </div>

      <div className="package-info-section">
        <h2 className="package-name">
          {deliveryDetails.name || "Unnamed Package"}
        </h2>
        <p className="package-description">
          {deliveryDetails.description || "No description available"}
        </p>

        <div className="price-section">
          <span className="price-label">Delivery Price</span>
          <span className="price-value">
            {deliveryDetails.price || "0"} CHF
          </span>
        </div>

        <div className="location-section">
          <h3 className="section-heading">Location to Destination</h3>
          <div className="location-dots">
            <span className="location-dot">☉</span>
            <span className="location-text">
              {deliveryDetails.location || "Unknown location"}
            </span>
            <span className="location-arrow">⋯</span>
            <span className="location-dot">☐</span>
            <span className="location-text">
              {deliveryDetails.destination || "Unknown destination"}
            </span>
          </div>
        </div>
      </div>

      <div className="dimensions-section">
        <h3 className="section-heading">Dimensions</h3>
        <div className="dimensions-grid">
          <div className="dimension-item">
            <span className="dimension-label">Weight:</span>
            <span className="dimension-value">
              {deliveryDetails.weightinKg || "0"} Kg
            </span>
          </div>
          <div className="dimension-item">
            <span className="dimension-label">Length:</span>
            <span className="dimension-value">
              {deliveryDetails.length || "0"} cm
            </span>
          </div>
          <div className="dimension-item">
            <span className="dimension-label">Height:</span>
            <span className="dimension-value">
              {deliveryDetails.height || "0"} cm
            </span>
          </div>
          <div className="dimension-item">
            <span className="dimension-label">Width:</span>
            <span className="dimension-value">
              {deliveryDetails.width || "0"} cm
            </span>
          </div>
        </div>
      </div>

      <div className="owner-container">
        <h3 className="section-heading">Owner</h3>
        <div className="owner-button-section">
          {loadingOwner ? (
            <div>Loading owner information...</div>
          ) : packageOwner ? (
            <>
              <div className="owner-avatar">
                {packageOwner.profileImage ? (
                  <img src={packageOwner.profileImage} alt="Owner" />
                ) : (
                  <div className="owner-initial">
                    {packageOwner.name
                      ? packageOwner.name.charAt(0).toUpperCase()
                      : packageOwner.email
                      ? packageOwner.email.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>
              <div className="owner-info">
                <span className="owner-name">
                  {packageOwner.fullName || packageOwner.name || "Unknown User"}
                  {packageOwner.isPlaceholder && " (Information not available)"}
                </span>
                <span className="owner-phone">
                  {packageOwner.mobileNumber ||
                    packageOwner.phone ||
                    "No phone number"}
                </span>
                {packageOwner.email && packageOwner.email !== user.email && (
                  <span className="owner-email">{packageOwner.email}</span>
                )}
              </div>
            </>
          ) : (
            <div>Owner information not available</div>
          )}

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
