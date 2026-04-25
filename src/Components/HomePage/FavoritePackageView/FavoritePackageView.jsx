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

import React, { useState } from "react";
import "./FavoritePackageView.css";
import HeartIcon from "../../../icons/Heart-icon.svg";
import heartShapeIcon from "../../../icons/HeartShape.svg";
import fallbackImage from "../../../icons/car-front-fill.svg";

// Mock status data — replace with real API call per package
const getMockStatus = (deliveryId) => ({
  trackingNumber: `#HWDSF${deliveryId}76DS`,
  status: "On the way",
  date: "24 June",
  from: "My Location",
  to: "User Name",
  progress: 0.6, // 0 to 1
});

const PackageStatusRow = ({ delivery }) => {
  const status = getMockStatus(delivery.id);
  const progressPercent = status.progress * 100;

  return (
    <div className="status-row">
      <div className="status-row-top">
        <div className="status-icon-box">
          {/* Box icon SVG inline */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect
              x="2"
              y="7"
              width="20"
              height="14"
              rx="2"
              stroke="#3673e4"
              strokeWidth="1.8"
            />
            <path
              d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
              stroke="#3673e4"
              strokeWidth="1.8"
            />
            <line
              x1="12"
              y1="12"
              x2="12"
              y2="17"
              stroke="#3673e4"
              strokeWidth="1.8"
            />
            <line
              x1="9.5"
              y1="14.5"
              x2="14.5"
              y2="14.5"
              stroke="#3673e4"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <div className="status-text">
          <span className="status-tracking">{status.trackingNumber}</span>
          <span className="status-subtitle">
            {status.status} &nbsp;•&nbsp; {status.date}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="status-progress-container">
        <div className="status-progress-track">
          {/* Filled part */}
          <div
            className="status-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Origin dot */}
          <div className="status-dot origin-dot">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6" fill="#3673e4" />
              <circle cx="7" cy="7" r="3" fill="white" />
            </svg>
          </div>
          {/* Destination dot */}
          <div className="status-dot dest-dot">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle
                cx="7"
                cy="7"
                r="6"
                fill="white"
                stroke="#3673e4"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
        <div className="status-labels">
          <span className="status-label-from">
            <span className="label-title">From</span>
            <span className="label-value">{status.from}</span>
          </span>
          <span className="status-label-to">
            <span className="label-title">To</span>
            <span className="label-value">{status.to}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const FavoritePackageView = ({
  favorites,
  deliveryOptions,
  user,
  toggleFavorite,
  onBack,
  setSelectedDelivery,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const favoritePackages = deliveryOptions.filter((delivery) =>
    favorites.includes(delivery.id),
  );

  const isFavorited = (packageId) => favorites.includes(packageId);

  const toggleStatus = (e, id) => {
    e.stopPropagation();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="favorite-package-container">
      <div className="favorite-package-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h2 className="favorite-package-title">Favorite Packages</h2>
      </div>

      {favoritePackages.length > 0 && (
        <p className="favorite-section-label">Packages</p>
      )}

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
              const isExpanded = expandedId === delivery.id;

              return (
                <div key={delivery.id} className="favorite-item-wrapper">
                  <div
                    className="favorite-package-option"
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    {/* Image */}
                    {hasImages ? (
                      <img
                        src={imageUrl}
                        onError={() => {}}
                        alt={delivery.name}
                        className="favorite-package-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <img src={fallbackImage} alt="No image" />
                        <span>No Image</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="favorite-package-info">
                      <p className="favorite-package-name">{delivery.name}</p>
                      <p className="favorite-package-destination">
                        Lorem ipsum dolor sit amet
                      </p>

                      {/* Check Status toggle */}
                      <button
                        className="check-status-btn"
                        onClick={(e) => toggleStatus(e, delivery.id)}
                      >
                        Check Status
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          className={`status-chevron ${isExpanded ? "open" : ""}`}
                        >
                          <path
                            d="M2 4l4 4 4-4"
                            stroke="#3673e4"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Heart */}
                    <div className="favorite-package-price-container">
                      <p className="favorite-package-price">
                        CHF {delivery.price}
                      </p>
                      <div
                        className={`favorite-star-icon ${favorited ? "favorited" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(delivery.id);
                        }}
                      >
                        <img
                          src={favorited ? heartShapeIcon : HeartIcon}
                          alt={favorited ? "Remove Favorite" : "Add Favorite"}
                          className="favorite-icon-active"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expandable status row */}
                  <div
                    className={`status-expand-area ${isExpanded ? "open" : ""}`}
                  >
                    <PackageStatusRow delivery={delivery} />
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
