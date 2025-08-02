// import React, { useState, useEffect } from "react";
// import "./Profile.css";
// import PersonFill from "../../icons/person-fill.svg";
// import ShieldFill from "../../icons/shield-fill.svg";
// import KeyFill from "../../icons/key-fill.svg";
// import GearFill from "../../icons/gear-fill.svg";
// import LogoutIcon from "../../icons/box-arrow-left.svg";
// import GeoaltIcon from "../../icons/geo-alt.svg";
// import PersonalInfoModal from "../../Components/PersonalInfoModal/PersonalInfoModal";
// import RequestsModal from "../../Components/RequestsModal/RequestsModal";
// import { useNavigate } from "react-router-dom";
// import chevronLeft from "../../images/chevron-left.svg";
// import cameraIcon from "../../icons/camera-fill.svg";
// import paperReplice from "../../icons/paperclip.svg";

// const Profile = ({ user, setUser }) => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   // const [isRequestsModalVisible, setRequestsModalVisible] = useState(false);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   // const [requests, setRequests] = useState([]);
//   const [profileData, setProfileData] = useState({
//     mobileNumber: user.mobileNumber || "",
//     address: user.address || "",
//     city: user.city || "",
//     state: user.state || "",
//     zip: user.zip || "",
//     dateOfBirth: user.dateOfBirth || "",
//     idDocument: user.idDocument || null,
//     drivingLicense: user.drivingLicense || null,
//   });

//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   // Load requests from localStorage on component mount
//   //   const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
//   //   const userRequests = storedRequests.filter(
//   //     (request) => request.deliveryOwnerEmail === user.email
//   //   );
//   //   setRequests(userRequests);
//   // }, [user.email]);

//   const handleHomePageClick = () => {
//     navigate("/homepage");
//   };

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   // const openRequestsModal = () => {
//   //   setRequestsModalVisible(true);
//   // };

//   // const closeRequestsModal = () => {
//   //   setRequestsModalVisible(false);
//   // };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUploadedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageDelete = () => {
//     setUploadedImage(null); // Clear local state
//     // Optional: Also clear the user's profileImage in global state
//     setUser({ ...user, profileImage: null });
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   // const handleApproveRequest = (index) => {
//   //   const updatedRequests = [...requests];
//   //   updatedRequests[index].isApproved = true;
//   //   setRequests(updatedRequests);
//   //   localStorage.setItem("requests", JSON.stringify(updatedRequests));
//   // };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileUpload = (e, fieldName) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileData((prev) => ({
//         ...prev,
//         [fieldName]: file,
//       }));
//     }
//   };

//   const handleConfirm = () => {
//     const updatedUser = {
//       ...user,
//       ...profileData,
//       profileImage: uploadedImage || user.profileImage,
//     };

//     setUser(updatedUser);
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     alert("Profile updated successfully!");
//   };

