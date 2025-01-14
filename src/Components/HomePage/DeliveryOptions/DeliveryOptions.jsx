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

import React, { useState, useEffect } from "react";
import "./DeliveryOptions.css";
import DeliveryInfoModal from "../../DeliveryInfoModal/DeliveryInfoModal";
import HeartIcon from "../../../icons/Heart-icon.svg";
import Delivery from "../../Delivery/Delivery";
import { v4 as uuidv4 } from "uuid";
import audiImage from "../../../images/2025_audi_q7_4dr-suv_prestige_fq_oem_1_1600.avif";

const DeliveryOptions = ({
  deliveryOptions,
  user,
  toggleFavorite,
  favorites = [],
}) => {
  const initializeDeliveries = () => {
    const storedDeliveries = localStorage.getItem("deliveries");
    let deliveries = storedDeliveries
      ? JSON.parse(storedDeliveries)
      : [
          {
            id: uuidv4(),
            name: "Car",
            image: audiImage,
            price: "100",
            location: "Kamenic",
            destination: "Prishtin",
            description: "Description",
            weightinKg: "20",
            length: "50cm",
            height: "50cm",
            width: "50cm",
            pickupTim: "2024-08-28T17:00",
            deadline: "08-09 T12:55",
            createdBy: user.email,
            requests: [],
          },
        ];

    deliveries = deliveries.map((delivery) => {
      if (!delivery.createdBy) {
        return { ...delivery, createdBy: user.email, id: uuidv4() };
      }
      return delivery;
    });

    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    return deliveries;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveryOptionss, setDeliveryOptionss] =
    useState(initializeDeliveries);

  useEffect(() => {
    localStorage.setItem("deliveries", JSON.stringify(deliveryOptionss));
  }, [deliveryOptionss]);

  useEffect(() => {
    const storedDeliveries = localStorage.getItem("deliveries");
    if (storedDeliveries) {
      const deliveries = JSON.parse(storedDeliveries).map((delivery) => ({
        ...delivery,
        requests: Array.isArray(delivery.requests) ? delivery.requests : [],
      }));
      setDeliveryOptionss(deliveries);
    }
  }, []);

  const handleIconClick = (option) => {
    setSelectedDelivery(option);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDelivery(null);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const addNewDelivery = (newDelivery) => {
    const deliveryWithUser = {
      ...newDelivery,
      createdBy: user.email,
      id: uuidv4(),
    };
    const updatedDeliveryOptions = [...deliveryOptionss, deliveryWithUser];
    setDeliveryOptionss(updatedDeliveryOptions); // Update state
    localStorage.setItem("deliveries", JSON.stringify(updatedDeliveryOptions)); // Sync with local storage
  };

  const isFavorite = (deliveryId) => {
    return favorites.includes(deliveryId);
  };

  return (
    <div className="delivery-option-container">
      <h2 className="deliver-option-h2">Welcome User</h2>
      <input className="delivery-option-input" placeholder="Search by City" />
      <div className="scrollable-container">
        <div className="dlivery-option-menu">
          {deliveryOptionss.map(
            (
              option,
              index // Use updated state
            ) => (
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
            )
          )}
        </div>
      </div>
      <button className="add-new-package-btn" onClick={toggleModal}>
        Add New Package
      </button>

      {showModal && selectedDelivery && (
        <DeliveryInfoModal
          show={showModal}
          onClose={closeModal}
          deliveryDetails={selectedDelivery}
          user={user}
        />
      )}
      {isModalOpen && (
        <Delivery
          onClose={toggleModal}
          addNewDelivery={(delivery) => addNewDelivery({ ...delivery })}
        />
      )}
    </div>
  );
};

export default DeliveryOptions;
