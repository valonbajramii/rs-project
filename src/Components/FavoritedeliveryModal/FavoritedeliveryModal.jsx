import React from "react";
import "./FavoritedeliveryModal.css";

const FavoritedeliveryModal = ({ favorites, deliveryOptions, onClose }) => {
  // Filter the delivery options to only show favorites
  const favoriteDeliveries = deliveryOptions.filter((delivery) =>
    favorites.includes(delivery.id)
  );

  return (
    <div className="favorite-delivery-modal">
      <div className="favorite-delivery-content">
        <button onClick={onClose}>Close</button>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Favorite Deliveries</h2>
        {favoriteDeliveries.length === 0 ? (
          <p>No favorite deliveries yet.</p>
        ) : (
          <div>
            {favoriteDeliveries.map((delivery, index) => (
              <div key={index} className="favorite-delivery-item">
                <img
                  src={
                    Array.isArray(delivery.images) && delivery.images.length > 0
                      ? delivery.images[0]
                      : "default-image-path.jpg"
                  }
                  alt="Delivery"
                />
                <div>
                  <p>{delivery.name}</p>
                  <p>{delivery.destination}</p>
                  <p className="price">Price: {delivery.price}.- CHF</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritedeliveryModal;
