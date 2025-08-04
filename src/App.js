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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          // Map backend PascalCase to frontend camelCase consistently
          id: parsedUser.Id || parsedUser.id,
          email: parsedUser.Email || parsedUser.email,
          fullName: parsedUser.FullName || parsedUser.fullName,
          dateOfBirth: parsedUser.DateOfBirth || parsedUser.dateOfBirth,
          streetAddress: parsedUser.StreetAddress || parsedUser.streetAddress,
          city: parsedUser.City || parsedUser.city,
          state: parsedUser.State || parsedUser.state,
          zipCode: parsedUser.ZipCode || parsedUser.zipCode,
          mobileNumber: parsedUser.MobileNumber || parsedUser.mobileNumber,
          idDocumentPath:
            parsedUser.IdDocumentPath || parsedUser.idDocumentPath,
          drivingLicensePath:
            parsedUser.DrivingLicensePath || parsedUser.drivingLicensePath,
          // Handle both PascalCase and camelCase for the flag
          isProfileComplete:
            parsedUser.IsProfileComplete ??
            parsedUser.isProfileComplete ??
            false,
          token: parsedUser.token,
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="App">
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
                <Profile user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/delivery"
            element={user ? <Delivery user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/address"
            element={user ? <Address user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/homepage"
            element={
              user ? (
                <HomePage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/complete-profile"
            element={
              user ? (
                user.isProfileComplete || user.IsProfileComplete ? (
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
