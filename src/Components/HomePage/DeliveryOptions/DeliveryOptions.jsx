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
import HeartIcon from "../../../icons/Heart-icon.svg";
import { v4 as uuidv4 } from "uuid";
import audiImage from "../../../images/2025_audi_q7_4dr-suv_prestige_fq_oem_1_1600.avif";
import { packagesApi } from "../../../API/api";
import { useNavigate } from "react-router-dom";

const DeliveryOptions = ({
  user,
  toggleFavorite,
  favorites = [],
  setIsAddPackageView,
  setShowForm,
  setShowProfile,
  setSelectedDelivery,
}) => {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await packagesApi.getPackages();

        let packagesArray = [];
        if (Array.isArray(response)) {
          packagesArray = response;
        } else if (response?.$values && Array.isArray(response.$values)) {
          packagesArray = response.$values;
        }

        const transformedPackages = packagesArray.map((pkg) => ({
          id: pkg.id || pkg.Id,
          name: pkg.name || pkg.Name,
          images: pkg.images || pkg.Images || [],
          price: pkg.price?.toString() || pkg.Price?.toString() || "0",
          location: pkg.location || pkg.Location,
          destination: pkg.destination || pkg.Destination,
          description: pkg.description || pkg.Description,
          weightinKg: pkg.weight || pkg.weightinKg || pkg.Weight,
          deadline: pkg.deadline || pkg.Deadline,
          createdBy: pkg.createdBy || pkg.CreatedBy,
        }));

        setDeliveryOptions(transformedPackages);
      } catch (err) {
        setError(err.message || "Failed to load packages");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleAddPackageClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user.isProfileComplete) {
      alert("Please complete your profile before adding packages");
      navigate("/complete-profile");
      return;
    }
    setShowForm(true);
    setIsAddPackageView(true);
  };

  const filteredOptions = deliveryOptions.filter((option) => {
    // Add null checks and provide empty string as fallback
    const location = option.location || "";
    const destination = option.destination || "";

    return (
      location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="delivery-option-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="delivery-option-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="delivery-option-container">
      <h2 className="deliver-option-h2">Welcome {user?.fullName || "User"}</h2>
      <input
        className="delivery-option-input"
        placeholder="Search by City"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="scrollable-container">
        <div className="dlivery-option-menu">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div key={option.id} onClick={() => setSelectedDelivery(option)}>
                <div className="delivery-option">
                  <img
                    className="car-icon"
                    src={option.images[0] || "https://via.placeholder.com/150"}
                    alt={option.name}
                  />
                  <div className="delivery-option-info">
                    <p className="delivery-option-name">{option.name}</p>
                    <p className="delivery-option-destination">
                      {option.destination}
                    </p>
                  </div>
                  <div className="delivery-price-container">
                    <p className="delivery-price">CHF {option.price}</p>
                    <div
                      className="star-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(option.id);
                      }}
                    >
                      <img src={HeartIcon} alt="Favorite" />
                    </div>
                  </div>
                </div>
                <hr className="deliveri-options-hr" />
              </div>
            ))
          ) : (
            <p className="no-packages-message">
              {searchTerm ? "No matching packages" : "No packages available"}
            </p>
          )}
        </div>
      </div>

      <button className="add-new-package-btn" onClick={handleAddPackageClick}>
        {user?.isProfileComplete
          ? "Add New Package"
          : "Complete Profile to Add Packages"}
      </button>
    </div>
  );
};

export default DeliveryOptions;
