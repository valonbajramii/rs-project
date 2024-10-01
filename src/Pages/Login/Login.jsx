// import React from "react";
// import "./Login.css";
// import { Link } from "react-router-dom";

// const Login = () => {
//   return (
//     <div className="container">
//       <div className="content-container">
//         <h1>SW Logo</h1>
//         <div className="input-container">
//           <input className="input" placeholder="Username" />
//           <input className="input" type="password" placeholder="Password" />
//         </div>
//         <div className="button-container">
//           <button className="button">Login</button>
//           <Link style={{ textDecoration: "none" }} to="/register">
//             <button className="button">Register</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import samewayLogo from "../../logo/sameway_logo.png";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Retrieve stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Find user with matching email and password
    const matchedUser = storedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      // If user is found, set the user in state and navigate to profile
      setUser(matchedUser);
      navigate("/homepage");
    } else {
      alert("Invalid email or password!"); // Show error if no matching user is found
    }
  };

  return (
    <div className="container">
      <img className="login-sameway-logo" src={samewayLogo} />
      <h2 className="login-h2">Login</h2>
      <div className="content-container">
        <div className="input-container">
          <div className="email-input-container">
            <label className="login-label" htmlFor="email">
              E-mail
            </label>
            <input
              className="input"
              id="email"
              type="email"
              // placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="password-input-container">
            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              className="input"
              id="password"
              type="password"
              // placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="button-container">
          <button className="button" onClick={handleLogin}>
            LOGIN
          </button>
        </div>
      </div>
      <h3
        className="forgot-password"
        onClick={() => navigate("/resetpassword")}
      >
        Forgot Password ?
      </h3>
      <div className="login-h3">
        <h3 style={{ fontWeight: "400" }}>Don't you have an account?</h3>
        <Link style={{ textDecoration: "none" }} to="/register">
          <h3 style={{ color: "rgb(76, 136, 248)" }}> Sign Up</h3>
        </Link>
      </div>
    </div>
  );
};

export default Login;
