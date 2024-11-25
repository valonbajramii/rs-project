// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; // Import axios
// import "./Register.css";
// import samewayLogo from "../../logo/sameway_logo.png";

// const Register = ({ onRegister }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     acceptTerms: false,
//   });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     // Log the data before sending
//     console.log("Sending registration data:", {
//       name: formData.name,
//       email: formData.email,
//       password: formData.password,
//     });

//     try {
//       const response = await axios.post(
//         "https://localhost:7273/api/users/register",
//         {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//         }
//       );

//       console.log("User registered successfully:", response.data);
//       navigate("/homepage");
//     } catch (error) {
//       console.error("Error registering the user:", error);
//       if (error.response) {
//         console.log("Server responded with:", error.response.data); // Log the validation errors
//         console.log("Status code:", error.response.status);
//         if (error.response.data.errors) {
//           console.log("Validation errors:", error.response.data.errors); // Log validation details
//         }
//       } else if (error.request) {
//         console.log("Request made but no response received:", error.request);
//       } else {
//         console.log("Error setting up the request:", error.message);
//       }
//       alert("There was an issue with registration. Please try again.");
//     }
//   };

//   return (
//     <div className="register-container">
//       <img className="register-sameway-logo" src={samewayLogo} alt="Logo" />
//       <h2 className="register-h2">Sign up</h2>
//       <div className="register-content-container">
//         <form className="register-input-container" onSubmit={handleSubmit}>
//           <div className="register-input-container">
//             <label className="register-label" htmlFor="name">
//               Name/Surname
//             </label>
//             <input
//               className="register-input"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="register-input-container">
//             <label className="register-label" htmlFor="email">
//               Email
//             </label>
//             <input
//               className="register-input"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="register-input-container">
//             <label className="register-label" htmlFor="password">
//               Password
//             </label>
//             <input
//               className="register-input"
//               id="password"
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="register-input-container">
//             <label className="register-label" htmlFor="confirmPassword">
//               Confirm Password
//             </label>
//             <input
//               className="register-input"
//               id="confirmPassword"
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="button-container">
//             <button className="register-button" type="submit">
//               Register Account
//             </button>
//           </div>
//         </form>
//       </div>
//       <p className="back-to-login" onClick={() => navigate("/login")}>
//         &lt; Back to Login
//       </p>
//     </div>
//   );
// };

// export default Register;

///////////////////////////////////////////////////////////WITHOUT AXIOS BELOW:

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import samewayLogo from "../../logo/sameway_logo.png";

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation here
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Call the onRegister function passed as a prop
    onRegister(formData);
    navigate("/homepage");
  };

  return (
    <div className="register-container">
      <img className="register-sameway-logo" src={samewayLogo} />
      <h2 className="register-h2">Sign up</h2>
      <div className="register-content-container">
        <form className="register-input-container" onSubmit={handleSubmit}>
          <div className="register-input-container">
            <label className="register-label" htmlFor="name">
              Name/Surname
            </label>
            <input
              className="register-input"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="register-input-container">
            <label className="register-label" htmlFor="email">
              Email
            </label>
            <input
              className="register-input"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* <div className="input-container">
            <label className="register-label" htmlFor="mobileNumber">
              Mobile Number
            </label>
            <input
              className="register-input"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div> */}

          <div className="register-input-container">
            <label className="register-label" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <input
              className="register-input"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="register-input-container">
            <label className="register-label" htmlFor="password">
              Password
            </label>
            <input
              className="register-input"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="register-input-container">
            <label className="register-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="register-input"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {/* <div className="checkbox-container">
            <input
              type="checkbox"
              id="accept-terms"
              className="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
            />
            <label htmlFor="accept-terms" className="checkbox-label">
              Accept AGB
            </label>
          </div> */}
          <div className="button-container">
            <button className="register-button" type="submit">
              Register Account
            </button>
          </div>
        </form>
      </div>
      <p className="back-to-login" onClick={() => navigate("/login")}>
        &lt; Back to Login
      </p>
    </div>
  );
};

export default Register;

///////////////////////////////////////////////////////////////

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Register.css";

// const Register = ({ onRegister }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     dateOfBirth: "",
//     password: "",
//     confirmPassword: "",
//     acceptTerms: false,
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Perform validation here
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }
//     // Call the onRegister function passed as a prop
//     onRegister(formData);
//     navigate("/address");
//   };

//   return (
//     <div className="register-container">
//       <h1 className="register-title">Sign Up</h1>
//       <form className="register-form" onSubmit={handleSubmit}>
//         <input
//           className="input-field"
//           placeholder="Full Name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//         />
//         <input
//           className="input-field"
//           type="email"
//           placeholder="E-mail"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         <input
//           className="input-field"
//           placeholder="Date of birth"
//           name="dateOfBirth"
//           value={formData.dateOfBirth}
//           onChange={handleChange}
//         />
//         <input
//           className="input-field"
//           type="password"
//           placeholder="Password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//         />
//         <input
//           className="input-field"
//           type="password"
//           placeholder="Confirm Password"
//           name="confirmPassword"
//           value={formData.confirmPassword}
//           onChange={handleChange}
//         />
//         <button className="register-button" type="submit">
//           Register Account
//         </button>
//       </form>
//       <p className="back-to-login" onClick={() => navigate("/login")}>
//         &lt; Back to Login
//       </p>
//     </div>
//   );
// };

// export default Register;
