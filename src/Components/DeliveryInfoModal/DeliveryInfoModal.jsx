// import React from "react";
// import "./DeliveryInfoModal.css";

// const DeliveryInfoModal = ({ show, onClose, deliveryDetails, user }) => {
//   if (!show) {
//     return null;
//   }

//   // Separate the first image from the rest
//   const [mainImage, ...otherImages] = deliveryDetails.images;

//   return (
//     <div className="DeliveryInfoModal-overlay" onClick={onClose}>
//       <div
//         className="DeliveryInfoModal-content"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button className="info-modal-xbutton" onClick={onClose}>
//           x
//         </button>
//         <div className="DeliveryInfoModal-content2">
//           <h2>Delivery Details</h2>

//           {/* Main Image and Thumbnail Images */}
//           <div className="image-gallery">
//             <div className="main-image-container">
//               <img className="main-image" src={mainImage} alt="Main Delivery" />
//             </div>

//             {otherImages.length > 0 && (
//               <div className="thumbnail-images-container">
//                 {otherImages.map((image, index) => (
//                   <img
//                     key={index}
//                     className="thumbnail-image"
//                     src={image}
//                     alt={`Thumbnail ${index + 1}`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           <p>Delivery Name: {deliveryDetails.name}</p>
//           <p>Location: {deliveryDetails.location}</p>
//           <p>Destination: {deliveryDetails.destination}</p>
//           <p>Description: {deliveryDetails.description}</p>
//           <p>Price: {deliveryDetails.price}.- CHF</p>
//           <p>Weight: {deliveryDetails.weightinKg} Kg</p>
//           <p>Length: {deliveryDetails.length} cm</p>
//           <p>Height: {deliveryDetails.height} cm</p>
//           <p>Width: {deliveryDetails.width} cm</p>
//           <p>Pickup Time: {deliveryDetails.pickupTim}</p>
//           <p>Dead Line: {deliveryDetails.deadline}</p>

//           {/* Request button visible only if the delivery was not created by the current user */}
//           <div className="deliveryinfomdal-buttons-container">
//             {deliveryDetails.createdBy !== user.email && (
//               <button className="infomodal-request-button">Request</button>
//             )}

//             <button className="infomodal-close-button" onClick={onClose}>
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryInfoModal;
//////////////////////////////////////////////////////////////////////////////////this below is the modal
import React, { useState } from "react";
import "./DeliveryInfoModal.css";
import chevronLeft from "../../images/chevron-left.svg";
import messageIcon from "../../icons/message-square.svg";
import { v4 as uuidv4 } from "uuid";

