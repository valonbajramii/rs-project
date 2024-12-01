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

import React, { useState } from "react";
import "./DeliveryOptions.css";
import DeliveryInfoModal from "../../DeliveryInfoModal/DeliveryInfoModal";
import HeartIcon from "../../../icons/Heart-icon.svg";

const DeliveryOptions = ({
  deliveryOptions,
  user,
  toggleFavorite,
  favorites = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Handle opening the modal when a delivery is clicked
  const handleIconClick = (option) => {
    setSelectedDelivery(option); // Set the clicked delivery as selected
    setShowModal(true); // Show the modal
  };

  // Handle closing the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedDelivery(null); // Clear the selected delivery
  };

  // Check if a delivery is in the favorites list
  const isFavorite = (deliveryId) => {
    return favorites.includes(deliveryId);
  };

  return (
    <div className="delivery-option-container">
      <h2 className="deliver-option-h2">Welcome User</h2>
      <input className="delivery-option-input" placeholder="Search by City" />
      <div className="scrollable-container">
        <div className="dlivery-option-menu">
          {deliveryOptions.map((option, index) => (
            <div key={index} onClick={() => handleIconClick(option)}>
              <div className="delivery-option">
                <img
                  className="car-icon"
                  src={
                    Array.isArray(option.images) && option.images.length > 0
                      ? option.images[0]
                      : "default-image-path.jpg"
                  }
                  alt="Delivery Icon"
                  onClick={() => handleIconClick(option)}
                />
                <div className="delivery-option-info">
                  <p className="delivery-option-name">{option.name}</p>
                  <p className="delivery-option-destination">
                    {option.destination}
                  </p>
                  <p className="delivery-option-deadline">
                    Deadline: {option.deadline}
                  </p>
                </div>
                <div className="delivery-price-container">
                  <p className="delivery-price">CHF-{option.price}</p>
                  <div
                    className="star-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(option.id);
                    }}
                  >
                    <img src={HeartIcon} />
                  </div>
                </div>
              </div>
              <hr className="deliveri-options-hr" />
            </div>
          ))}
        </div>
      </div>
      <button className="add-new-package-btn">Add New Package</button>

      {/* Delivery Info Modal */}
      {showModal && selectedDelivery && (
        <DeliveryInfoModal
          show={showModal}
          onClose={closeModal}
          deliveryDetails={selectedDelivery}
          user={user}
        />
      )}
    </div>
  );
};

export default DeliveryOptions;
