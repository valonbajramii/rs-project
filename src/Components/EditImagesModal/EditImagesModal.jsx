import React, { useState } from "react";
import "./EditImagesModal.css";

const EditImagesModal = ({ images, onSave, onClose }) => {
  const [updatedImages, setUpdatedImages] = useState([...images]);

  const handleImageUpload = (event, index) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUpdatedImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = reader.result;
        return newImages;
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = (index) => {
    setUpdatedImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1); // Remove the image at the specific index
      return newImages;
    });
  };

  const handleSave = () => {
    onSave(updatedImages);
    onClose();
  };

  return (
    <div className="edit-images-modal-container">
      <div className="edit-images-modal-content">
        <h2>Edit Images</h2>
        <div className="edit-images-content">
          <div className="main-image-box">
            {updatedImages[0] ? (
              <img
                src={updatedImages[0]}
                alt="Main"
                className="edit-main-image"
              />
            ) : (
              <label htmlFor="file-upload-0" className="upload-label">
                <span className="plus-icon">+</span>
              </label>
            )}
            <input
              id="file-upload-0"
              type="file"
              onChange={(event) => handleImageUpload(event, 0)}
              style={{ display: "none" }}
            />
          </div>
          <div className="thumbnail-grid">
            {updatedImages.slice(1).map((image, index) => (
              <div key={index} className="thumbnail-box">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="edit-images-thumbnail-image"
                />
                <button
                  onClick={() => handleImageDelete(index + 1)}
                  className="delete-thumbnail"
                >
                  x
                </button>
              </div>
            ))}
            {updatedImages.length < 5 && (
              <div className="thumbnail-box">
                <label htmlFor={`file-upload-${updatedImages.length}`}>
                  <span className="plus-icon">+</span>
                </label>
                <input
                  id={`file-upload-${updatedImages.length}`}
                  type="file"
                  onChange={(event) =>
                    handleImageUpload(event, updatedImages.length)
                  }
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditImagesModal;
