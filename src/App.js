// import "./App.css";
// import Login from "./Pages/Login/Login";
// import Register from "./Pages/Register/Register";
// import Address from "./Pages/Address/Address";
// import Profile from "./Pages/Profile/Profile";
// import MainComponent from "./Components/MainComponent/MainComponent";
// import Delivery from "./Components/Delivery/Delivery";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/address" element={<Address />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/maincomponent" element={<MainComponent />} />
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
import MainComponent from "./Components/MainComponent/MainComponent";
import Delivery from "./Components/Delivery/Delivery";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  const handleRegister = (userData) => {
    // Simulate saving user data (you can replace this with an actual API call)
    setUser({
      name: userData.name,
      email: userData.email,
      number: userData.mobileNumber,
      // Add more fields as needed
    });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
          <Route path="/address" element={<Address />} />
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/maincomponent" element={<MainComponent />} />
          <Route path="/delivery" element={<Delivery />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
