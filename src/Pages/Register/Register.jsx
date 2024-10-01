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
    navigate("/address");
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
