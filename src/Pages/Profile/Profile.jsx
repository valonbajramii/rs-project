// import React from "react";
// import "./Profile.css";
// import PersonFill from "../../icons/person-fill.svg";
// import ShieldFill from "../../icons/shield-fill.svg";
// import KeyFill from "../../icons/key-fill.svg";
// import GearFill from "../../icons/gear-fill.svg";
// import Photo from "../../images/foto.png";
// import LogoutIcon from "../../icons/box-arrow-left.svg";

// const Profile = () => {
//   const user = {
//     name: "Jon Doe",
//     email: "jon.doe@gmail.com",
//     number: "+41 78 000 00 00",
//     // Other user data
//   };

//   return (
//     <div className="container11">
//       <div className="content-container11">
//         <img className="profile-photo" src={Photo} />
//         <div className="text-info">
//           <h1 className="profile-h1">{user.name}</h1>
//           <h3 className="profile-h3">{user.email}</h3>
//           <h3 className="profile-h3">{user.number}</h3>
//         </div>
//         <div className="input-container11">
//           <button className="input11">
//             <img className="person-fill" src={PersonFill} />
//             Personal Information
//           </button>
//           <button className="input11">
//             <img className="shield-fill" src={ShieldFill} />
//             Security Information
//           </button>
//           <button className="input11">
//             <img className="key-fill" src={KeyFill} />
//             Password
//           </button>
//           <button className="input11">
//             <img className="gear-fill" src={GearFill} />
//             Settings
//           </button>
//         </div>
//         <div className="button-container11">
//           <button className="button11">
//             <img className="logout-icon" src={LogoutIcon} />
//             Log out
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import "./Profile.css";
// import PersonFill from "../../icons/person-fill.svg";
// import ShieldFill from "../../icons/shield-fill.svg";
// import KeyFill from "../../icons/key-fill.svg";
// import GearFill from "../../icons/gear-fill.svg";
// import Photo from "../../images/foto.png";
// import LogoutIcon from "../../icons/box-arrow-left.svg";
// import GeoaltIcon from "../../icons/geo-alt.svg";
// import PersonalInfoModal from "../../Components/PersonalInfoModal/PersonalInfoModal";

// const Profile = () => {
//   const [isModalVisible, setModalVisible] = useState(false);

