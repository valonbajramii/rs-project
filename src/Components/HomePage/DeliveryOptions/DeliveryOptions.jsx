// import React, { useState } from "react";
// import "./DeliveryOptions.css";
// // import CarIcon from "../../../icons/car-front-fill.svg";
// import DeliveryInfoModal from "../../DeliveryInfoModal/DeliveryInfoModal";

// const DeliveryOptions = ({ deliveryOptions, deleteDelivery, user  }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);

//   const handleIconClick = (option) => {
//     setSelectedDelivery(option); // Set the selected delivery option
//     setShowModal(true); // Show the modal
//   };

//   const closeModal = () => {
//     setShowModal(false); // Hide the modal
//     setSelectedDelivery(null); // Clear the selected delivery option
//   };

//   return (
//     <div className="delivery-option-container">
//       <h2 className="deliver-option-h2">Choose Delivery</h2>
//       <hr />
//       <div>
//         {deliveryOptions.map((option, index) => (
//           <div
//             key={index}
//             className="delivery-option"
//             onClick={() => handleIconClick(option)}
//           >
//             <div className="delivery-option2">
//               <img
//                 className="car-icon"
//                 src={option.image}
//                 alt="Delivery Icon"
//                 onClick={() => handleIconClick(option)}
//               />
//               <div className="delivery-options-info">
//                 <p>{option.name}</p>
//                 <p>{option.destination}</p>
//                 <p>Dead Line:{option.deadline}</p>
//               </div>
//               <p className="deliver-price">{option.price}.- CHF</p>

//               {/* Delete button visible only if the delivery was created by the current user */}
//               {option.createdBy === user.email && (
//                 <button onClick={() => deleteDelivery(index)}>Delete</button>
//               )}
//             </div>
//             <hr />
//           </div>
//         ))}
//       </div>
//       {/* Conditionally render the Modal */}
//       {showModal && selectedDelivery && (
//         <DeliveryInfoModal
//           show={showModal}
//           onClose={closeModal}
//           deliveryDetails={selectedDelivery}
//           user={user} // Pass the user prop to the modal
//         />
//       )}
//     </div>
//   );
// };

// export default DeliveryOptions;

// import React, { useState, useEffect } from "react";
// import "./DeliveryOptions.css";
// import DeliveryInfoModal from "../../DeliveryInfoModal/DeliveryInfoModal";
// import HeartIcon from "../../../icons/Heart-icon.svg";

// const DeliveryOptions = ({
//   deliveryOptions,
//   user,
//   toggleFavorite,
//   favorites = [],
// }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);

//   // Handle opening the modal when a delivery is clicked
//   const handleIconClick = (option) => {
//     setSelectedDelivery(option); // Set the clicked delivery as selected
//     setShowModal(true); // Show the modal
//   };

//   // Handle closing the modal
//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedDelivery(null); // Clear the selected delivery
//   };

//   // Check if a delivery is in the favorites list
//   const isFavorite = (deliveryId) => {
//     return favorites.includes(deliveryId);
//   };

//   return (
//     <div className="delivery-option-container">
//       <h2 className="deliver-option-h2">Welcome User</h2>
//       <input className="delivery-option-input" placeholder="Search by City" />
//       <div className="scrollable-container">
//         <div className="dlivery-option-menu">
//           {deliveryOptions.map((option, index) => (
//             <div key={index} onClick={() => handleIconClick(option)}>
//               <div className="delivery-option">
//                 <img
//                   className="car-icon"
//                   src={
//                     Array.isArray(option.images) && option.images.length > 0
//                       ? option.images[0]
//                       : "default-image-path.jpg"
//                   }
//                   alt="Delivery Icon"
//                   onClick={() => handleIconClick(option)}
//                 />
//                 <div className="delivery-option-info">
//                   <p className="delivery-option-name">{option.name}</p>
//                   <p className="delivery-option-destination">
//                     {option.destination}
//                   </p>
//                   <p className="delivery-option-deadline">
//                     Deadline: {option.deadline}
//                   </p>
//                 </div>
//                 <div className="delivery-price-container">
//                   <p className="delivery-price">CHF-{option.price}</p>
//                   <div
//                     className="star-icon"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleFavorite(option.id);
//                     }}
//                   >
//                     <img src={HeartIcon} />
//                   </div>
//                 </div>
//               </div>
//               <hr className="deliveri-options-hr" />
//             </div>
//           ))}
//         </div>
//       </div>
//       <button className="add-new-package-btn">Add New Package</button>

