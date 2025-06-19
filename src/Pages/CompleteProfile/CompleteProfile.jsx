import React, { useState, useEffect } from "react";
import "./CompleteProfile.css";
import { useNavigate } from "react-router-dom";
import paperReplice from "../../icons/paperclip.svg";

const CompleteProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    mobileNumber: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    idDocument: null,
    drivingLicense: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If user somehow reaches this page with complete profile, redirect them
    if (user?.IsProfileComplete) {
      navigate("/homepage");
    }
  }, [user, navigate]);

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

  const validate = () => {
    const newErrors = {};
    if (!profileData.mobileNumber) newErrors.mobileNumber = "Required";
    if (!profileData.address) newErrors.address = "Required";
    if (!profileData.city) newErrors.city = "Required";
    if (!profileData.state) newErrors.state = "Required";
    if (!profileData.zip) newErrors.zip = "Required";
    if (!profileData.idDocument) newErrors.idDocument = "Required";
    if (!profileData.drivingLicense) newErrors.drivingLicense = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Call your backend API to complete the profile
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error("Failed to complete profile");

      const updatedUser = await response.json();

      // Update user state and local storage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Redirect to homepage
      navigate("/homepage");
    } catch (error) {
      console.error("Profile completion error:", error);
      alert("Error completing profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complete-profile-container">
      <div className="complete-profile-card">
        <h2>Complete Your Profile</h2>
        <p>
          Please provide the following information to continue using our
          services
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="mobileNumber"
              value={profileData.mobileNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
            {errors.mobileNumber && (
              <span className="error">{errors.mobileNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              placeholder="Enter your street address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
                placeholder="City"
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={profileData.state}
                onChange={handleInputChange}
                placeholder="State"
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>

            <div className="form-group">
              <label>ZIP Code *</label>
              <input
                type="text"
                name="zip"
                value={profileData.zip}
                onChange={handleInputChange}
                placeholder="ZIP"
              />
              {errors.zip && <span className="error">{errors.zip}</span>}
            </div>
          </div>

          <div className="file-upload-container">
            <div className="file-upload-group">
              <label>ID Document *</label>
              <div className="file-upload-input">
                <input
                  type="file"
                  id="id-upload"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, "idDocument")}
                  className="hidden-file-input"
                />
                <label htmlFor="id-upload" className="file-upload-label">
                  <img
                    src={paperReplice}
                    alt="Upload"
                    className="paperclip-icon"
                  />
                  <span>
                    {profileData.idDocument
                      ? profileData.idDocument.name
                      : "Upload ID"}
                  </span>
                </label>
              </div>
              {errors.idDocument && (
                <span className="error">{errors.idDocument}</span>
              )}
            </div>

            <div className="file-upload-group">
              <label>Driving License *</label>
              <div className="file-upload-input">
                <input
                  type="file"
                  id="dl-upload"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, "drivingLicense")}
                  className="hidden-file-input"
                />
                <label htmlFor="dl-upload" className="file-upload-label">
                  <img
                    src={paperReplice}
                    alt="Upload"
                    className="paperclip-icon"
                  />
                  <span>
                    {profileData.drivingLicense
                      ? profileData.drivingLicense.name
                      : "Upload Driving License"}
                  </span>
                </label>
              </div>
              {errors.drivingLicense && (
                <span className="error">{errors.drivingLicense}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="complete-profile-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
