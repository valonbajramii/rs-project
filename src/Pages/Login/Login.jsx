import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container">
      <div className="content-container">
        <h1>SW Logo</h1>
        <div className="input-container">
          <input className="input" placeholder="Username" />
          <input className="input" type="password" placeholder="Password" />
        </div>
        <div className="button-container">
          <button className="button">Login</button>
          <Link style={{ textDecoration: "none" }} to="/register">
            <button className="button">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