//   return (
//     <div className="profile-main-container">
//       {/* <div className="profile-backbutton-container">
//         <button onClick={handleHomePageClick} className="back-button">
//           Back
//         </button>
//       </div> */}
//       <div className="profile-container">
//         <div className="profile-back-icon">
//           <img
//             src={chevronLeft}
//             onClick={handleHomePageClick}
//             className="profile-chevron-left"
//             alt="Back"
//           />
//           <h2 className="profile-h2">Account</h2>
//         </div>
//         <div className="profile-content-container">
//           <div className="profile-photo-container">
//             {!uploadedImage && !user.profileImage && (
//               <>
//                 <input
//                   type="file"
//                   id="file-input"
//                   onChange={handleImageUpload}
//                   style={{ display: "none" }}
//                 />
//                 <label htmlFor="file-input" className="profile-photo-empty">
//                   <img className="camera-icon" src={cameraIcon} />
//                 </label>
//               </>
//             )}
//             {(uploadedImage || user.profileImage) && (
//               <div className="uploaded-image-container">
//                 <img
//                   className="profile-photo"
//                   src={uploadedImage || user.profileImage}
//                   alt="Profile"
//                 />
//                 <button
//                   className="profile-delete-button"
//                   onClick={(e) => {
//                     e.stopPropagation(); // Prevents parent onClick from firing
//                     handleImageDelete();
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>
//             )}
//           </div>
//           <div>
//             <div className="profile-welcome-label">
//               {!uploadedImage && !user.profileImage ? (
//                 <label htmlFor="file-input" className="profile-upload-label">
//                   Upload Cover Photo
//                 </label>
//               ) : (
//                 <label className="welcome-label">Welcome, {user.name}!</label>
//               )}
//             </div>
//           </div>
//           <div className="text-info">
//             <input
//               className="profile-input"
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={user.name}
//               readOnly
//             />
//             <input
//               className="profile-input"
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={user.email}
//               readOnly
//             />
//             <input
//               className="profile-input"
//               type="date"
//               name="dateOfBirth"
//               placeholder="Date of Birth"
//               value={profileData.dateOfBirth}
//               onChange={handleInputChange}
//             />
//             <input
//               className="profile-input"
//               type="tel"
//               name="mobileNumber"
//               placeholder="Phone Number"
//               value={profileData.mobileNumber}
//               onChange={handleInputChange}
//             />

//             <div className="address-form">
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="address"
//                 placeholder="Street Address"
//                 value={profileData.address}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, address: e.target.value })
//                 }
//               />
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 value={profileData.city}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, city: e.target.value })
//                 }
//               />
//               {/* <div className="state-zip-row"> */}
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={profileData.state}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, state: e.target.value })
//                 }
//               />
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="zip"
//                 placeholder="ZIP Code"
//                 value={profileData.zip}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, zip: e.target.value })
//                 }
//               />
//               {/* </div> */}
//             </div>

//             <div className="file-upload-container">
//               {/* ID Upload */}
//               <div className="file-upload-input">
//                 <input
//                   type="file"
//                   id="id-upload"
//                   accept="image/*,.pdf"
//                   onChange={(e) => handleFileUpload(e, "idDocument")}
//                   className="hidden-file-input"
//                 />
//                 <label htmlFor="id-upload" className="file-upload-label">
//                   <img
//                     src={paperReplice}
//                     alt="Upload"
//                     className="paperclip-icon"
//                   />
//                   <span className="file-upload-placeholder">
//                     {profileData.idDocument ? "ID Uploaded" : "Upload ID"}
//                   </span>
//                 </label>
//               </div>

//               {/* Driving License Upload */}
//               <div className="file-upload-input">
//                 <input
//                   type="file"
//                   id="dl-upload"
//                   accept="image/*,.pdf"
//                   onChange={(e) => handleFileUpload(e, "drivingLicense")}
//                   className="hidden-file-input"
//                 />
//                 <label htmlFor="dl-upload" className="file-upload-label">
//                   <img
//                     src={paperReplice}
//                     alt="Upload"
//                     className="paperclip-icon"
//                   />
//                   <span className="file-upload-placeholder">
//                     {profileData.drivingLicense
//                       ? "DL Uploaded"
//                       : "Upload Driving License"}
//                   </span>
//                 </label>
//               </div>
//             </div>

//             <button className="profile-confirm-button" onClick={handleConfirm}>
//               Confirm
//             </button>
//           </div>
//           {/* <div className="input-container11">
//             <button className="input11" onClick={openModal}>
//               <img
//                 className="person-fill"
//                 src={PersonFill}
//                 alt="Personal Information"
//               />
//               Personal Information
//             </button> */}
//           {/* <button className="input11" onClick={openRequestsModal}>
//               Manage Requests
//             </button> */}
//           {/* <button className="input11">
//               <img
//                 className="shield-fill"
//                 src={ShieldFill}
//                 alt="Security Information"
//               />
//               Security Information
//             </button>
//             <button className="input11">
//               <img className="key-fill" src={KeyFill} alt="Password" />
//               Password
//             </button>
//             <button className="input11">
//               <img className="gear-fill" src={GearFill} alt="Settings" />
//               Settings
//             </button>
//           </div> */}
//           {/* <div className="button-container11">
//             <button className="button11" onClick={handleLogout}>
//               <img className="logout-icon" src={LogoutIcon} alt="Log out" />
//               Log out
//             </button>
//           </div> */}
//         </div>
//       </div>

