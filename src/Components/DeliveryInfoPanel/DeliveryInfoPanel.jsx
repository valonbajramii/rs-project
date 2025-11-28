// import React, { useState, useEffect, useRef } from "react";
// import "./DeliveryInfoPanel.css";
// import { v4 as uuidv4 } from "uuid";
// import { packagesApi, transportApi } from "../../API/api";
// import fallbackImage from "../../icons/car-front-fill.svg";
// import chevronLeft from "../../images/chevron-left.svg";
// import locationIcon from "../../icons/Group 3.svg";
// import destinationIcon from "../../icons/Group 5.png";

// const DeliveryInfoPanel = ({
//   deliveryDetails,
//   user,
//   onClose,
//   setShowCompleteProfile,
//   setShowForm,
//   setIsAddPackageView,
//   setShowProfile,
// }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [packageOwner, setPackageOwner] = useState(null);
//   const [loadingOwner, setLoadingOwner] = useState(true);
//   const [imageErrors, setImageErrors] = useState({});
//   const [isMobile, setIsMobile] = useState(false);
//   const panelRef = useRef(null);

//   // FIXED: Use imagePaths directly as they already contain full URLs
//   const images = Array.isArray(deliveryDetails.imagePaths)
//     ? deliveryDetails.imagePaths
//     : [];

//   // Check if mobile on mount and resize
//   useEffect(() => {
//     const checkScreenSize = () => {
//       setIsMobile(window.innerWidth <= 768); // You can adjust this breakpoint
//     };

//     // Initial check
//     checkScreenSize();

//     // Add event listener
//     window.addEventListener("resize", checkScreenSize);

//     // Cleanup
//     return () => window.removeEventListener("resize", checkScreenSize);
//   }, []);

//   // Handle outside click for desktop
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         !isMobile &&
//         panelRef.current &&
//         !panelRef.current.contains(event.target)
//       ) {
//         onClose();
//       }
//     };

//     // Add event listener only for desktop
//     if (!isMobile) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isMobile, onClose]);

//   // Add debug logging
//   useEffect(() => {
//     console.log("DeliveryInfoPanel received:", deliveryDetails);
//     console.log("Creator info:", deliveryDetails.Creator);
//     console.log("Image paths:", images);
//   }, [deliveryDetails]);

//   // Fetch package owner information
//   useEffect(() => {
//     const fetchPackageOwner = async () => {
//       try {
//         setLoadingOwner(true);

//         // Check if the package already has creator info from backend
//         if (deliveryDetails.Creator) {
//           console.log(
//             "Using creator info from package:",
//             deliveryDetails.Creator
//           );
//           setPackageOwner({
//             id: deliveryDetails.Creator.Id || deliveryDetails.Creator.id,
//             fullName:
//               deliveryDetails.Creator.FullName ||
//               deliveryDetails.Creator.fullName,
//             email:
//               deliveryDetails.Creator.Email || deliveryDetails.Creator.email,
//             mobileNumber:
//               deliveryDetails.Creator.MobileNumber ||
//               deliveryDetails.Creator.mobileNumber,
//             phone:
//               deliveryDetails.Creator.MobileNumber ||
//               deliveryDetails.Creator.mobileNumber,
//           });
//           return;
//         }

//         // Fallback to old method if Creator doesn't exist
//         const creatorIdentifier =
//           deliveryDetails.userId || deliveryDetails.createdBy;

//         if (!creatorIdentifier) {
//           setPackageOwner({
//             name: "Unknown User",
//             email: "unknown@example.com",
//             phone: "Not available",
//             isPlaceholder: true,
//           });
//           return;
//         }

//         if (creatorIdentifier === user.id || creatorIdentifier === user.email) {
//           setPackageOwner(user);
//           return;
//         }

