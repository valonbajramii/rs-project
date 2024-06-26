// import React from "react";
// import "./Delivery.css";
// import CarImg from "../../icons/car-front-fill.svg";
// import MeImg from "../../images/foto.png";

// const Delivery = () => {
//   return (
//     <div className="delivery-container">
//       <div className="delivery-content">
//         <h2 className="delivery-h2">Get a Delivery</h2>
//         <div className="delivery-inputs-container">
//           <input
//             className="delivery-input"
//             type="text"
//             placeholder="Location"
//           />
//           <input
//             className="delivery-input"
//             type="text"
//             placeholder="Destination"
//           />
//           <input
//             className="delivery-input"
//             type="text"
//             placeholder=" Description"
//           />
//           <input
//             className="delivery-input"
//             type="number"
//             placeholder="Price in CHF"
//           />
//           <input
//             className="delivery-input"
//             type="number"
//             placeholder="Weight in Kg"
//           />
//           <input
//             className="delivery-input"
//             type="number"
//             placeholder="Length"
//           />
//           <input className="delivery-input" type="number" placeholder="Hight" />
//           <input className="delivery-input" type="number" placeholder="Width" />
//           <input
//             className="delivery-input"
//             type="datetime-local"
//             placeholder="Pickup Time"
//           />
//         </div>
//       </div>
//       <div className="delivery-img-container">
//         <img className="deliveri-image" src={CarImg}></img>
//       </div>
//     </div>
//   );
// };

// export default Delivery;

// import React, { useState } from "react";
// import "./Delivery.css";

// const Delivery = () => {
//   const [uploadedImage, setUploadedImage] = useState(null);

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

//   return (
//     <div className="delivery-container">
//       <div className="delivery-content">
//         <h2 className="delivery-h2">Get a Delivery</h2>
//         <div className="delivery-inputs-container">
//           <input
//             className="delivery-input"
//             type="text"
//             placeholder="Location"
//           />
//           <input
//             className="delivery-input"
//             type="text"
//             placeholder="Destination"
//           />
//           <input
//             className="delivery-input"
//             type="text"
//             placeholder="Description"
//           />
//           <input
//             className="delivery-input"
//             type="number"
//             placeholder="Price in CHF"
//           />
//           <input
//             className="delivery-input"
//             type="number"
//             placeholder="Weight in Kg"
//           />
//           <input
//             className="delivery-input"
//             type="number"
//             placeholder="Length"
//           />
//           <input
//             className="delivery-input"
//             type="number"
//             placeholder="Height"
//           />
//           <input className="delivery-input" type="number" placeholder="Width" />
//           <input
//             className="delivery-input"
//             type="datetime-local"
//             placeholder="Pickup Time"
//           />
//         </div>
//       </div>
//       <div className="delivery-img-container">
//         {!uploadedImage && (
//           <>
//             <input
//               type="file"
//               id="file-input"
//               onChange={handleImageUpload}
//               style={{ display: "none" }}
//             />
//             <label htmlFor="file-input" className="custom-file-upload">
//               Upload image
//             </label>
//           </>
//         )}
//         {uploadedImage && (
//           <img className="deliveri-image" src={uploadedImage} alt="Uploaded" />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Delivery;

import React, { useState } from "react";
import "./Delivery.css";

const Delivery = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

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
    <div className="delivery-container">
      <div className="delivery-content">
        <h2 className="delivery-h2">Get a Delivery</h2>
        <div className="delivery-inputs-container">
          <input
            className="delivery-input"
            type="text"
            placeholder="Location"
          />
          <input
            className="delivery-input"
            type="text"
            placeholder="Destination"
          />
          <input
            className="delivery-input"
            type="text"
            placeholder="Description"
          />
          <input
            className="delivery-input"
            type="number"
            placeholder="Price in CHF"
          />
          <input
            className="delivery-input"
            type="number"
            placeholder="Weight in Kg"
          />
          <input
            className="delivery-input"
            type="number"
            placeholder="Length"
          />
          <input
            className="delivery-input"
            type="number"
            placeholder="Height"
          />
          <input className="delivery-input" type="number" placeholder="Width" />
          <input
            className="delivery-input"
            type="datetime-local"
            placeholder="Pickup Time"
          />
        </div>
      </div>
      <div className="delivery-img-container">
        {!uploadedImage && (
          <>
            <input
              type="file"
              id="file-input"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="file-input" className="custom-file-upload">
              Upload image
            </label>
          </>
        )}
        {uploadedImage && (
          <div className="uploaded-image-container">
            <img
              className="deliveri-image"
              src={uploadedImage}
              alt="Uploaded"
            />
            <button className="delete-button" onClick={handleImageDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Delivery;
