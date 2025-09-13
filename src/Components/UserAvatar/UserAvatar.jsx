import React from "react";
import "./UserAvatar.css";

const UserAvatar = ({ user }) => {
  if (!user) return null;

  // If user has a profile image
  if (user.profileImage) {
    return (
      <div className="user-avatar">
        <img src={user.profileImage} alt="Profile" className="avatar-image" />
      </div>
    );
  }

  // Get first letter from various possible name fields
  const getFirstLetter = () => {
    if (user.fullName) return user.fullName.charAt(0).toUpperCase();
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const firstLetter = getFirstLetter();

  return <div className="user-avatar avatar-letter">{firstLetter}</div>;
};

export default UserAvatar;
