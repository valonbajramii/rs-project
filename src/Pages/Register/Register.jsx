// import React from "react";
// import "./Register.css";

// const Register = () => {
//   return (
//     <div className="container">
//       <div className="content-container">
//         <h1>SW Logo</h1>
//         <div className="input-container">
//           <input className="input" placeholder="Name/Surname" />
//           <input className="input" placeholder="Email" />
//           <input className="input" placeholder="Mobilenumber" />
//           <input className="input" type="password" placeholder="Password" />
//           <input
//             className="input"
//             type="password"
//             placeholder="Confirm Password"
//           />
//           <div className="checkbox-container">
//             <input type="checkbox" id="accept-terms" className="checkbox" />
//             <label htmlFor="accept-terms" className="checkbox-label">
//               Accept AGB
//             </label>
//           </div>
//         </div>
//         <div className="button-container">
//           <button className="button">Register</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Register.css";

// const Register = ({ onRegister }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
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
//     navigate("/profile");
//   };

//   return (
//     <div className="container">
//       <div className="content-container">
//         <h1>SW Logo</h1>
//         <form className="input-container" onSubmit={handleSubmit}>
//           <input
//             className="input"
//             placeholder="Name/Surname"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//           />
//           <input
//             className="input"
//             placeholder="Email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <input
//             className="input"
//             placeholder="Mobilenumber"
//             name="mobileNumber"
//             value={formData.mobileNumber}
//             onChange={handleChange}
//           />
//           <input
//             className="input"
//             type="password"
//             placeholder="Password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//           />
//           <input
//             className="input"
//             type="password"
//             placeholder="Confirm Password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//           />
//           <div className="checkbox-container">
//             <input
//               type="checkbox"
//               id="accept-terms"
//               className="checkbox"
//               name="acceptTerms"
//               checked={formData.acceptTerms}
//               onChange={handleChange}
//             />
//             <label htmlFor="accept-terms" className="checkbox-label">
//               Accept AGB
//             </label>
//           </div>
//           <div className="button-container">
//             <button className="button" type="submit">
//               Register
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

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
    <div className="container">
      <div className="content-container">
        <h1>SW Logo</h1>
        <form className="input-container" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Name/Surname"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Mobilenumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
          <input
            className="input"
            placeholder="Date of birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="input"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <div className="checkbox-container">
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
          </div>
          <div className="button-container">
            <button className="button" type="submit">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
