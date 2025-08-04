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
import { authApi } from "../../API/api";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // In Login.js
  const handleLogin = async () => {
    try {
      const userData = await authApi.login({ email, password });
      console.log("Login successful, user data:", userData);

      setUser(userData); // Use the already normalized data from authApi.login
      navigate("/homepage");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <img
        className="login-sameway-logo"
        src={samewayLogo}
        alt="SameWay Logo"
      />
      <h2 className="login-h2">Login</h2>
      {error && <div className="error-message">{error}</div>}
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

// import React, { useState } from "react";
// import "./Login.css";
// import { Link, useNavigate } from "react-router-dom";
// import samewayLogo from "../../logo/sameway_logo.png";
// import { authApi } from "../../API/api";

// const Login = ({ setUser }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const response = await authApi.login({ email, password });

//       // Store the token in localStorage
//       localStorage.setItem("token", response.token);

//       // Store user data
//       const userData = {
//         email,
//         token: response.token,
//         IsProfileComplete: response.profileComplete,
//       };
//       localStorage.setItem("user", JSON.stringify(userData));

//       // Update user state
//       setUser(userData);

//       navigate("/homepage");
//     } catch (error) {
//       setError("Invalid email or password. Please try again.");
//     }
//   };

//   return (
//     <div className="container">
//       <img
//         className="login-sameway-logo"
//         src={samewayLogo}
//         alt="SameWay Logo"
//       />
//       <h2 className="login-h2">Login</h2>
//       {error && <div className="error-message">{error}</div>}
//       <div className="content-container">
//         <div className="input-container">
//           <div className="email-input-container">
//             <label className="login-label" htmlFor="email">
//               E-mail
//             </label>
//             <input
//               className="input"
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="password-input-container">
//             <label className="login-label" htmlFor="password">
//               Password
//             </label>
//             <input
//               className="input"
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="button-container">
//           <button className="button" onClick={handleLogin}>
//             LOGIN
//           </button>
//         </div>
//       </div>
//       <h3
//         className="forgot-password"
//         onClick={() => navigate("/resetpassword")}
//       >
//         Forgot Password ?
//       </h3>
//       <div className="login-h3">
//         <h3 style={{ fontWeight: "400" }}>Don't you have an account?</h3>
//         <Link style={{ textDecoration: "none" }} to="/register">
//           <h3 style={{ color: "rgb(76, 136, 248)" }}> Sign Up</h3>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Login;
