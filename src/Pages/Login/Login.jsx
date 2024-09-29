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
      <div className="content-container">
        <h1>SW Logo</h1>
        <div className="input-container">
          {/* <label className="login-label">E-mail</label> */}
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <label className="login-label">Password</label> */}
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button className="button" onClick={handleLogin}>
            Login
          </button>
          <Link style={{ textDecoration: "none" }} to="/register">
            <button className="button">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
