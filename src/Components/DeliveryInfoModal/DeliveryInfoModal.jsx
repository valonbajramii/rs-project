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

import React, { useState } from "react";
import "./DeliveryInfoModal.css";

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

  const currentImage = deliveryDetails.images[currentImageIndex];
  return (
    <div className="DeliveryInfoModal-overlay" onClick={onClose}>
      <div
        className="DeliveryInfoModal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="info-modal-xbutton" onClick={onClose}>
          x
        </button>
        <div className="DeliveryInfoModal-content2">
          <h2>Delivery Details</h2>

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
            </div>

            {/* Thumbnail images in column */}
            <div className="thumbnail-images-container">
              {deliveryDetails.images
                .filter((_, index) => index !== currentImageIndex) // Filter out the current image
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

          <p>Delivery Name: {deliveryDetails.name}</p>
          <p>Location: {deliveryDetails.location}</p>
          <p>Destination: {deliveryDetails.destination}</p>
          <p>Description: {deliveryDetails.description}</p>
          <p>Price: {deliveryDetails.price}.- CHF</p>
          <p>Weight: {deliveryDetails.weightinKg} Kg</p>
          <p>Length: {deliveryDetails.length} cm</p>
          <p>Height: {deliveryDetails.height} cm</p>
          <p>Width: {deliveryDetails.width} cm</p>
          <p>Pickup Time: {deliveryDetails.pickupTim}</p>
          <p>Dead Line: {deliveryDetails.deadline}</p>

          <div className="deliveryinfomdal-buttons-container">
            {deliveryDetails.createdBy !== user.email && (
              <button className="infomodal-request-button">Request</button>
            )}

            <button className="infomodal-close-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfoModal;