//       {/* Personal Info Modal */}
//       {isModalVisible && (
//         <PersonalInfoModal isVisible={isModalVisible} onClose={closeModal}>
//           <h2 className="personal-info-h2">
//             <img className="person-icon-modal" src={PersonFill} alt="icon" />
//             Personal Information
//           </h2>
//           <p>Legal name: {user.name}</p>
//           <p>Birthday: {user.dateOfBirth}</p>
//           <p>Email: {user.email}</p>
//           <p>Mobile: {user.mobileNumber}</p>
//           <h2 className="address-info-h2">
//             <img className="geoalt-icon" src={GeoaltIcon} alt="icon" />
//             Address Information
//           </h2>
//           <p>Street & Nr: {user.address}</p>
//           <p>ZIP Code: {user.zip}</p>
//           <p> State: {user.state}</p>
//         </PersonalInfoModal>
//       )}
//     </div>
//   );
// };

// export default Profile;

/////////////////////////////

import React, { useState, useEffect } from "react";
import "./Profile.css";
import PersonFill from "../../icons/person-fill.svg";
import ShieldFill from "../../icons/shield-fill.svg";
import KeyFill from "../../icons/key-fill.svg";
import GearFill from "../../icons/gear-fill.svg";
import LogoutIcon from "../../icons/box-arrow-left.svg";
import GeoaltIcon from "../../icons/geo-alt.svg";
import PersonalInfoModal from "../../Components/PersonalInfoModal/PersonalInfoModal";
import { useNavigate } from "react-router-dom";
import chevronLeft from "../../images/chevron-left.svg";
import cameraIcon from "../../icons/camera-fill.svg";
import paperReplice from "../../icons/paperclip.svg";
import { useMediaQuery } from "react-responsive";
import MobileFooter from "../../Components/MobileFooter/MobileFooter";

