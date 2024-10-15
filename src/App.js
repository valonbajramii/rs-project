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

import "./App.css";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Address from "./Pages/Address/Address";
import Profile from "./Pages/Profile/Profile";
import HomePage from "./Components/HomePage/HomePage";
import Delivery from "./Components/Delivery/Delivery";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import NewPassword from "./Pages/NewPassword/NewPassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleRegister = (userData) => {
    // Save user data to localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    existingUsers.push(userData);
    localStorage.setItem("users", JSON.stringify(existingUsers));
    setUser(userData);
  };

  const requireAddress = !user?.address; // Check if the user has provided an address

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/delivery"
            element={
              user ? (
                requireAddress ? (
                  <Navigate to="/address" />
                ) : (
                  <Delivery />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/address"
            element={
              user ? (
                <Address user={user} setUser={setUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/homepage"
            element={
              user ? (
                <HomePage user={user} setUser={setUser} />
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
