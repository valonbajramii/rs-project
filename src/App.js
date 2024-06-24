import "./App.css";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Address from "./Pages/Address/Address";
import Profile from "./Pages/Profile/Profile";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/address" element={<Address />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