const Profile = ({ user, setUser, setShowProfile }) => {
  const isMobile = useMediaQuery({ maxWidth: 480 });
  const [activeIcon, setActiveIcon] = useState("icon4");
  const [isModalVisible, setModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [profileData, setProfileData] = useState({
    mobileNumber: user?.MobileNumber || user?.mobileNumber || "",
    address: user?.StreetAddress || user?.streetAddress || "",
    city: user?.City || user?.city || "",
    state: user?.State || user?.state || "",
    zip: user?.ZipCode || user?.zipCode || "",
    dateOfBirth: user?.DateOfBirth || user?.dateOfBirth || "",
    idDocument: user?.IdDocumentPath || user?.idDocumentPath || null,
    drivingLicense:
      user?.DrivingLicensePath || user?.drivingLicensePath || null,
  });

  const navigate = useNavigate();

  // // Redirect to complete-profile if profile isn't complete
  // useEffect(() => {
  //   if (user && !user.IsProfileComplete) {
  //     navigate("/complete-profile");
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    const checkCompletion = () => {
      const storedUser = localStorage.getItem("user");
      const localUser = storedUser ? JSON.parse(storedUser) : null;
      return user?.isProfileComplete || localUser?.isProfileComplete;
    };

    if (user && !checkCompletion()) {
      navigate("/complete-profile");
    }
  }, [user, navigate]);

  const handleHomePageClick = () => {
    navigate("/homepage");
    setShowProfile(false);
  };

  const handleFooterClick = (section) => {
    if (section === "form") {
      setActiveIcon("icon1");
      navigate("/homepage", { state: { showForm: true } });
    } else if (section === "options") {
      setActiveIcon("icon2");
      navigate("/homepage", { state: { showForm: false } });
    } else if (section === "profile") {
      setActiveIcon("icon4");
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setUploadedImage(null);
    setUser({ ...user, profileImage: null });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Call your backend API to update the profile
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...profileData,
          profileImage: uploadedImage || user.profileImage,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();

      // Update user state and local storage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="profile-main-container">
      <div className="profile-container">
        {!isMobile && (
          <div className="profile-back-icon">
            <img
              src={chevronLeft}
              onClick={handleHomePageClick}
              className="profile-chevron-left"
              alt="Back"
            />
            <h2 className="profile-h2">Account</h2>
          </div>
        )}
        <div className="profile-content-container">
          <div className="profile-photo-container">
            {!uploadedImage && !user.profileImage ? (
              <>
                <input
                  type="file"
                  id="file-input"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  accept="image/*"
                />
                <label htmlFor="file-input" className="profile-photo-empty">
                  <img className="camera-icon" src={cameraIcon} alt="Upload" />
                </label>
                <label htmlFor="file-input" className="profile-upload-label">
                  Upload Profile Photo
                </label>
              </>
            ) : (
              <div className="uploaded-image-container">
                <img
                  className="profile-photo"
                  src={uploadedImage || user.profileImage}
                  alt="Profile"
                />
                <button
                  className="profile-delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageDelete();
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="profile-welcome-label">
            {(uploadedImage || user.profileImage) && (
              <label className="welcome-label">Welcome, {user.name}!</label>
            )}
          </div>

          <div className="text-info">
            <input
              className="profile-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={user?.FullName || user?.fullName || ""}
              readOnly
            />
            <input
              className="profile-input"
              type="email"
              name="email"
              placeholder="Email"
              value={user?.Email || user?.email || ""}
              readOnly
            />
            <input
              className="profile-input"
              type="date"
              name="dateOfBirth"
              placeholder="Date of Birth"
              value={
                user?.DateOfBirth
                  ? new Date(user.DateOfBirth).toISOString().split("T")[0]
                  : ""
              }
              readOnly
            />
            <input
              className="profile-input"
              type="tel"
              name="mobileNumber"
              placeholder="Phone Number"
              value={profileData.mobileNumber}
              readOnly
            />

            <div className="profile-address-form">
              <input
                className="profile-input"
                type="text"
                name="address"
                placeholder="Street Address"
                value={profileData.address}
                readOnly
              />
              <input
                className="profile-input"
                type="text"
                name="city"
                placeholder="City"
                value={profileData.city}
                readOnly
              />
              <input
                className="profile-input"
                type="text"
                name="state"
                placeholder="State"
                value={profileData.state}
                readOnly
              />
              <input
                className="profile-input"
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={profileData.zip}
                readOnly
              />
            </div>

            <div className="profile-file-upload-container">
              <div className="profile-file-upload-input">
                <input
                  type="file"
                  id="id-upload"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, "idDocument")}
                  className="profile-hidden-file-input"
                />
                <label
                  htmlFor="id-upload"
                  className="profile-file-upload-label"
                >
                  <img
                    src={paperReplice}
                    alt="Upload"
                    className="profile-paperclip-icon"
                  />
                  <span className="profile-file-upload-placeholder">
                    {profileData.idDocument ? "ID Uploaded" : "Update ID"}
                  </span>
                </label>
              </div>

              <div className="profile-file-upload-input">
                <input
                  type="file"
                  id="dl-upload"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, "drivingLicense")}
                  className="profile-hidden-file-input"
                />
                <label
                  htmlFor="dl-upload"
                  className="profile-file-upload-label"
                >
                  <img
                    src={paperReplice}
                    alt="Upload"
                    className="profile-paperclip-icon"
                  />
                  <span className="profile-file-upload-placeholder">
                    {profileData.drivingLicense
                      ? "DL Uploaded"
                      : "Update Driving License"}
                  </span>
                </label>
              </div>
            </div>

            <div className="profile-actions">
              {/* <button className="profile-save-button" onClick={handleSave}>
                Save Changes
              </button> */}
              <button className="profile-logout-button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <MobileFooter
          onFooterClick={handleFooterClick}
          activeIcon={activeIcon}
        />
      )}
    </div>
  );
};