const DeliveryInfoModal = ({ show, onClose, deliveryDetails, user }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!show) {
    return null;
  }

  // Handle thumbnail click to set the main image
  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle navigation through images using arrows
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

  // const handleRequestDelivery = () => {
  //   const deliveries = JSON.parse(localStorage.getItem("deliveries"));
  //   const updatedDeliveries = deliveries.map((delivery) => {
  //     if (delivery.id === deliveryDetails.id) {
  //       const newRequest = {
  //         requester: user.email,
  //         status: "pending",
  //       };
  //       return { ...delivery, requests: [...delivery.requests, newRequest] };
  //     }
  //     return delivery;
  //   });
  //   localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
  //   alert("Delivery request sent!");
  // };

  const handleRequestDelivery = () => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const updatedDeliveries = deliveries.map((delivery) => {
      if (delivery.id === deliveryDetails.id) {
        const newRequest = {
          id: uuidv4(), // Add unique ID
          requester: user.email,
          status: "Pending", // Make sure status is capitalized to match your checks
          timestamp: new Date().toISOString(), // Add timestamp
          deliveryName: deliveryDetails.name, // Add delivery name
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
    onClose(); // Close the modal
  };

  const currentImage = deliveryDetails.images[currentImageIndex];

  return (
    <div className="DeliveryInfoModal-overlay" onClick={onClose}>
      <div
        className="DeliveryInfoModal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile back button - only shown on mobile */}
        <button className="mobile-back-button" onClick={onClose}>
          <img src={chevronLeft} alt="Back" className="back-icon" />
          <span>Back</span>
        </button>

        <button className="info-modal-xbutton" onClick={onClose}>
          x
        </button>
        <div className="DeliveryInfoModal-content2">
          {/* <h2>Delivery Details</h2> */}

          {/* Image Gallery */}
          <div className="image-gallery">
            {/* Main image container with navigation arrows */}
            <div className="main-image-container">
              <button className="nav-button left" onClick={handlePrevClick}>
                &lt;
              </button>
              <img className="main-image" src={currentImage} alt="Delivery" />
              <button className="nav-button right" onClick={handleNextClick}>
                &gt;
              </button>

              {/* Mobile indicator dots */}
              <div className="mobile-indicator-dots">
                {deliveryDetails.images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail images - hidden on mobile */}
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
                <span className="location-text">
                  {deliveryDetails.location}
                </span>
                <span className="location-arrow">⋯</span>
                <span className="location-dot">☐</span>
                <span className="location-text">
                  {deliveryDetails.destination}
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
                  {deliveryDetails.weightinKg} Kg
                </span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">Length:</span>
                <span className="dimension-value">
                  {deliveryDetails.length} cm
                </span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">Height:</span>
                <span className="dimension-value">
                  {deliveryDetails.height} cm
                </span>
              </div>
              <div className="dimension-item">
                <span className="dimension-label">Width:</span>
                <span className="dimension-value">
                  {deliveryDetails.width} cm
                </span>
              </div>
            </div>
          </div>

          {/* <p>Pickup Time: {deliveryDetails.pickupTim}</p>
          <p>Dead Line: {deliveryDetails.deadline}</p> */}
          <div className="owner-container">
            <h3 className="section-heading">Owner</h3>
            <div className="owner-button-section">
              <h2>U</h2>
              <div className="owner-info">
                <span className="owner-name">{user.name}</span>
                <span className="owner-phone">{user.phone}044231231</span>
              </div>

              <div className="deliveryinfomdal-buttons-container">
                {deliveryDetails.createdBy !== user.email &&
                  (window.innerWidth <= 485 ? (
                    <div
                      onClick={handleRequestDelivery}
                      className="mobile-message-icon"
                    >
                      <img
                        src={messageIcon}
                        alt="Contact"
                        style={{
                          width: "24px",
                          filter:
                            "brightness(0) saturate(100%) invert(39%) sepia(99%) saturate(1995%) hue-rotate(194deg) brightness(93%) contrast(101%)",
                        }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={handleRequestDelivery}
                      className="infomodal-request-button"
                    >
                      Contact
                    </button>
                  ))}

                {/* <button className="infomodal-close-button" onClick={onClose}>
              Close
            </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfoModal;

/////////////////////////////////////

// import React, { useState } from "react";
// import "./DeliveryInfoModal.css";
// import chevronLeft from "../../images/chevron-left.svg";
// import messageIcon from "../../icons/message-square.svg";

// const DeliveryInfoModal = ({
//   show,
//   onClose,
//   deliveryDetails,
//   user,
//   onRequestDelivery,
// }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   if (!show) {
//     return null;
//   }

//   // Handle thumbnail click to set the main image
//   const handleThumbnailClick = (index) => {
//     setCurrentImageIndex(index);
//   };

//   // Handle navigation through images using arrows
//   const handlePrevClick = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === 0 ? deliveryDetails.images.length - 1 : prevIndex - 1
//     );
//   };

//   const handleNextClick = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === deliveryDetails.images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const currentImage = deliveryDetails.images[currentImageIndex];

//   const handleContactClick = () => {
//     // Call the onRequestDelivery function with the delivery details
//     onRequestDelivery(deliveryDetails);
//   };

//   return (
//     <div className="DeliveryInfoModal-overlay" onClick={onClose}>
//       <div
//         className="DeliveryInfoModal-content"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Mobile back button - only shown on mobile */}
//         <button className="mobile-back-button" onClick={onClose}>
//           <img src={chevronLeft} alt="Back" className="back-icon" />
//           <span>Back</span>
//         </button>

//         <button className="info-modal-xbutton" onClick={onClose}>
//           x
//         </button>
//         <div className="DeliveryInfoModal-content2">
//           {/* <h2>Delivery Details</h2> */}

//           {/* Image Gallery */}
//           <div className="image-gallery">
//             {/* Main image container with navigation arrows */}
//             <div className="main-image-container">
//               <button className="nav-button left" onClick={handlePrevClick}>
//                 &lt;
//               </button>
//               <img className="main-image" src={currentImage} alt="Delivery" />
//               <button className="nav-button right" onClick={handleNextClick}>
//                 &gt;
//               </button>

//               {/* Mobile indicator dots */}
//               <div className="mobile-indicator-dots">
//                 {deliveryDetails.images.map((_, index) => (
//                   <span
//                     key={index}
//                     className={`dot ${
//                       index === currentImageIndex ? "active" : ""
//                     }`}
//                     onClick={() => handleThumbnailClick(index)}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Thumbnail images - hidden on mobile */}
//             <div className="thumbnail-images-container">
//               {deliveryDetails.images
//                 .filter((_, index) => index !== currentImageIndex)
//                 .map((image, index) => (
//                   <img
//                     key={index}
//                     src={image}
//                     alt={`Thumbnail ${index}`}
//                     className="thumbnail-image"
//                     onClick={() => handleThumbnailClick(index)}
//                   />
//                 ))}
//             </div>
//           </div>

//           <div className="package-info-section">
//             <h2 className="package-name">{deliveryDetails.name}</h2>
//             <p className="package-description">{deliveryDetails.description}</p>

//             <div className="price-section">
//               <span className="price-label">Delivery Price</span>
//               <span className="price-value">{deliveryDetails.price} CHF</span>
//             </div>

//             <div className="location-section">
//               <h3 className="section-heading">Location to Destination</h3>
//               <div className="location-dots">
//                 <span className="location-dot">☉</span>
//                 <span className="location-text">
//                   {deliveryDetails.location}
//                 </span>
//                 <span className="location-arrow">⋯</span>
//                 <span className="location-dot">☐</span>
//                 <span className="location-text">
//                   {deliveryDetails.destination}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="dimensions-section">
//             <h3 className="section-heading">Dimensions</h3>
//             <div className="dimensions-grid">
//               <div className="dimension-item">
//                 <span className="dimension-label">Weight:</span>
//                 <span className="dimension-value">
//                   {deliveryDetails.weightinKg} Kg
//                 </span>
//               </div>
//               <div className="dimension-item">
//                 <span className="dimension-label">Length:</span>
//                 <span className="dimension-value">
//                   {deliveryDetails.length} cm
//                 </span>
//               </div>
//               <div className="dimension-item">
//                 <span className="dimension-label">Height:</span>
//                 <span className="dimension-value">
//                   {deliveryDetails.height} cm
//                 </span>
//               </div>
//               <div className="dimension-item">
//                 <span className="dimension-label">Width:</span>
//                 <span className="dimension-value">
//                   {deliveryDetails.width} cm
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* <p>Pickup Time: {deliveryDetails.pickupTim}</p>
//           <p>Dead Line: {deliveryDetails.deadline}</p> */}
//           <div className="owner-container">
//             <h3 className="section-heading">Owner</h3>
//             <div className="owner-button-section">
//               <h2>U</h2>
//               <div className="owner-info">
//                 <span className="owner-name">{user.name}</span>
//                 <span className="owner-phone">{user.phone}044231231</span>
//               </div>

//               <div className="deliveryinfomdal-buttons-container">
//                 {deliveryDetails.createdBy !== user.email &&
//                   (window.innerWidth <= 485 ? (
//                     <div
//                       className="mobile-message-icon"
//                       onClick={handleContactClick}
//                     >
//                       <img
//                         src={messageIcon}
//                         alt="Contact"
//                         style={{
//                           width: "24px",
//                           filter:
//                             "brightness(0) saturate(100%) invert(39%) sepia(99%) saturate(1995%) hue-rotate(194deg) brightness(93%) contrast(101%)",
//                         }}
//                       />
//                     </div>
//                   ) : (
//                     <button
//                       className="infomodal-request-button"
//                       onClick={handleContactClick}
//                     >
//                       Contact
//                     </button>
//                   ))}

//                 {/* <button className="infomodal-close-button" onClick={onClose}>
//               Close
//             </button> */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryInfoModal;