//   const user = {
//     name: "Jon Doe",
//     email: "jon.doe@gmail.com",
//     number: "+41 78 000 00 00",
//     birthday: "05.06.1989",
//     street: "Teststr. 23",
//     zip: "8001",
//     state: "Zürich",
//   };

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   return (
//     <div className="container11">
//       <div className="content-container11">
//         <img className="profile-photo" src={Photo} alt="Profile" />
//         <div className="text-info">
//           <h1 className="profile-h1">{user.name}</h1>
//           <h3 className="profile-h3">{user.email}</h3>
//           <h3 className="profile-h3">{user.number}</h3>
//         </div>
//         <div className="input-container11">
//           <button className="input11" onClick={openModal}>
//             <img
//               className="person-fill"
//               src={PersonFill}
//               alt="Personal Information"
//             />
//             Personal Information
//           </button>
//           <button className="input11">
//             <img
//               className="shield-fill"
//               src={ShieldFill}
//               alt="Security Information"
//             />
//             Security Information
//           </button>
//           <button className="input11">
//             <img className="key-fill" src={KeyFill} alt="Password" />
//             Password
//           </button>
//           <button className="input11">
//             <img className="gear-fill" src={GearFill} alt="Settings" />
//             Settings
//           </button>
//         </div>
//         <div className="button-container11">
//           <button className="button11">
//             <img className="logout-icon" src={LogoutIcon} alt="Log out" />
//             Log out
//           </button>
//         </div>
//       </div>

//       <PersonalInfoModal isVisible={isModalVisible} onClose={closeModal}>
//         <h2 className="personal-info-h2">
//           <img className="person-icon-modal" src={PersonFill} />
//           Personal Information
//         </h2>
//         <p>Legal name: {user.name}</p>
//         <p>Birthday: {user.birthday}</p>
//         <p>Email: {user.email}</p>
//         <p>Mobile: {user.number}</p>
//         <h2 className="address-info-h2">
//           <img className="geoalt-icon" src={GeoaltIcon} />
//           Address Information
//         </h2>
//         <p>Street & Nr: {user.street}</p>
//         <p>ZIP Code: {user.zip}</p>
//         <p> State: {user.state}</p>
//       </PersonalInfoModal>
//     </div>
//   );
// };

// export default Profile;
/////////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import "./Profile.css";
// import PersonFill from "../../icons/person-fill.svg";
// import ShieldFill from "../../icons/shield-fill.svg";
// import KeyFill from "../../icons/key-fill.svg";
// import GearFill from "../../icons/gear-fill.svg";
// import LogoutIcon from "../../icons/box-arrow-left.svg";
// import GeoaltIcon from "../../icons/geo-alt.svg";
// import PersonalInfoModal from "../../Components/PersonalInfoModal/PersonalInfoModal";

// const Profile = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [uploadedImage, setUploadedImage] = useState(null);

//   const user = {
//     name: "Jon Doe",
//     email: "jon.doe@gmail.com",
//     number: "+41 78 000 00 00",
//     birthday: "05.06.1989",
//     street: "Teststr. 23",
//     zip: "8001",
//     state: "Zürich",
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
//   };

//   return (
//     <div className="container11">
//       <div className="content-container11">
//         <div className="profile-photo-container">
//           {!uploadedImage && (
//             <>
//               <input
//                 type="file"
//                 id="file-input"
//                 onChange={handleImageUpload}
//                 style={{ display: "none" }}
//               />
//               <label htmlFor="file-input" className="profile-photo-empty">
//                 Upload image
//               </label>
//             </>
//           )}
//           {uploadedImage && (
//             <div className="uploaded-image-container">
//               <img
//                 className="profile-photo"
//                 src={uploadedImage}
//                 alt="Uploaded"
//               />
//               <button className="delete-button" onClick={handleImageDelete}>
//                 x
//               </button>
//             </div>
//           )}
//         </div>
//         <div className="text-info">
//           <h1 className="profile-h1">{user.name}</h1>
//           <h3 className="profile-h3">{user.email}</h3>
//           <h3 className="profile-h3">{user.number}</h3>
//         </div>
//         <div className="input-container11">
//           <button className="input11" onClick={openModal}>
//             <img
//               className="person-fill"
//               src={PersonFill}
//               alt="Personal Information"
//             />
//             Personal Information
//           </button>
//           <button className="input11">
//             <img
//               className="shield-fill"
//               src={ShieldFill}
//               alt="Security Information"
//             />
//             Security Information
//           </button>
//           <button className="input11">
//             <img className="key-fill" src={KeyFill} alt="Password" />
//             Password
//           </button>
//           <button className="input11">
//             <img className="gear-fill" src={GearFill} alt="Settings" />
//             Settings
//           </button>
//         </div>
//         <div className="button-container11">
//           <button className="button11">
//             <img className="logout-icon" src={LogoutIcon} alt="Log out" />
//             Log out
//           </button>
//         </div>
//       </div>

//       <PersonalInfoModal isVisible={isModalVisible} onClose={closeModal}>
//         <h2 className="personal-info-h2">
//           <img className="person-icon-modal" src={PersonFill} alt="icon" />
//           Personal Information
//         </h2>
//         <p>Legal name: {user.name}</p>
//         <p>Birthday: {user.birthday}</p>
//         <p>Email: {user.email}</p>
//         <p>Mobile: {user.number}</p>
//         <h2 className="address-info-h2">
//           <img className="geoalt-icon" src={GeoaltIcon} alt="icon" />
//           Address Information
//         </h2>
//         <p>Street & Nr: {user.street}</p>
//         <p>ZIP Code: {user.zip}</p>
//         <p> State: {user.state}</p>
//       </PersonalInfoModal>
//     </div>
//   );
// };

// export default Profile;
//////////////////////////////

import React, { useState } from "react";
import "./Profile.css";
import PersonFill from "../../icons/person-fill.svg";
import ShieldFill from "../../icons/shield-fill.svg";
import KeyFill from "../../icons/key-fill.svg";
import GearFill from "../../icons/gear-fill.svg";
import LogoutIcon from "../../icons/box-arrow-left.svg";
import GeoaltIcon from "../../icons/geo-alt.svg";
import PersonalInfoModal from "../../Components/PersonalInfoModal/PersonalInfoModal";

const Profile = ({ user }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

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
  };

  return (
    <div className="container11">
      <div className="content-container11">
        <div className="profile-photo-container">
          {!uploadedImage && (
            <>
              <input
                type="file"
                id="file-input"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="profile-photo-empty">
                Upload image
              </label>
            </>
          )}
          {uploadedImage && (
            <div className="uploaded-image-container">
              <img
                className="profile-photo"
                src={uploadedImage}
                alt="Uploaded"
              />
              <button className="delete-button" onClick={handleImageDelete}>
                x
              </button>
            </div>
          )}
        </div>
        <div className="text-info">
          <h1 className="profile-h1">{user.name}</h1>
          <h3 className="profile-h3">{user.email}</h3>
        </div>
        <div className="input-container11">
          <button className="input11" onClick={openModal}>
            <img
              className="person-fill"
              src={PersonFill}
              alt="Personal Information"
            />
            Personal Information
          </button>
          <button className="input11">
            <img
              className="shield-fill"
              src={ShieldFill}
              alt="Security Information"
            />
            Security Information
          </button>
          <button className="input11">
            <img className="key-fill" src={KeyFill} alt="Password" />
            Password
          </button>
          <button className="input11">
            <img className="gear-fill" src={GearFill} alt="Settings" />
            Settings
          </button>
        </div>
        <div className="button-container11">
          <button className="button11">
            <img className="logout-icon" src={LogoutIcon} alt="Log out" />
            Log out
          </button>
        </div>
      </div>

      {isModalVisible && (
        <PersonalInfoModal isVisible={isModalVisible} onClose={closeModal}>
          <h2 className="personal-info-h2">
            <img className="person-icon-modal" src={PersonFill} alt="icon" />
            Personal Information
          </h2>
          <p>Legal name: {user.name}</p>
          <p>Birthday: {user.dateOfBirth}</p>
          <p>Email: {user.email}</p>
          <p>Mobile: {user.mobileNumber}</p>
          <h2 className="address-info-h2">
            <img className="geoalt-icon" src={GeoaltIcon} alt="icon" />
            Address Information
          </h2>
          <p>Street & Nr: {user.address}</p>
          <p>ZIP Code: {user.zip}</p>
          <p> State: {user.state}</p>
        </PersonalInfoModal>
      )}
    </div>
  );
};

export default Profile;
