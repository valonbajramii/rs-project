// import React, { useState, useEffect } from "react";
// import "./DeliveryForm.css";
// import { ReactComponent as MyLocationIcon } from "../../../icons/MyLocationIcon.svg";
// import Three from "../../../icons/Three.svg";
// import { ReactComponent as DestinationIcon } from "../../../icons/Destionation-icon.svg";
// import Clock from "../../../icons/Clock.svg";
// import swapIcon from "../../../icons/swapIcon.svg";
// import { useMediaQuery } from "react-responsive";

// const DeliveryForm = ({ updateFilterCriteria }) => {
//   // Local state to manage form input values
//   const [formValues, setFormValues] = useState({
//     location: "",
//     destination: "",
//     radius: "",
//     length: "",
//     height: "",
//     pickupTime: "",
//   });

//   const [selectedButton, setSelectedButton] = useState("");

//   const isMobile = useMediaQuery({ maxWidth: 480 });

//   // Handler to update form values and notify the parent component
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => {
//       const updatedValues = { ...prevValues, [name]: value };
//       updateFilterCriteria(updatedValues); // Notify parent with updated criteria
//       return updatedValues;
//     });
//   };

//   const handleButtonClick = (button) => {
//     setSelectedButton(button);
//   };

//   return (
//     <div className="form-container">
//       {/* Desktop layout - separate elements */}
//       {!isMobile && (
//         <>
//           <h2 className="form-h2">Where are you going today?</h2>
//         </>
//       )}

//       {/* Mobile layout - header container */}
//       {isMobile && (
//         <div className="mobile-header-container">
//           <h2 className="form-h2">Where are you going today?</h2>
//           <p className="form-p2">See All Places</p>
//         </div>
//       )}

//       <div className="input-icons-container">
//         <div className="form-icons-container">
//           <MyLocationIcon
//             className={`my-location-icon ${
//               formValues.location ? "active" : ""
//             }`}
//           />
//           <img
//             className={`three ${formValues.destination ? "active" : ""}`}
//             src={Three}
//           />
//           <DestinationIcon
//             className={`destination-icon ${
//               formValues.destination ? "active" : ""
//             }`}
//           />
//         </div>
//         <div className="form-inputs-container">
//           <input
//             className="form-input"
//             type="text"
//             name="location"
//             placeholder="My Location"
//             value={formValues.location}
//             onChange={handleChange}
//           />
//           <input
//             className="form-input"
//             type="text"
//             name="destination"
//             placeholder="Destination"
//             value={formValues.destination}
//             onChange={handleChange}
//           />
//         </div>
//         {isMobile && (
//           <img src={swapIcon} alt="Swap Icon" className="mobile-only-icon" />
//         )}
//       </div>
//       <div className="form-buttons-container">
//         <button
//           className={`form-button ${selectedButton === "Home" ? "active" : ""}`}
//           onClick={() => handleButtonClick("Home")}
//         >
//           Home
//         </button>
//         <button
//           className={`form-button ${selectedButton === "Work" ? "active" : ""}`}
//           onClick={() => handleButtonClick("Work")}
//         >
//           Work
//         </button>
//         <button
//           className={`form-button ${
//             selectedButton === "Other" ? "active" : ""
//           }`}
//           onClick={() => handleButtonClick("Other")}
//         >
//           Other
//         </button>
//       </div>
//       <div className="last-location-container">
//         <img className="clock" src={Clock} />
//         <div className="form-text-container">
//           <h3 className="form-h3">Sette Restaurant</h3>
//           <p className="form-p">Rr, Nr.255 Agim Ramadani, Prishtina 10000</p>
//         </div>
//       </div>

//       {/* Desktop - Show "See All Places" at bottom */}
//       {!isMobile && <p className="form-p2">See All Places</p>}

//       <button className="form-confirm-button">Confirm</button>
//     </div>
//   );
// };

// export default DeliveryForm;

import React, { useState, useEffect } from "react";
import "./DeliveryForm.css";
import { ReactComponent as MyLocationIcon } from "../../../icons/MyLocationIcon.svg";
import Three from "../../../icons/Three.svg";
import { ReactComponent as DestinationIcon } from "../../../icons/Destionation-icon.svg";
import Clock from "../../../icons/Clock.svg";
import swapIcon from "../../../icons/swapIcon.svg";
import { useMediaQuery } from "react-responsive";

const DeliveryForm = ({ updateFilterCriteria, onConfirmRoute }) => {
  const [formValues, setFormValues] = useState({
    location: "",
    destination: "",
    radius: "",
    length: "",
    height: "",
    pickupTime: "",
  });

  const [selectedButton, setSelectedButton] = useState("");
  const isMobile = useMediaQuery({ maxWidth: 480 });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [name]: value };
      updateFilterCriteria(updatedValues);
      return updatedValues;
    });
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const handleConfirmClick = () => {
    if (formValues.location && formValues.destination) {
      if (onConfirmRoute) {
        onConfirmRoute(formValues.location, formValues.destination);
      }
    } else {
      alert("Please enter both location and destination");
    }
  };

  return (
    <div className="form-container">
      {!isMobile && (
        <>
          <h2 className="form-h2">Where are you going today?</h2>
        </>
      )}

      {isMobile && (
        <div className="mobile-header-container">
          <h2 className="form-h2">Where are you going today?</h2>
          <p className="form-p2">See All Places</p>
        </div>
      )}

      <div className="input-icons-container">
        <div className="form-icons-container">
          <MyLocationIcon
            className={`my-location-icon ${
              formValues.location ? "active" : ""
            }`}
          />
          <img
            className={`three ${formValues.destination ? "active" : ""}`}
            src={Three}
          />
          <DestinationIcon
            className={`destination-icon ${
              formValues.destination ? "active" : ""
            }`}
          />
        </div>
        <div className="form-inputs-container">
          <input
            className="form-input"
            type="text"
            name="location"
            placeholder="My Location"
            value={formValues.location}
            onChange={handleChange}
          />
          <input
            className="form-input"
            type="text"
            name="destination"
            placeholder="Destination"
            value={formValues.destination}
            onChange={handleChange}
          />
        </div>
        {isMobile && (
          <img src={swapIcon} alt="Swap Icon" className="mobile-only-icon" />
        )}
      </div>
      <div className="form-buttons-container">
        <button
          className={`form-button ${selectedButton === "Home" ? "active" : ""}`}
          onClick={() => handleButtonClick("Home")}
        >
          Home
        </button>
        <button
          className={`form-button ${selectedButton === "Work" ? "active" : ""}`}
          onClick={() => handleButtonClick("Work")}
        >
          Work
        </button>
        <button
          className={`form-button ${
            selectedButton === "Other" ? "active" : ""
          }`}
          onClick={() => handleButtonClick("Other")}
        >
          Other
        </button>
      </div>
      <div className="last-location-container">
        <img className="clock" src={Clock} />
        <div className="form-text-container">
          <h3 className="form-h3">Sette Restaurant</h3>
          <p className="form-p">Rr, Nr.255 Agim Ramadani, Prishtina 10000</p>
        </div>
      </div>

      {!isMobile && <p className="form-p2">See All Places</p>}

      <button className="form-confirm-button" onClick={handleConfirmClick}>
        Confirm
      </button>
    </div>
  );
};

export default DeliveryForm;
