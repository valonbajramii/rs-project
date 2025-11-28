// import React from "react";
// import "./FavoritePackageView.css";
// import HeartIcon from "../../../icons/Heart-icon.svg";
// import heartShapeIcon from "../../../icons/HeartShape.svg";
// import fallbackImage from "../../../icons/car-front-fill.svg";

// const FavoritePackageView = ({
//   favorites,
//   deliveryOptions,
//   user,
//   toggleFavorite,
//   onBack,
//   setSelectedDelivery,
// }) => {
//   // Filter the delivery options to only show favorites
//   const favoritePackages = deliveryOptions.filter((delivery) =>
//     favorites.includes(delivery.id)
//   );

//   const handleImageError = (optionId, imageUrl) => {
//     console.error(`Failed to load image for package ${optionId}: ${imageUrl}`);
//   };

//   return (
//     <div className="favorite-package-container">
//       <div className="favorite-package-header">
//         <button className="back-button" onClick={onBack}>
//           ← Back
//         </button>
//         <h2 className="favorite-package-title">Favorite Packages</h2>
//       </div>

//       <div className="scrollable-container">
//         <div className="favorite-package-menu">
//           {favoritePackages.length === 0 ? (
//             <div className="no-favorites-message">
//               <p>No favorite packages yet.</p>
//               <p>
//                 Start adding favorites by clicking the heart icon on packages!
//               </p>
//             </div>
//           ) : (
//             favoritePackages.map((delivery) => {
//               const hasImages =
//                 delivery.imagePaths && delivery.imagePaths.length > 0;
//               const imageUrl = hasImages ? delivery.imagePaths[0] : null;

//               return (
//                 <div key={delivery.id}>
//                   <div
//                     className="favorite-package-option"
//                     onClick={() => setSelectedDelivery(delivery)}
//                   >
//                     {hasImages ? (
//                       <img
//                         src={imageUrl}
//                         onError={() => handleImageError(delivery.id, imageUrl)}
//                         alt={delivery.name}
//                         className="favorite-package-image"
//                       />
//                     ) : (
//                       <div className="no-image-placeholder">
//                         <img src={fallbackImage} alt="No image" />
//                         <span>No Image</span>
//                       </div>
//                     )}

//                     <div className="favorite-package-info">
//                       <p className="favorite-package-name">{delivery.name}</p>
//                       <p className="favorite-package-destination">
//                         {delivery.destination}
//                       </p>
//                     </div>
//                     <div className="favorite-package-price-container">
//                       <p className="favorite-package-price">
//                         CHF {delivery.price}
//                       </p>
//                       <div
//                         className="favorite-star-icon"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleFavorite(delivery.id);
//                         }}
//                       >
//                         <img
//                           src={heartShapeIcon}
//                           alt="Remove Favorite"
//                           className="favorite-icon-active"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <hr className="favorite-package-hr" />
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FavoritePackageView;

import React from "react";
import "./FavoritePackageView.css";
import HeartIcon from "../../../icons/Heart-icon.svg"; // Add this import
import heartShapeIcon from "../../../icons/HeartShape.svg";
import fallbackImage from "../../../icons/car-front-fill.svg";

const FavoritePackageView = ({
  favorites,
  deliveryOptions,
  user,
  toggleFavorite,
  onBack,
  setSelectedDelivery,
}) => {
  // Filter the delivery options to only show favorites
  const favoritePackages = deliveryOptions.filter((delivery) =>
    favorites.includes(delivery.id)
  );

  const handleImageError = (optionId, imageUrl) => {
    console.error(`Failed to load image for package ${optionId}: ${imageUrl}`);
  };

  // Check if a package is favorited (should always be true here, but for consistency)
  const isFavorited = (packageId) => {
    return favorites.includes(packageId);
  };

  return (
    <div className="favorite-package-container">
      <div className="favorite-package-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2 className="favorite-package-title">Favorite Packages</h2>
      </div>

      <div className="scrollable-container">
        <div className="favorite-package-menu">
          {favoritePackages.length === 0 ? (
            <div className="no-favorites-message">
              <p>No favorite packages yet.</p>
              <p>
                Start adding favorites by clicking the heart icon on packages!
              </p>
            </div>
          ) : (
            favoritePackages.map((delivery) => {
              const hasImages =
                delivery.imagePaths && delivery.imagePaths.length > 0;
              const imageUrl = hasImages ? delivery.imagePaths[0] : null;
              const favorited = isFavorited(delivery.id);

              return (
                <div key={delivery.id}>
                  <div
                    className="favorite-package-option"
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    {hasImages ? (
                      <img
                        src={imageUrl}
                        onError={() => handleImageError(delivery.id, imageUrl)}
                        alt={delivery.name}
                        className="favorite-package-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <img src={fallbackImage} alt="No image" />
                        <span>No Image</span>
                      </div>
                    )}

                    <div className="favorite-package-info">
                      <p className="favorite-package-name">{delivery.name}</p>
                      <p className="favorite-package-destination">
                        {delivery.destination}
                      </p>
                    </div>
                    <div className="favorite-package-price-container">
                      <p className="favorite-package-price">
                        CHF {delivery.price}
                      </p>
                      <div
                        className={`favorite-star-icon ${
                          favorited ? "favorited" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(delivery.id);
                        }}
                      >
                        {/* Use the same heart icon logic as DeliveryOptions */}
                        <img
                          src={favorited ? heartShapeIcon : HeartIcon}
                          alt={favorited ? "Remove Favorite" : "Add Favorite"}
                          className="favorite-icon-active"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="favorite-package-hr" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritePackageView;
