// import "./App.css";
// import Login from "./Pages/Login/Login";
// import Register from "./Pages/Register/Register";
// import Address from "./Pages/Address/Address";
// import Profile from "./Pages/Profile/Profile";
// import HomePage from "./Components/HomePage/HomePage";
// import Delivery from "./Components/Delivery/Delivery";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState } from "react";

// function App() {
//   const [user, setUser] = useState(null);
//   const [registrationData, setRegistrationData] = useState({});
//   const [step, setStep] = useState(1);

//   const handleRegisterStep1 = (userData) => {
//     setRegistrationData(userData);
//     setStep(2);
//   };

//   const handleRegisterStep2 = (addressData) => {
//     const completeData = { ...registrationData, ...addressData };
//     setUser(completeData);
//     setStep(1);
//   };

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/register"
//             element={
//               step === 1 ? (
//                 <Register onRegister={handleRegisterStep1} />
//               ) : (
//                 <Navigate to="/address" />
//               )
//             }
//           />
//           <Route
//             path="/address"
//             element={
//               step === 2 ? (
//                 <Address onRegister={handleRegisterStep2} />
//               ) : (
//                 <Navigate to="/register" />
//               )
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               user ? (
//                 <Profile user={user} setUser={setUser} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route path="/homepage" element={<HomePage user={user} />} />
//           <Route path="/delivery" element={<Delivery />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;

//////////////////////////////////////////////////////
// import "./App.css";
// import Login from "./Pages/Login/Login";
// import Register from "./Pages/Register/Register";
// import Address from "./Pages/Address/Address";
// import Profile from "./Pages/Profile/Profile";
// import HomePage from "./Components/HomePage/HomePage";
// import Delivery from "./Components/Delivery/Delivery";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// function App() {
//   const [user, setUser] = useState(null);
//   const [registrationData, setRegistrationData] = useState({});
//   const [step, setStep] = useState(1);

//   useEffect(() => {
//     // Check if user data is available in localStorage
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleRegisterStep1 = (userData) => {
//     setRegistrationData(userData);
//     setStep(2);
//   };

//   const handleRegisterStep2 = (addressData) => {
//     const completeData = { ...registrationData, ...addressData };

//     // Retrieve existing users from localStorage
//     const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

//     // Add the new user to the array
//     existingUsers.push(completeData);

//     // Save updated users list back to localStorage
//     localStorage.setItem("users", JSON.stringify(existingUsers));

//     // Set the current user
//     setUser(completeData);

//     setStep(1);
//   };

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login setUser={setUser} />} />
//           <Route
//             path="/register"
//             element={
//               step === 1 ? (
//                 <Register onRegister={handleRegisterStep1} />
//               ) : (
//                 <Navigate to="/address" />
//               )
//             }
//           />
//           <Route
//             path="/address"
//             element={
//               step === 2 ? (
//                 <Address onRegister={handleRegisterStep2} />
//               ) : (
//                 <Navigate to="/register" />
//               )
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               user ? (
//                 <Profile user={user} setUser={setUser} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route path="/homepage" element={<HomePage user={user} />} />
//           <Route path="/delivery" element={<Delivery />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import "./App.css";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Address from "./Pages/Address/Address";
import Profile from "./Pages/Profile/Profile";
import HomePage from "./Components/HomePage/HomePage";
import Delivery from "./Components/Delivery/Delivery";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import NewPassword from "./Pages/NewPassword/NewPassword";
import CompleteProfile from "./Pages/CompleteProfile/CompleteProfile";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { authApi } from "./API/api";
import { checkBrowserSupport } from "./utils/webglCheck"; // Add this import

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [browserSupport, setBrowserSupport] = useState({
    supported: true,
    issues: [],
  }); // Add this state

  useEffect(() => {
    console.log("App component mounted - checking auth state");

    // Check browser support first
    const support = checkBrowserSupport();
    setBrowserSupport(support);
    console.log("Browser support check:", support);

    if (!support.supported) {
      console.warn("Browser support issues:", support.issues);
      // You could show a warning to users here if needed
      if (support.issues.includes("WebGL not supported or disabled")) {
        console.warn("⚠️ WebGL issues may affect map rendering");
      }
    }

    const validateUserSession = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const validation = await authApi.validateToken();

        if (validation?.isValid) {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            ...parsedUser,
            isProfileComplete: parsedUser.isProfileComplete ?? false,
          });
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Session validation error:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    validateUserSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Add browser warning banner if needed
  const showBrowserWarning =
    !browserSupport.supported &&
    browserSupport.issues.includes("WebGL not supported or disabled");

  return (
    <div className="App">
      {showBrowserWarning && (
        <div className="browser-warning">
          <p>
            ⚠️ Your browser may have issues displaying maps.
            <a
              href="https://get.webgl.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "10px", color: "#2f80ed" }}
            >
              Check WebGL support
            </a>
          </p>
        </div>
      )}

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/homepage" : "/login"} />}
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/homepage" /> : <Login setUser={setUser} />
            }
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/homepage" /> : <Register />}
          />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile
                  user={user}
                  onLogout={handleLogout}
                  setUser={setUser}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/delivery"
            element={
              user ? (
                <Delivery
                  user={user}
                  onClose={() => setShowDeliveryForm(false)}
                  show={showDeliveryForm}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/address"
            element={user ? <Address user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/homepage"
            element={
              user ? (
                <HomePage
                  user={user}
                  setUser={setUser}
                  onLogout={handleLogout}
                  showDeliveryForm={showDeliveryForm}
                  setShowDeliveryForm={setShowDeliveryForm}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/complete-profile"
            element={
              user ? (
                user.isProfileComplete ? (
                  <Navigate to="/homepage" />
                ) : (
                  <CompleteProfile user={user} setUser={setUser} />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/newpassword" element={<NewPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

// import "./App.css";
// import Login from "./Pages/Login/Login";
// import Register from "./Pages/Register/Register";
// import Address from "./Pages/Address/Address";
// import Profile from "./Pages/Profile/Profile";
// import HomePage from "./Components/HomePage/HomePage";
// import Delivery from "./Components/Delivery/Delivery";
// import ResetPassword from "./Pages/ResetPassword/ResetPassword";
// import NewPassword from "./Pages/NewPassword/NewPassword";
// import CompleteProfile from "./Pages/CompleteProfile/CompleteProfile";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { authApi } from "./API/api";

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check for token and validate it
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (token && storedUser) {
//       // You might want to add token validation here
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route
//             path="/"
//             element={<Navigate to={user ? "/homepage" : "/login"} />}
//           />
//           <Route
//             path="/login"
//             element={
//               user ? <Navigate to="/homepage" /> : <Login setUser={setUser} />
//             }
//           />
//           <Route
//             path="/register"
//             element={user ? <Navigate to="/homepage" /> : <Register />}
//           />

//           <Route
//             path="/profile"
//             element={
//               user ? (
//                 <Profile user={user} onLogout={handleLogout} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />

//           <Route
//             path="/delivery"
//             element={user ? <Delivery user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/address"
//             element={user ? <Address user={user} /> : <Navigate to="/login" />}
//           />

//           <Route
//             path="/homepage"
//             element={
//               user ? (
//                 <HomePage user={user} onLogout={handleLogout} />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />
//           <Route
//             path="/complete-profile"
//             element={
//               user ? (
//                 user.IsProfileComplete ? (
//                   <Navigate to="/homepage" />
//                 ) : (
//                   <CompleteProfile user={user} setUser={setUser} />
//                 )
//               ) : (
//                 <Navigate to="/login" />
//               )
//             }
//           />

//           <Route path="/resetpassword" element={<ResetPassword />} />
//           <Route path="/newpassword" element={<NewPassword />} />
//         </Routes>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;
