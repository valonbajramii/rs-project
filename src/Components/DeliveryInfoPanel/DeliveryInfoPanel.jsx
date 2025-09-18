import React, { useState, useEffect } from "react";
import "./DeliveryInfoPanel.css";
import { v4 as uuidv4 } from "uuid";
import { packagesApi, transportApi } from "../../API/api";
import fallbackImage from "../../icons/car-front-fill.svg";
import chevronLeft from "../../images/chevron-left.svg";

const DeliveryInfoPanel = ({ deliveryDetails, user, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [packageOwner, setPackageOwner] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  // FIXED: Use imagePaths directly as they already contain full URLs
  const images = Array.isArray(deliveryDetails.imagePaths)
    ? deliveryDetails.imagePaths
    : [];

  // Add debug logging
  useEffect(() => {
    console.log("DeliveryInfoPanel received:", deliveryDetails);
    console.log("Creator info:", deliveryDetails.Creator);
    console.log("Image paths:", images);
  }, [deliveryDetails]);

  // Fetch package owner information
  useEffect(() => {
    const fetchPackageOwner = async () => {
      try {
        setLoadingOwner(true);

        // Check if the package already has creator info from backend
        if (deliveryDetails.Creator) {
          console.log(
            "Using creator info from package:",
            deliveryDetails.Creator
          );
          setPackageOwner({
            id: deliveryDetails.Creator.Id || deliveryDetails.Creator.id,
            fullName:
              deliveryDetails.Creator.FullName ||
              deliveryDetails.Creator.fullName,
            email:
              deliveryDetails.Creator.Email || deliveryDetails.Creator.email,
            mobileNumber:
              deliveryDetails.Creator.MobileNumber ||
              deliveryDetails.Creator.mobileNumber,
            phone:
              deliveryDetails.Creator.MobileNumber ||
              deliveryDetails.Creator.mobileNumber,
          });
          return;
        }

        // Fallback to old method if Creator doesn't exist
        const creatorIdentifier =
          deliveryDetails.userId || deliveryDetails.createdBy;

        if (!creatorIdentifier) {
          setPackageOwner({
            name: "Unknown User",
            email: "unknown@example.com",
            phone: "Not available",
            isPlaceholder: true,
          });
          return;
        }

        if (creatorIdentifier === user.id || creatorIdentifier === user.email) {
          setPackageOwner(user);
          return;
        }

        // Try API method to get user details
        try {
          const ownerData = await packagesApi.getUser(creatorIdentifier);
          setPackageOwner(ownerData);
        } catch (error) {
          console.error("Error fetching owner:", error);
          setPackageOwner({
            name: "Unknown User",
            email: creatorIdentifier.includes("@")
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

  const handleImageError = (imageUrl, index) => {
    console.error(`Failed to load image ${index}: ${imageUrl}`);
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleRequestDelivery = async () => {
    try {
      const requestData = {
        PackageId: deliveryDetails.id,
        Message: `I would like to deliver your package: ${deliveryDetails.name}`,
      };

      console.log("Sending request data:", requestData);

      const response = await transportApi.createRequest(requestData);
      console.log("Request created:", response);

      // Add to chat contacts when request is sent
      if (packageOwner) {
        const newContact = {
          id: packageOwner.id,
          email: packageOwner.email,
          name: packageOwner.fullName || packageOwner.name,
          profileImage: packageOwner.profileImage || null,
        };

        // Use user-specific storage
        if (user?.id) {
          const userContactsKey = `chatContacts_${user.id}`;
          const storedContacts = JSON.parse(
            localStorage.getItem(userContactsKey) || "[]"
          );
          const contactExists = storedContacts.some(
            (c) => c.email === newContact.email
          );

          if (!contactExists) {
            const updatedContacts = [...storedContacts, newContact];
            localStorage.setItem(
              userContactsKey,
              JSON.stringify(updatedContacts)
            );
          }
        }
      }

      alert("Delivery request sent successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to send request:", error);

      // Show specific error messages
      let errorMessage =
        error.message || "Failed to send request. Please try again.";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.Title) {
          errorMessage = error.response.data.Title;
        }
      }

      alert(errorMessage);
    }
  };

  const currentImage = images[currentImageIndex] || fallbackImage;

  return (
    <div className="delivery-info-panel-content">
      <button className="panel-close-button" onClick={onClose}>
        <img
          src={chevronLeft}
          className="chevron-left"
          alt="Back"
          onClick={onClose}
        />
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

          <img
            className="main-image"
            src={currentImage}
            alt="Delivery"
            onError={() => handleImageError(currentImage, currentImageIndex)}
            onLoad={() => console.log(`Main image loaded: ${currentImage}`)}
          />

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
                  onError={() => handleImageError(image, index)}
                  onLoad={() => console.log(`Thumbnail loaded: ${image}`)}
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
                  <img
                    className="owner-avatar-img"
                    src={packageOwner.profileImage}
                    alt="Owner"
                  />
                ) : (
                  <div className="owner-initial">
                    {packageOwner.fullName
                      ? packageOwner.fullName.charAt(0).toUpperCase()
                      : packageOwner.name
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
                {/* {packageOwner.email && packageOwner.email !== user.email && (
                  <span className="owner-email">{packageOwner.email}</span>
                )} */}
              </div>
            </>
          ) : (
            <div>Owner information not available</div>
          )}

          <div className="deliveryinfomdal-buttons-container">
            {deliveryDetails.userId !== user.id && (
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