//       {/* Delivery Info Modal */}
//       {showModal && selectedDelivery && (
//         <DeliveryInfoModal
//           show={showModal}
//           onClose={closeModal}
//           deliveryDetails={selectedDelivery}
//           user={user}
//         />
//       )}
//     </div>
//   );
// };

// export default DeliveryOptions;

////////////////////////

// import React, { useState } from "react";
// import "./DeliveryOptions.css";
// import DeliveryInfoModal from "../../DeliveryInfoModal/DeliveryInfoModal";
// import Delivery from "../../Delivery/Delivery";
// import HeartIcon from "../../../icons/Heart-icon.svg";

// const DeliveryOptions = ({
//   deliveryOptions,
//   user,
//   toggleFavorite,
//   favorites = [],
// }) => {
//   const [showInfoModal, setShowInfoModal] = useState(false);
//   const [showDeliveryModal, setShowDeliveryModal] = useState(false);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [deliveries, setDeliveries] = useState(deliveryOptions || []);

//   // Open the delivery info modal
//   const handleIconClick = (option) => {
//     setSelectedDelivery(option);
//     setShowInfoModal(true);
//   };

//   // Close the delivery info modal
//   const closeModal = () => {
//     setShowInfoModal(false);
//     setSelectedDelivery(null);
//   };

//   // Add a new delivery
//   const addNewDelivery = (newDelivery) => {
//     setDeliveries((prevDeliveries) => [...prevDeliveries, newDelivery]);
//     setShowDeliveryModal(false); // Close the delivery modal after adding
//   };

//   return (
//     <div className="delivery-option-container">
//       <h2 className="deliver-option-h2">Welcome User</h2>
//       <input className="delivery-option-input" placeholder="Search by City" />
//       <div className="scrollable-container">
//         <div className="dlivery-option-menu">
//           {deliveries.map((option, index) => (
//             <div key={index} onClick={() => handleIconClick(option)}>
//               <div className="delivery-option">
//                 <img
//                   className="car-icon"
//                   src={
//                     Array.isArray(option.images) && option.images.length > 0
//                       ? option.images[0]
//                       : "default-image-path.jpg"
//                   }
//                   alt="Delivery Icon"
//                   onClick={() => handleIconClick(option)}
//                 />
//                 <div className="delivery-option-info">
//                   <p className="delivery-option-name">{option.name}</p>
//                   <p className="delivery-option-destination">
//                     {option.destination}
//                   </p>
//                   <p className="delivery-option-deadline">
//                     Deadline: {option.deadline}
//                   </p>
//                 </div>
//                 <div className="delivery-price-container">
//                   <p className="delivery-price">CHF-{option.price}</p>
//                   <div
//                     className="star-icon"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleFavorite(option.id);
//                     }}
//                   >
//                     <img src={HeartIcon} />
//                   </div>
//                 </div>
//               </div>
//               <hr className="deliveri-options-hr" />
//             </div>
//           ))}
//         </div>
//       </div>
//       <button
//         className="add-new-package-btn"
//         onClick={() => setShowDeliveryModal(true)}
//       >
//         Add New Package
//       </button>

//       {/* Delivery Info Modal */}
//       {showInfoModal && selectedDelivery && (
//         <DeliveryInfoModal
//           show={showInfoModal}
//           onClose={closeModal}
//           deliveryDetails={selectedDelivery}
//           user={user}
//         />
//       )}

//       {/* Add New Delivery Modal */}
//       {showDeliveryModal && (
//         <Delivery
//           onClose={() => setShowDeliveryModal(false)}
//           addNewDelivery={addNewDelivery}
//         />
//       )}
//     </div>
//   );
// };

// export default DeliveryOptions;