//         // Try API method to get user details
//         try {
//           const ownerData = await packagesApi.getUser(creatorIdentifier);
//           setPackageOwner(ownerData);
//         } catch (error) {
//           console.error("Error fetching owner:", error);
//           setPackageOwner({
//             name: "Unknown User",
//             email: creatorIdentifier.includes("@")
//               ? creatorIdentifier
//               : "unknown@example.com",
//             phone: "Not available",
//             isPlaceholder: true,
//           });
//         }
//       } catch (error) {
//         console.error("Error in fetchPackageOwner:", error);
//         setPackageOwner({
//           name: "Error loading owner",
//           email: deliveryDetails.createdBy || "Unknown",
//           phone: "Not available",
//           isPlaceholder: true,
//         });
//       } finally {
//         setLoadingOwner(false);
//       }
//     };

//     if (deliveryDetails) {
//       fetchPackageOwner();
//     }
//   }, [deliveryDetails, user]);

//   const handleThumbnailClick = (index) => {
//     setCurrentImageIndex(index);
//   };

//   const handlePrevClick = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const handleNextClick = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const handleImageError = (imageUrl, index) => {
//     console.error(`Failed to load image ${index}: ${imageUrl}`);
//     setImageErrors((prev) => ({ ...prev, [index]: true }));
//   };

//   const handleRequestDelivery = async () => {
//     // Check profile completeness FIRST, before making any API calls
//     if (!user?.isProfileComplete) {
//       // Redirect to complete profile (similar to your package addition flow)
//       setShowCompleteProfile(true);
//       setShowForm(false);
//       setIsAddPackageView(false);
//       setShowProfile(false);
//       onClose(); // Close the info panel
//       return; // Stop execution here
//     }

//     try {
//       const requestData = {
//         PackageId: deliveryDetails.id,
//         Message: `I would like to deliver your package: ${deliveryDetails.name}`,
//       };

//       console.log("Sending request data:", requestData);

//       const response = await transportApi.createRequest(requestData);
//       console.log("Request created:", response);

//       // Add to chat contacts when request is sent
//       if (packageOwner) {
//         const newContact = {
//           id: packageOwner.id,
//           email: packageOwner.email,
//           name: packageOwner.fullName || packageOwner.name,
//           profileImage: packageOwner.profileImage || null,
//         };

//         // Use user-specific storage
//         if (user?.id) {
//           const userContactsKey = `chatContacts_${user.id}`;
//           const storedContacts = JSON.parse(
//             localStorage.getItem(userContactsKey) || "[]"
//           );
//           const contactExists = storedContacts.some(
//             (c) => c.email === newContact.email
//           );

//           if (!contactExists) {
//             const updatedContacts = [...storedContacts, newContact];
//             localStorage.setItem(
//               userContactsKey,
//               JSON.stringify(updatedContacts)
//             );
//           }
//         }
//       }

//       alert("Delivery request sent successfully!");
//       onClose();
//     } catch (error) {
//       console.error("Failed to send request:", error);

//       // Show specific error messages
//       let errorMessage =
//         error.message || "Failed to send request. Please try again.";

//       if (error.response?.data) {
//         if (typeof error.response.data === "string") {
//           errorMessage = error.response.data;
//         } else if (error.response.data.message) {
//           errorMessage = error.response.data.message;
//         } else if (error.response.data.Title) {
//           errorMessage = error.response.data.Title;
//         }
//       }

//       alert(errorMessage);
//     }
//   };

//   const currentImage = images[currentImageIndex] || fallbackImage;

//   return (
//     <div className="delivery-info-panel-content" ref={panelRef}>
//       {/* Only show close button on mobile */}
//       {isMobile && (
//         <div className="backbutton-title-container">
//           <button className="panel-close-button" onClick={onClose}>
//             <img
//               src={chevronLeft}
//               className="chevron-left"
//               alt="Back"
//               onClick={onClose}
//             />
//             Back
//           </button>
//           <p className="package-title">PACKAGES</p>
//         </div>
//       )}