export default Profile;

//
// import React, { useState, useEffect } from "react";
// import "./Profile.css";
// import PersonFill from "../../icons/person-fill.svg";
// import ShieldFill from "../../icons/shield-fill.svg";
// import KeyFill from "../../icons/key-fill.svg";
// import GearFill from "../../icons/gear-fill.svg";
// import LogoutIcon from "../../icons/box-arrow-left.svg";
// import GeoaltIcon from "../../icons/geo-alt.svg";
// import PersonalInfoModal from "../../Components/PersonalInfoModal/PersonalInfoModal";
// import { useNavigate } from "react-router-dom";
// import chevronLeft from "../../images/chevron-left.svg";
// import cameraIcon from "../../icons/camera-fill.svg";
// import paperReplice from "../../icons/paperclip.svg";
// import { useMediaQuery } from "react-responsive";
// import MobileFooter from "../../Components/MobileFooter/MobileFooter";

// const Profile = ({ user, setUser, setShowProfile }) => {
//   const isMobile = useMediaQuery({ maxWidth: 480 });
//   const [activeIcon, setActiveIcon] = useState("icon4");
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [profileData, setProfileData] = useState({
//     mobileNumber: user.mobileNumber || "",
//     address: user.address || "",
//     city: user.city || "",
//     state: user.state || "",
//     zip: user.zip || "",
//     dateOfBirth: user.dateOfBirth || "",
//     idDocument: user.idDocument || null,
//     drivingLicense: user.drivingLicense || null,
//   });

//   const navigate = useNavigate();

//   // Redirect to complete-profile if profile isn't complete
//   useEffect(() => {
//     if (user && !user.IsProfileComplete) {
//       navigate("/complete-profile");
//     }
//   }, [user, navigate]);

//   const handleHomePageClick = () => {
//     navigate("/homepage");
//     setShowProfile(false);
//   };

//   const handleFooterClick = (section) => {
//     if (section === "form") {
//       setActiveIcon("icon1");
//       navigate("/homepage", { state: { showForm: true } });
//     } else if (section === "options") {
//       setActiveIcon("icon2");
//       navigate("/homepage", { state: { showForm: false } });
//     } else if (section === "profile") {
//       setActiveIcon("icon4");
//     }
//   };

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setUploadedImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleImageDelete = () => {
//     setUploadedImage(null);
//     setUser({ ...user, profileImage: null });
//   };

//   const handleLogout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileUpload = (e, fieldName) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfileData((prev) => ({
//         ...prev,
//         [fieldName]: file,
//       }));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       // Call your backend API to update the profile
//       const response = await fetch("/api/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           ...profileData,
//           profileImage: uploadedImage || user.profileImage,
//         }),
//       });

//       if (!response.ok) throw new Error("Failed to update profile");

//       const updatedUser = await response.json();

//       // Update user state and local storage
//       setUser(updatedUser);
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       alert("Profile updated successfully!");
//     } catch (error) {
//       console.error("Profile update error:", error);
//       alert("Error updating profile. Please try again.");
//     }
//   };

//   return (
//     <div className="profile-main-container">
//       <div className="profile-container">
//         {!isMobile && (
//           <div className="profile-back-icon">
//             <img
//               src={chevronLeft}
//               onClick={handleHomePageClick}
//               className="profile-chevron-left"
//               alt="Back"
//             />
//             <h2 className="profile-h2">Account</h2>
//           </div>
//         )}
//         <div className="profile-content-container">
//           <div className="profile-photo-container">
//             {!uploadedImage && !user.profileImage ? (
//               <>
//                 <input
//                   type="file"
//                   id="file-input"
//                   onChange={handleImageUpload}
//                   style={{ display: "none" }}
//                   accept="image/*"
//                 />
//                 <label htmlFor="file-input" className="profile-photo-empty">
//                   <img className="camera-icon" src={cameraIcon} alt="Upload" />
//                 </label>
//                 <label htmlFor="file-input" className="profile-upload-label">
//                   Upload Profile Photo
//                 </label>
//               </>
//             ) : (
//               <div className="uploaded-image-container">
//                 <img
//                   className="profile-photo"
//                   src={uploadedImage || user.profileImage}
//                   alt="Profile"
//                 />
//                 <button
//                   className="profile-delete-button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleImageDelete();
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="profile-welcome-label">
//             {(uploadedImage || user.profileImage) && (
//               <label className="welcome-label">Welcome, {user.name}!</label>
//             )}
//           </div>

//           <div className="text-info">
//             <input
//               className="profile-input"
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={user.name}
//               readOnly
//             />
//             <input
//               className="profile-input"
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={user.email}
//               readOnly
//             />
//             <input
//               className="profile-input"
//               type="date"
//               name="dateOfBirth"
//               placeholder="Date of Birth"
//               value={profileData.dateOfBirth}
//               onChange={handleInputChange}
//             />
//             <input
//               className="profile-input"
//               type="tel"
//               name="mobileNumber"
//               placeholder="Phone Number"
//               value={profileData.mobileNumber}
//               onChange={handleInputChange}
//             />

//             <div className="profile-address-form">
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="address"
//                 placeholder="Street Address"
//                 value={profileData.address}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, address: e.target.value })
//                 }
//               />
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 value={profileData.city}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, city: e.target.value })
//                 }
//               />
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="state"
//                 placeholder="State"
//                 value={profileData.state}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, state: e.target.value })
//                 }
//               />
//               <input
//                 className="profile-input"
//                 type="text"
//                 name="zip"
//                 placeholder="ZIP Code"
//                 value={profileData.zip}
//                 onChange={(e) =>
//                   setProfileData({ ...profileData, zip: e.target.value })
//                 }
//               />
//             </div>

//             <div className="profile-file-upload-container">
//               <div className="profile-file-upload-input">
//                 <input
//                   type="file"
//                   id="id-upload"
//                   accept="image/*,.pdf"
//                   onChange={(e) => handleFileUpload(e, "idDocument")}
//                   className="profile-hidden-file-input"
//                 />
//                 <label
//                   htmlFor="id-upload"
//                   className="profile-file-upload-label"
//                 >
//                   <img
//                     src={paperReplice}
//                     alt="Upload"
//                     className="profile-paperclip-icon"
//                   />
//                   <span className="profile-file-upload-placeholder">
//                     {profileData.idDocument ? "ID Uploaded" : "Update ID"}
//                   </span>
//                 </label>
//               </div>

//               <div className="profile-file-upload-input">
//                 <input
//                   type="file"
//                   id="dl-upload"
//                   accept="image/*,.pdf"
//                   onChange={(e) => handleFileUpload(e, "drivingLicense")}
//                   className="profile-hidden-file-input"
//                 />
//                 <label
//                   htmlFor="dl-upload"
//                   className="profile-file-upload-label"
//                 >
//                   <img
//                     src={paperReplice}
//                     alt="Upload"
//                     className="profile-paperclip-icon"
//                   />
//                   <span className="profile-file-upload-placeholder">
//                     {profileData.drivingLicense
//                       ? "DL Uploaded"
//                       : "Update Driving License"}
//                   </span>
//                 </label>
//               </div>
//             </div>

//             <div className="profile-actions">
//               {/* <button className="profile-save-button" onClick={handleSave}>
//                 Save Changes
//               </button> */}
//               <button className="profile-logout-button" onClick={handleLogout}>
//                 Log out
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isMobile && (
//         <MobileFooter
//           onFooterClick={handleFooterClick}
//           activeIcon={activeIcon}
//         />
//       )}
//     </div>
//   );
// };

// export default Profile;