import React, { useState } from "react";
import "./DeliveryOptions.css";
import HeartIcon from "../../../icons/Heart-icon.svg";
import HeartFilledIcon from "../../../icons/HeartShape.svg"; // Add this import
import { useNavigate } from "react-router-dom";
import fallbackImage from "../../../icons/car-front-fill.svg";
import { useMediaQuery } from "react-responsive";

const DeliveryOptions = ({
  deliveryOptions,
  user,
  toggleFavorite,
  favorites = [],
  setIsAddPackageView,
  setShowForm,
  setShowProfile,
  setShowCompleteProfile,
  setSelectedDelivery,
  loading,
  onAddPackageClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ maxWidth: 480 });

  const handleAddPackageClick = () => {
    if (onAddPackageClick) {
      onAddPackageClick();
    } else {
      if (!user) {
        navigate("/login");
        return;
      }
      if (!user.isProfileComplete) {
        setShowCompleteProfile(true);
        setShowForm(false);
        setIsAddPackageView(false);
        setShowProfile(false);
        return;
      }
      setShowForm(true);
      setIsAddPackageView(true);
    }
  };

  const handleImageError = (optionId, imageUrl) => {
    console.error(`Failed to load image for package ${optionId}: ${imageUrl}`);
    setImageErrors((prev) => ({ ...prev, [optionId]: true }));
  };

  const debugImageUrls = (option) => {
    console.log(`Package: ${option.name}`);
    console.log("Image paths:", option.imagePaths);
    if (option.imagePaths && option.imagePaths.length > 0) {
      option.imagePaths.forEach((path, index) => {
        console.log(`Image ${index}: ${path}`);
      });
    }
  };

  const filteredOptions = deliveryOptions.filter((option) => {
    const location = option.location || "";
    const destination = option.destination || "";

    const matches =
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.toLowerCase().includes(searchTerm.toLowerCase());

    return matches;
  });

  // Check if a package is favorited
  const isFavorited = (packageId) => {
    return favorites.includes(packageId);
  };

  return (
    <div className="delivery-option-container">
      <h2 className="deliver-option-h2">Welcome {user?.fullName || "User"}</h2>
      <input
        className="delivery-option-input"
        placeholder="Search by City"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="loading-message">Loading packages...</div>
      ) : (
        <div className="scrollable-container">
          <div className="delivery-option-menu">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                debugImageUrls(option);

                const hasError = imageErrors[option.id];
                const hasImages =
                  option.imagePaths && option.imagePaths.length > 0;
                const imageUrl = hasImages ? option.imagePaths[0] : null;
                const favorited = isFavorited(option.id); // Check if package is favorited

                return (
                  <div key={option.id}>
                    <div
                      className="delivery-option"
                      onClick={() => setSelectedDelivery(option)}
                    >
                      {hasImages && !hasError ? (
                        <img
                          src={imageUrl}
                          onError={() => handleImageError(option.id, imageUrl)}
                          alt={option.name}
                          className="delivery-option-image"
                          onLoad={() =>
                            console.log(`Image loaded: ${imageUrl}`)
                          }
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          <img src={fallbackImage} alt="No image" />
                          <span>No Image</span>
                        </div>
                      )}

                      <div className="delivery-option-info">
                        <p className="delivery-option-name">{option.name}</p>
                        <p className="delivery-option-destination">
                          {option.destination}
                        </p>
                      </div>
                      <div className="delivery-price-container">
                        <p className="delivery-price">CHF {option.price}</p>
                        <div
                          className={`star-icon ${
                            favorited ? "favorited" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(option.id);
                          }}
                        >
                          {/* Use filled icon when favorited, outline when not */}
                          <img
                            src={favorited ? HeartFilledIcon : HeartIcon}
                            alt="Favorite"
                          />
                        </div>
                      </div>
                    </div>
                    {!isMobile && <hr className="deliveri-options-hr" />}
                  </div>
                );
              })
            ) : (
              <p className="no-packages-message">
                {searchTerm ? "No matching packages" : "No packages available"}
              </p>
            )}
          </div>
        </div>
      )}

      <button className="add-new-package-btn" onClick={handleAddPackageClick}>
        {user?.isProfileComplete
          ? "Add New Package"
          : "Complete Profile to Add Packages"}
      </button>
    </div>
  );
};

export default DeliveryOptions;