//       <div className="image-gallery">
//         <div className="main-image-container">
//           {images.length > 1 && (
//             <>
//               <button className="nav-button left" onClick={handlePrevClick}>
//                 &lt;
//               </button>
//               <button className="nav-button right" onClick={handleNextClick}>
//                 &gt;
//               </button>
//             </>
//           )}

//           <img
//             className="main-image"
//             src={currentImage}
//             alt="Delivery"
//             onError={() => handleImageError(currentImage, currentImageIndex)}
//             onLoad={() => console.log(`Main image loaded: ${currentImage}`)}
//           />

//           {images.length > 1 && (
//             <div className="mobile-indicator-dots">
//               {images.map((_, index) => (
//                 <span
//                   key={index}
//                   className={`dot ${
//                     index === currentImageIndex ? "active" : ""
//                   }`}
//                   onClick={() => handleThumbnailClick(index)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {images.length > 1 && (
//           <div className="thumbnail-images-container">
//             {images
//               .filter((_, index) => index !== currentImageIndex)
//               .map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`Thumbnail ${index}`}
//                   className="thumbnail-image"
//                   onClick={() => handleThumbnailClick(index)}
//                   onError={() => handleImageError(image, index)}
//                   onLoad={() => console.log(`Thumbnail loaded: ${image}`)}
//                 />
//               ))}
//           </div>
//         )}
//       </div>

//       <div className="package-info-section">
//         <h2 className="package-name">
//           {deliveryDetails.name || "Unnamed Package"}
//         </h2>
//         <p className="package-description">
//           {deliveryDetails.description || "No description available"}
//         </p>

//         <div className="price-section">
//           <span className="price-label">Delivery Price</span>
//           <span className="price-value">
//             {deliveryDetails.price || "0"} CHF
//           </span>
//         </div>

//         <div className="location-section">
//           <h3 className="section-heading">Location to Destination</h3>
//           <div className="location-dots">
//             <img className="location-dot" src={locationIcon} />
//             <span className="location-text">
//               {deliveryDetails.location || "Unknown location"}
//             </span>
//             <span className="location-arrow">⋯</span>
//             <img className="location-dot" src={destinationIcon} />
//             <span className="location-text">
//               {deliveryDetails.destination || "Unknown destination"}
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="dimensions-section">
//         <h3 className="section-heading">Dimensions</h3>
//         <div className="dimensions-container">
//           <div className="dimension-item">
//             <span className="dimension-label">Weight:</span>
//             <span className="dimension-value">
//               {deliveryDetails.weightinKg || "0"} Kg
//             </span>
//           </div>
//           <hr className="deliveryinfopanel-verticalhr" />
//           <div className="dimension-item">
//             <span className="dimension-label">Length:</span>
//             <span className="dimension-value">
//               {deliveryDetails.length || "0"} cm
//             </span>
//           </div>
//           <hr className="deliveryinfopanel-verticalhr" />
//           <div className="dimension-item">
//             <span className="dimension-label">Height:</span>
//             <span className="dimension-value">
//               {deliveryDetails.height || "0"} cm
//             </span>
//           </div>
//           <hr className="deliveryinfopanel-verticalhr" />
//           <div className="dimension-item">
//             <span className="dimension-label">Width:</span>
//             <span className="dimension-value">
//               {deliveryDetails.width || "0"} cm
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="owner-container">
//         <h3 className="section-heading-owner">Owner</h3>
//         <div className="owner-button-section">
//           {loadingOwner ? (
//             <div>Loading owner information...</div>
//           ) : packageOwner ? (
//             <>
//               <div className="owner-avatar">
//                 {packageOwner.profileImage ? (
//                   <img
//                     className="owner-avatar-img"
//                     src={packageOwner.profileImage}
//                     alt="Owner"
//                   />
//                 ) : (
//                   <div className="owner-initial">
//                     {packageOwner.fullName
//                       ? packageOwner.fullName.charAt(0).toUpperCase()
//                       : packageOwner.name
//                       ? packageOwner.name.charAt(0).toUpperCase()
//                       : packageOwner.email
//                       ? packageOwner.email.charAt(0).toUpperCase()
//                       : "U"}
//                   </div>
//                 )}
//               </div>
//               <div className="owner-info">
//                 <span className="owner-name">
//                   {packageOwner.fullName || packageOwner.name || "Unknown User"}
//                   {packageOwner.isPlaceholder && " (Information not available)"}
//                 </span>
//                 <span className="owner-phone">
//                   {packageOwner.mobileNumber ||
//                     packageOwner.phone ||
//                     "No phone number"}
//                 </span>
//               </div>
//             </>
//           ) : (
//             <div>Owner information not available</div>
//           )}

