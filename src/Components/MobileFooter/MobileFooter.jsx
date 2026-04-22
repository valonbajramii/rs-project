import React, { useState } from "react";
import "./MobileFooter.css";
import { ReactComponent as HouseIcon } from "../../icons/House.svg";
import houseicon from "../../icons/House.svg";
import { ReactComponent as MessageLeft } from "../../icons/message-bootstrap.svg";

import messageSquare from "../../icons/message-square.svg";
import { ReactComponent as Vector } from "../../icons/Vector2.svg";
// import Vector from "../../icons/Vector2.svg";
import { ReactComponent as ProfileIcon } from "../../icons/person-fill.svg";
import profileIcon from "../../icons/person-fill.svg";

const MobileFooter = ({ onFooterClick, activeIcon, hidden }) => {
  // const [activeIcon, setActiveIcon] = useState("icon1");

  // const showIcon1 = () => {
  //   setActiveIcon("icon1"); // Set 'form' as the active icon
  // };

  // const showIcon2 = () => {
  //   setActiveIcon("icon2"); // Set 'options' as the active icon
  // };

  // const showIcon3 = () => {
  //   setActiveIcon("icon3"); // Set 'form' as the active icon
  // };

  // const showIcon4 = () => {
  //   setActiveIcon("icon4"); // Set 'form' as the active icon
  // };

  const handleIconClick = (icon) => {
    if (icon === "icon1") {
      onFooterClick("form"); // Show the form
    } else if (icon === "icon2") {
      onFooterClick("options"); // Show delivery options
    } else if (icon === "icon3") {
      onFooterClick("messages"); // Add this case
    } else if (icon === "icon4") {
      onFooterClick("profile"); // Navigate to profile
    }
  };
  return (
    <div className={`mobile-footer-container ${hidden ? "hidden" : ""}`}>
      <HouseIcon
        onClick={() => handleIconClick("icon1")}
        className={`footer-icon1 ${activeIcon === "icon1" ? "active" : ""}`}
        alt="Home"
      />
      <Vector
        onClick={() => handleIconClick("icon2")}
        className={`footer-icon2 ${activeIcon === "icon2" ? "active" : ""}`}
        alt="Packages"
      />
      <MessageLeft
        onClick={() => handleIconClick("icon3")}
        className={`footer-icon3 ${activeIcon === "icon3" ? "active" : ""}`}
        alt="Messages"
      />
      <ProfileIcon
        onClick={() => handleIconClick("icon4")}
        className={`footer-icon4 ${activeIcon === "icon4" ? "active" : ""}`}
        alt="Profile"
      />
    </div>
  );
};

export default MobileFooter;
