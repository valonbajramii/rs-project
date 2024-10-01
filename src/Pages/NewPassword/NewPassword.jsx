import React from "react";
import "./NewPassword.css";
import samewayLogo from "../../logo/sameway_logo.png";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="newpassword-container">
      <img className="newpassword-sameway-logo" src={samewayLogo} />
      <h2 className="login-h2">New Password</h2>
      <div className="newpassword-content-container">
        <div className="newpassword-input-container">
          <label className="newpassword-label" htmlFor="password">
            Password
          </label>
          <input
            className="newpassword-input"
            id="password"
            type="password"
            name="password"
            // value={formData.password}
            // onChange={handleChange}
          />
        </div>

        <div className="newpassword-input-container">
          <label className="newpassword-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="newpassword-input"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            // value={formData.confirmPassword}
            // onChange={handleChange}
          />
        </div>
        <button className="resetpassword-button" type="submit">
          RESET PASSWORD
        </button>
      </div>
      <p
        className="newpassword-back-to-login"
        onClick={() => navigate("/login")}
      >
        &lt; Back to Login
      </p>
    </div>
  );
};

export default NewPassword;
