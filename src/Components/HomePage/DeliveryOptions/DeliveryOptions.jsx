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
                src={
                  Array.isArray(option.images) && option.images.length > 0
                    ? option.images[0]
                    : "default-image-path.jpg"
                }
                alt="Delivery Icon"
                onClick={() => handleIconClick(option)}
              />
              <div className="delivery-options-info">
                <p>{option.name}</p>
                <p>{option.destination}</p>
                <p>Deadline: {option.deadline}</p>
              </div>
              <div>
                <p className="deliver-price">{option.price}.- CHF</p>
              </div>
              <div
                className="star-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(option.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="20"
                  fill={isFavorite(option.id) ? "gold" : "gray"}
                  className="bi bi-star-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.396.198-.824-.149-.746-.592l.83-4.73-3.522-3.356c-.33-.31-.158-.888.283-.95l4.898-.696 2.058-4.27c.197-.408.73-.408.927 0l2.058 4.27 4.898.696c.441.062.613.64.283.95l-3.522 3.356.83 4.73c.078.443-.35.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>

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
