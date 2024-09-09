// import React from "react";
// import "./MyProductModal.css";

// const MyProductModal = ({ onClose }) => {
//   return (
//     <div className="myproductmodal-container">
//       <div className="myproductmodal-content">
//         <button onClick={onClose}>x</button>
//         <p>hello</p>
//       </div>
//     </div>
//   );
// };

// export default MyProductModal;

// import React, { useState, useEffect } from "react";
// import "./MyProductModal.css";

// const MyProductModal = ({ onClose, user, deleteDelivery }) => {
//   const [userDeliveries, setUserDeliveries] = useState([]);

//   useEffect(() => {
//     const storedDeliveries =
//       JSON.parse(localStorage.getItem("deliveries")) || [];
//     const userDeliveries = storedDeliveries.filter(
//       (delivery) => delivery.createdBy === user.email
//     );
//     setUserDeliveries(userDeliveries);
//   }, [user.email]);

//   const handleDelete = (deliveryToDelete) => {
//     deleteDelivery(deliveryToDelete); // Call deleteDelivery with specific delivery
//     // Remove the deleted delivery from the local state using id
//     setUserDeliveries((prevDeliveries) =>
//       prevDeliveries.filter(
//         (delivery) => delivery.id !== deliveryToDelete.id // Use id for comparison
//       )
//     );
//   };

//   return (
//     <div className="myproductmodal-container">
//       <div className="myproductmodal-content">
//         <button onClick={onClose}>x</button>
//         <h2 className="modal-h2">My Deliveries</h2>
//         <hr />
//         {userDeliveries.length === 0 ? (
//           <p>No deliveries added by you.</p>
//         ) : (
//           userDeliveries.map((delivery, index) => (
//             <div key={index} className="delivery-option">
//               <div className="delivery-option2">
//                 <img
//                   className="car-icon"
//                   src={delivery.image}
//                   alt="Delivery Icon"
//                 />
//                 <div className="delivery-options-info">
//                   <p>{delivery.name}</p>
//                   <p>{delivery.destination}</p>
//                   <p>Price: {delivery.price}.- CHF</p>
//                 </div>
//                 <div className="myproductmodal-buttons">
//                   <button className="myproductmodal-edit-button">Edit</button>
//                   <button
//                     onClick={() => handleDelete(delivery)}
//                     className="myproductmodal-delete-button"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//               <hr />
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyProductModal;

import React, { useState, useEffect } from "react";
import "./MyProductModal.css";
import DeliveryEditModal from "../../DeliveryEditModal/DeliveryEditModal";

const MyProductModal = ({ onClose, user, deleteDelivery, editDelivery }) => {
  const [userDeliveries, setUserDeliveries] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deliveryToEdit, setDeliveryToEdit] = useState(null);

  useEffect(() => {
    const storedDeliveries =
      JSON.parse(localStorage.getItem("deliveries")) || [];
    const userDeliveries = storedDeliveries.filter(
      (delivery) => delivery.createdBy === user.email
    );
    setUserDeliveries(userDeliveries);
  }, [user.email]);

  const handleDelete = (deliveryToDelete) => {
    deleteDelivery(deliveryToDelete);
    setUserDeliveries((prevDeliveries) =>
      prevDeliveries.filter((delivery) => delivery.id !== deliveryToDelete.id)
    );
  };

  const handleEdit = (delivery) => {
    setDeliveryToEdit(delivery);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedDelivery) => {
    // Update only the current user's deliveries in state
    const updatedDeliveries = userDeliveries.map((delivery) =>
      delivery.id === updatedDelivery.id ? updatedDelivery : delivery
    );
    setUserDeliveries(updatedDeliveries);

    // Retrieve full deliveries list from localStorage
    const allDeliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    // Update the specific delivery in the full list
    const updatedAllDeliveries = allDeliveries.map((delivery) =>
      delivery.id === updatedDelivery.id ? updatedDelivery : delivery
    );

    // Save updated full deliveries list to localStorage
    localStorage.setItem("deliveries", JSON.stringify(updatedAllDeliveries));

    // Call the global edit handler to update deliveryOptions
    editDelivery(updatedDelivery); // This is the missing line

    setIsEditModalOpen(false);
  };

  return (
    <div className="myproductmodal-container">
      <div className="myproductmodal-content">
        <button onClick={onClose}>x</button>
        <h2 className="modal-h2">My Deliveries</h2>
        <hr />
        {userDeliveries.length === 0 ? (
          <p>No deliveries added by you.</p>
        ) : (
          userDeliveries.map((delivery, index) => (
            <div key={index} className="delivery-option">
              <div className="delivery-option2">
                <img
                  className="car-icon"
                  src={
                    Array.isArray(delivery.images) && delivery.images.length > 0
                      ? delivery.images[0]
                      : "default-image-path.jpg"
                  }
                  alt="Delivery Icon"
                />
                <div className="delivery-options-info">
                  <p>{delivery.name}</p>
                  <p>{delivery.destination}</p>
                  <p>Price: {delivery.price}.- CHF</p>
                </div>
                <div className="myproductmodal-buttons">
                  <button
                    onClick={() => handleEdit(delivery)}
                    className="myproductmodal-edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(delivery)}
                    className="myproductmodal-delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
      {isEditModalOpen && (
        <DeliveryEditModal
          delivery={deliveryToEdit}
          onSave={handleSaveEdit}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyProductModal;
