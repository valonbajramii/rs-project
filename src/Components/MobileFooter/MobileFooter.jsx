import React, { useState } from "react";
import "./MobileFooter.css";
import houseicon from "../../icons/House.svg";
import messageSquare from "../../icons/message-square.svg";
import Vector from "../../icons/Vector2.svg";
import profileIcon from "../../icons/person-fill.svg";

const MobileFooter = () => {
  const [activeIcon, setActiveIcon] = useState("icon1");

  const showIcon1 = () => {
    setActiveIcon("icon1"); // Set 'form' as the active icon
  };

  const showIcon2 = () => {
    setActiveIcon("icon2"); // Set 'options' as the active icon
  };

  const showIcon3 = () => {
    setActiveIcon("icon3"); // Set 'form' as the active icon
  };

  const showIcon4 = () => {
    setActiveIcon("icon4"); // Set 'form' as the active icon
  };

  return (
    <div className="mobile-footer-container">
      <img
        onClick={showIcon1}
        className={`footer-icon1 ${
          activeIcon === "icon1" ? "footer-active-icon" : ""
        }`}
        src={houseicon}
      />
      <img
        onClick={showIcon2}
        className={`footer-icon2 ${
          activeIcon === "icon2" ? "footer-active-icon" : ""
        }`}
        src={Vector}
      />
      <img
        onClick={showIcon3}
        className={`footer-icon3 ${
          activeIcon === "icon3" ? "footer-active-icon" : ""
        }`}
        src={messageSquare}
      />
      <img
        onClick={showIcon4}
        className={`footer-icon4 ${
          activeIcon === "icon4" ? "footer-active-icon" : ""
        }`}
        src={profileIcon}
      />
    </div>
  );
};

export default MobileFooter;