//           <div className="deliveryinfomdal-buttons-container">
//             {deliveryDetails.userId !== user.id && (
//               <button
//                 onClick={handleRequestDelivery}
//                 className="infomodal-request-button"
//               >
//                 Contact
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryInfoPanel;
import React, { useState, useEffect, useRef } from "react";
import "./DeliveryInfoPanel.css";
import { v4 as uuidv4 } from "uuid";
import { packagesApi, transportApi } from "../../API/api";
import fallbackImage from "../../icons/car-front-fill.svg";
import chevronLeft from "../../images/chevron-left.svg";
import locationIcon from "../../icons/Group 3.svg";
import destinationIcon from "../../icons/Group 5.png";

const DeliveryInfoPanel = ({
  deliveryDetails,
  user,
  onClose,
  setShowCompleteProfile,
  setShowForm,
  setIsAddPackageView,
  setShowProfile,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [packageOwner, setPackageOwner] = useState(null);
  const [loadingOwner, setLoadingOwner] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef(null);

  // Helper function to check if current user owns this package
  const isCurrentUserOwner = () => {
    if (!user || !deliveryDetails) return false;

    // Check all possible ID fields that might indicate ownership
    return (
      deliveryDetails.userId === user.id ||
      deliveryDetails.createdBy === user.id ||
      deliveryDetails.Creator?.id === user.id ||
      deliveryDetails.Creator?.Id === user.id
    );
  };

  // FIXED: Use imagePaths directly as they already contain full URLs
  const images = Array.isArray(deliveryDetails.imagePaths)
    ? deliveryDetails.imagePaths
    : [];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle outside click for desktop
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !isMobile &&
        panelRef.current &&
        !panelRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (!isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, onClose]);

  // Add debug logging
  useEffect(() => {
    console.log("DeliveryInfoPanel received:", deliveryDetails);
    console.log("Creator info:", deliveryDetails.Creator);
    console.log("Image paths:", images);
    console.log("Is current user owner?", isCurrentUserOwner());
  }, [deliveryDetails]);

  // Fetch package owner information
  useEffect(() => {
    const fetchPackageOwner = async () => {
      try {
        setLoadingOwner(true);

        // Check if the package already has creator info from backend
        if (deliveryDetails.Creator) {
          console.log(
            "Using creator info from package:",
            deliveryDetails.Creator
          );
          setPackageOwner({
            id: deliveryDetails.Creator.Id || deliveryDetails.Creator.id,
            fullName:
              deliveryDetails.Creator.FullName ||
              deliveryDetails.Creator.fullName,
            email:
              deliveryDetails.Creator.Email || deliveryDetails.Creator.email,
            mobileNumber:
              deliveryDetails.Creator.MobileNumber ||
              deliveryDetails.Creator.mobileNumber,
            phone:
              deliveryDetails.Creator.MobileNumber ||
              deliveryDetails.Creator.mobileNumber,
          });
          return;
        }

        // Fallback to old method if Creator doesn't exist
        const creatorIdentifier =
          deliveryDetails.userId || deliveryDetails.createdBy;

        if (!creatorIdentifier) {
          setPackageOwner({
            name: "Unknown User",
            email: "unknown@example.com",
            phone: "Not available",
            isPlaceholder: true,
          });
          return;
        }

        if (creatorIdentifier === user.id || creatorIdentifier === user.email) {
          setPackageOwner(user);
          return;
        }

        // Try API method to get user details
        try {
          const ownerData = await packagesApi.getUser(creatorIdentifier);
          setPackageOwner(ownerData);
        } catch (error) {
          console.error("Error fetching owner:", error);
          setPackageOwner({
            name: "Unknown User",
            email: creatorIdentifier.includes("@")
              ? creatorIdentifier
              : "unknown@example.com",
            phone: "Not available",
            isPlaceholder: true,
          });
        }
      } catch (error) {
        console.error("Error in fetchPackageOwner:", error);
        setPackageOwner({
          name: "Error loading owner",
          email: deliveryDetails.createdBy || "Unknown",
          phone: "Not available",
          isPlaceholder: true,
        });
      } finally {
        setLoadingOwner(false);
      }
    };

    if (deliveryDetails) {
      fetchPackageOwner();
    }
  }, [deliveryDetails, user]);

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageError = (imageUrl, index) => {
    console.error(`Failed to load image ${index}: ${imageUrl}`);
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleRequestDelivery = async () => {
    // Check profile completeness FIRST, before making any API calls
    if (!user?.isProfileComplete) {
      // Redirect to complete profile (similar to your package addition flow)
      setShowCompleteProfile(true);
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      onClose(); // Close the info panel
      return; // Stop execution here
    }

    try {
      const requestData = {
        PackageId: deliveryDetails.id,
        Message: `I would like to deliver your package: ${deliveryDetails.name}`,
      };

      console.log("Sending request data:", requestData);

      const response = await transportApi.createRequest(requestData);
      console.log("Request created:", response);

      // Add to chat contacts when request is sent
      if (packageOwner) {
        const newContact = {
          id: packageOwner.id,
          email: packageOwner.email,
          name: packageOwner.fullName || packageOwner.name,
          profileImage: packageOwner.profileImage || null,
        };

        // Use user-specific storage
        if (user?.id) {
          const userContactsKey = `chatContacts_${user.id}`;
          const storedContacts = JSON.parse(
            localStorage.getItem(userContactsKey) || "[]"
          );
          const contactExists = storedContacts.some(
            (c) => c.email === newContact.email
          );

          if (!contactExists) {
            const updatedContacts = [...storedContacts, newContact];
            localStorage.setItem(
              userContactsKey,
              JSON.stringify(updatedContacts)
            );
          }
        }
      }

      alert("Delivery request sent successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to send request:", error);

      // Show specific error messages
      let errorMessage =
        error.message || "Failed to send request. Please try again.";

      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.Title) {
          errorMessage = error.response.data.Title;
        }
      }

      alert(errorMessage);
    }
  };

  const currentImage = images[currentImageIndex] || fallbackImage;

  return (
    <div className="delivery-info-panel-content" ref={panelRef}>
      {/* Only show close button on mobile */}
      {isMobile && (
        <div className="backbutton-title-container">
          <button className="panel-close-button" onClick={onClose}>
            <img
              src={chevronLeft}
              className="chevron-left"
              alt="Back"
              onClick={onClose}
            />
            Back
          </button>
          <p className="package-title">PACKAGES</p>
        </div>
      )}

      <div className="image-gallery">
        <div className="main-image-container">
          {images.length > 1 && (
            <>
              <button className="nav-button left" onClick={handlePrevClick}>
                &lt;
              </button>
              <button className="nav-button right" onClick={handleNextClick}>
                &gt;
              </button>
            </>
          )}

          <img
            className="main-image"
            src={currentImage}
            alt="Delivery"
            onError={() => handleImageError(currentImage, currentImageIndex)}
            onLoad={() => console.log(`Main image loaded: ${currentImage}`)}
          />

          {images.length > 1 && (
            <div className="mobile-indicator-dots">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="thumbnail-images-container">
            {images
              .filter((_, index) => index !== currentImageIndex)
              .map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index}`}
                  className="thumbnail-image"
                  onClick={() => handleThumbnailClick(index)}
                  onError={() => handleImageError(image, index)}
                  onLoad={() => console.log(`Thumbnail loaded: ${image}`)}
                />
              ))}
          </div>
        )}
      </div>

      <div className="package-info-section">
        <h2 className="package-name">
          {deliveryDetails.name || "Unnamed Package"}
        </h2>
        <p className="package-description">
          {deliveryDetails.description || "No description available"}
        </p>

        <div className="price-section">
          <span className="price-label">Delivery Price</span>
          <span className="price-value">
            {deliveryDetails.price || "0"} CHF
          </span>
        </div>

        <div className="location-section">
          <h3 className="section-heading">Location to Destination</h3>
          <div className="location-dots">
            <img className="location-dot" src={locationIcon} />
            <span className="location-text">
              {deliveryDetails.location || "Unknown location"}
            </span>
            <span className="location-arrow">⋯</span>
            <img className="location-dot" src={destinationIcon} />
            <span className="location-text">
              {deliveryDetails.destination || "Unknown destination"}
            </span>
          </div>
        </div>
      </div>

      <div className="dimensions-section">
        <h3 className="section-heading">Dimensions</h3>
        <div className="dimensions-container">
          <div className="dimension-item">
            <span className="dimension-label">Weight:</span>
            <span className="dimension-value">
              {deliveryDetails.weightinKg || "0"} Kg
            </span>
          </div>
          <hr className="deliveryinfopanel-verticalhr" />
          <div className="dimension-item">
            <span className="dimension-label">Length:</span>
            <span className="dimension-value">
              {deliveryDetails.length || "0"} cm
            </span>
          </div>
          <hr className="deliveryinfopanel-verticalhr" />
          <div className="dimension-item">
            <span className="dimension-label">Height:</span>
            <span className="dimension-value">
              {deliveryDetails.height || "0"} cm
            </span>
          </div>
          <hr className="deliveryinfopanel-verticalhr" />
          <div className="dimension-item">
            <span className="dimension-label">Width:</span>
            <span className="dimension-value">
              {deliveryDetails.width || "0"} cm
            </span>
          </div>
        </div>
      </div>

      <div className="owner-container">
        <h3 className="section-heading-owner">Owner</h3>
        <div className="owner-button-section">
          {loadingOwner ? (
            <div>Loading owner information...</div>
          ) : packageOwner ? (
            <>
              <div className="owner-avatar">
                {packageOwner.profileImage ? (
                  <img
                    className="owner-avatar-img"
                    src={packageOwner.profileImage}
                    alt="Owner"
                  />
                ) : (
                  <div className="owner-initial">
                    {packageOwner.fullName
                      ? packageOwner.fullName.charAt(0).toUpperCase()
                      : packageOwner.name
                      ? packageOwner.name.charAt(0).toUpperCase()
                      : packageOwner.email
                      ? packageOwner.email.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>
              <div className="owner-info">
                <span className="owner-name">
                  {packageOwner.fullName || packageOwner.name || "Unknown User"}
                  {packageOwner.isPlaceholder && " (Information not available)"}
                </span>
                <span className="owner-phone">
                  {packageOwner.mobileNumber ||
                    packageOwner.phone ||
                    "No phone number"}
                </span>
              </div>
            </>
          ) : (
            <div>Owner information not available</div>
          )}

          <div className="deliveryinfomdal-buttons-container">
            {/* ONLY show contact button if current user is NOT the owner */}
            {!isCurrentUserOwner() && (
              <button
                onClick={handleRequestDelivery}
                className="infomodal-request-button"
              >
                Contact
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfoPanel;
