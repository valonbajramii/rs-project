import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Delivery.css";
import chevronLeft from "../../images/chevron-left.svg";
import { ReactComponent as MyLocationIcon } from "../../icons/MyLocationIcon.svg";
import Three from "../../icons/Three.svg";
import { ReactComponent as DestinationIcon } from "../../icons/Destionation-icon.svg";
import { packagesApi } from "../../API/api";
import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";

const Delivery = ({ user, onClose, addNewDelivery }) => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [newDelivery, setNewDelivery] = useState({
    images: [],
    name: "",
    location: "",
    destination: "",
    description: "",
    price: "",
    weightinKg: "",
    length: "",
    height: "",
    width: "",
    deadline: "",
  });

  const isMobile = useMediaQuery({ maxWidth: 480 });

  // Remove the duplicate formValues state and use newDelivery instead
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      alert("Please log in first");
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleImageDelete = (index) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      newImages[index] = null;
      return newImages;
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDelivery((prev) => ({ ...prev, [name]: value }));
  };

  // Helper function to convert base64 to blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Update handleImageUpload to store File objects
  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    if (!file) return;

    // Store the file object for later upload
    setUploadedImages((prev) => {
      const newImages = [...prev];
      newImages[index] = file;

      // Also create a preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDelivery((prev) => ({
          ...prev,
          imagePreviews: {
            ...prev.imagePreviews,
            [index]: reader.result,
          },
        }));
      };
      reader.readAsDataURL(file);

      return newImages;
    });
  };

  const handleAddDelivery = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token || !storedUser?.email) {
        alert("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (
        !newDelivery.name ||
        !newDelivery.location ||
        !newDelivery.destination
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append("name", newDelivery.name);
      formData.append("location", newDelivery.location);
      formData.append("destination", newDelivery.destination);
      formData.append("description", newDelivery.description || "");
      formData.append("weight", newDelivery.weightinKg);
      formData.append("length", newDelivery.length);
      formData.append("height", newDelivery.height);
      formData.append("width", newDelivery.width);
      formData.append("price", newDelivery.price);

      // Append images
      uploadedImages.forEach((image, index) => {
        if (image && typeof image !== "string") {
          // If it's a File object
          formData.append("images", image);
        } else if (
          image &&
          typeof image === "string" &&
          image.startsWith("data:")
        ) {
          // Convert base64 to blob if needed
          const blob = dataURLtoBlob(image);
          formData.append("images", blob, `image_${index}.jpg`);
        }
      });
      console.log("Uploading images:", uploadedImages);
      // Update API call to use FormData
      await addNewDelivery(formData);
      alert("Package created successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to create package:", error);
      alert(error.message || "Failed to create package. Please try again.");
    }
  };

  return (
    <div className="delivery-form-container">
      <div className="delivery-modal-content">
        <div className="delivery-container">
          <div className="delivery-content">
            <div className="back-button-and-text">
              <img
                src={chevronLeft}
                className="chevron-left"
                alt="Back"
                onClick={onClose}
              />
              <h2 className="delivery-h2">Add new package</h2>
            </div>

            <div className="delivery-inputs-container">
              <div className="form-section">
                <h3 className="section-title">Package Name</h3>
                <input
                  className="delivery-input"
                  type="text"
                  name="name"
                  placeholder="Aspirator"
                  value={newDelivery.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-section">
                <h3 className="section-title">Location and Destination</h3>
                <div className="divs-icons-container">
                  {!isMobile && (
                    <div className="icons-container">
                      {/* My Location Icon - blue when location has value */}
                      <MyLocationIcon
                        className={`delivery-my-location-icon ${
                          newDelivery.location ? "active" : ""
                        }`}
                        alt="My Location"
                      />

                      {/* Three dots Icon - blue when destination has value */}
                      <img
                        className={`delivery-three ${
                          newDelivery.destination ? "active" : ""
                        }`}
                        src={Three}
                        alt="Route"
                      />

                      {/* Destination Icon - blue when destination has value */}
                      <DestinationIcon
                        className={`delivery-destination-icon ${
                          newDelivery.destination ? "active" : ""
                        }`}
                        alt="Destination"
                      />
                    </div>
                  )}
                  <div className="input-group">
                    <input
                      className="delivery-input"
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={newDelivery.location}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="delivery-input"
                      type="text"
                      name="destination"
                      placeholder="Destination"
                      value={newDelivery.destination}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Description</h3>
                <textarea
                  className="delivery-textarea"
                  name="description"
                  value={newDelivery.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
            </div>
          </div>
          <hr className="vertical" />
          <div className="delivery-img-container">
            <div className="form-section">
              <h3 className="h3-section-title">Dimensions</h3>
              <div className="additional-info-grid">
                <div className="delivery-info-group">
                  <label className="dimension-label">Weight</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="weightinKg"
                      placeholder="Weight in kg"
                      value={newDelivery.weightinKg}
                      onChange={handleInputChange}
                    />
                    <span className="unit">Kg</span>
                  </div>
                </div>

                <div className="delivery-info-group">
                  <label className="dimension-label">Length</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="length"
                      placeholder="Length in cm"
                      value={newDelivery.length}
                      onChange={handleInputChange}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>

                <div className="delivery-info-group">
                  <label className="dimension-label">Height</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="height"
                      placeholder="Height in cm"
                      value={newDelivery.height}
                      onChange={handleInputChange}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>

                <div className="delivery-info-group">
                  <label className="dimension-label">Width</label>
                  <div className="input-with-unit">
                    <input
                      className="delivery-input"
                      type="number"
                      name="width"
                      placeholder="Width in cm"
                      value={newDelivery.width}
                      onChange={handleInputChange}
                    />
                    <span className="unit">cm</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="section-title">Images</h3>
            <div className="image-grid-container">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`image-box ${
                    index === 0 ? "large-box" : "small-box"
                  }`}
                >
                  {uploadedImages[index] ? (
                    <div className="uploaded-image-container">
                      <img
                        className="delivery-image"
                        src={
                          typeof uploadedImages[index] === "string"
                            ? uploadedImages[index]
                            : URL.createObjectURL(uploadedImages[index])
                        }
                        alt={`Uploaded ${index}`}
                      />
                      <button
                        className="delivery-delete-button"
                        onClick={() => handleImageDelete(index)}
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-input-${index}`}
                      className="delivery-upload-label"
                    >
                      <span className="plus-icon">+</span>
                      <input
                        type="file"
                        id={`file-input-${index}`}
                        onChange={(e) => handleImageUpload(e, index)}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
            <div className="form-section">
              <h3 className="section-title">Price</h3>
              <div className="input-with-unit-price">
                <input
                  className="delivery-input"
                  type="number"
                  name="price"
                  placeholder="in CHF"
                  value={newDelivery.price}
                  onChange={handleInputChange}
                />
                <span className="unit">CHF</span>
              </div>
            </div>
            <div className="Container-delivery-button">
              <button className="delivery-button" onClick={handleAddDelivery}>
                Add New Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
