import React from "react";
import "./ResetPassword.css";
import samewayLogo from "../../logo/sameway_logo.png";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="resetpassword-container">
      <img className="resetpassword-sameway-logo" src={samewayLogo} />
      <h2>Reset Password</h2>
      <hj3 className="resetpassword-hj3">
        Lost your password? Please enter your email address. You will receive a
        link to create a new passord via email.
      </hj3>
      <div className="content-container">
        <div className="email-input-container">
          <label className="login-label" htmlFor="email">
            E-mail
          </label>
          <input
            className="input"
            id="email"
            type="email"
            // placeholder="Email"
            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button className="resetpassword-button" type="submit">
          SEND LINK
        </button>
      </div>
      <p
        className="resetpassword-back-to-login"
        onClick={() => navigate("/login")}
      >
        &lt; Back to Login
      </p>
    </div>
  );
};

export default ResetPassword;
