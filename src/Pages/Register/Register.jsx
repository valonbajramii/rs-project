import React from "react";
import "./Register.css";

const Register = () => {
  return (
    <div className="container">
      <div className="content-container">
        <h1>SW Logo</h1>
        <div className="input-container">
          <input className="input" placeholder="Name/Surname" />
          <input className="input" placeholder="Email" />
          <input className="input" placeholder="Mobilenumber" />
          <input className="input" type="password" placeholder="Password" />
          <input
            className="input"
            type="password"
            placeholder="Confirm Password"
          />
          <div className="checkbox-container">
            <input type="checkbox" id="accept-terms" className="checkbox" />
            <label htmlFor="accept-terms" className="checkbox-label">
              Accept AGB
            </label>
          </div>
        </div>
        <div className="button-container">
          <button className="button">Register</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
