import React, { useState, useEffect } from "react";
import "./Profile.css";
import PersonFill from "../../icons/person-fill.svg";
import ShieldFill from "../../icons/shield-fill.svg";
import KeyFill from "../../icons/key-fill.svg";
import GearFill from "../../icons/gear-fill.svg";
import LogoutIcon from "../../icons/box-arrow-left.svg";
import GeoaltIcon from "../../icons/geo-alt.svg";
import PersonalInfoModal from "../../Components/PersonalInfoModal/PersonalInfoModal";
import RequestsModal from "../../Components/RequestsModal/RequestsModal";
import { useNavigate } from "react-router-dom";

const Profile = ({ user, setUser }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRequestsModalVisible, setRequestsModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Load requests from localStorage on component mount
    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    const userRequests = storedRequests.filter(
      (request) => request.deliveryOwnerEmail === user.email
    );
    setRequests(userRequests);
  }, [user.email]);

  const handleHomePageClick = () => {
    navigate("/homepage");
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openRequestsModal = () => {
    setRequestsModalVisible(true);
  };

  const closeRequestsModal = () => {
    setRequestsModalVisible(false);
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

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleApproveRequest = (index) => {
    const updatedRequests = [...requests];
    updatedRequests[index].isApproved = true;
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
  };

  return (
    <div className="container11">
      <div className="profile-backbutton-container">
        <button onClick={handleHomePageClick} className="back-button">Back</button>
      </div>
      <div className="container2">
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
                <img className="profile-photo" src={uploadedImage} alt="Uploaded" />
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
            <button className="input11" onClick={openRequestsModal}>
              Manage Requests
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

          {/* Requests Modal */}
          <RequestsModal
            isVisible={isRequestsModalVisible}
            onClose={closeRequestsModal}
            requests={requests}
            onApprove={handleApproveRequest}
          />

          <div className="button-container11">
            <button className="button11" onClick={handleLogout}>
              <img className="logout-icon" src={LogoutIcon} alt="Log out" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Personal Info Modal */}
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