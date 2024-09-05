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

import React, { useState, useEffect } from "react";
import "./MyProductModal.css";

const MyProductModal = ({ onClose, user, deleteDelivery }) => {
  const [userDeliveries, setUserDeliveries] = useState([]);

  useEffect(() => {
    const storedDeliveries =
      JSON.parse(localStorage.getItem("deliveries")) || [];
    const userDeliveries = storedDeliveries.filter(
      (delivery) => delivery.createdBy === user.email
    );
    setUserDeliveries(userDeliveries);
  }, [user.email]);

  const handleDelete = (deliveryToDelete) => {
    deleteDelivery(deliveryToDelete); // Call deleteDelivery with specific delivery
    // Remove the deleted delivery from the local state using id
    setUserDeliveries((prevDeliveries) =>
      prevDeliveries.filter(
        (delivery) => delivery.id !== deliveryToDelete.id // Use id for comparison
      )
    );
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
                  src={delivery.image}
                  alt="Delivery Icon"
                />
                <div className="delivery-options-info">
                  <p>{delivery.name}</p>
                  <p>{delivery.destination}</p>
                  <p>Price: {delivery.price}.- CHF</p>
                </div>
                <button
                  onClick={() => handleDelete(delivery)}
                  className="myproductmodal-delete-button"
                >
                  Delete
                </button>
              </div>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyProductModal;
