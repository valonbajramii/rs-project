import React from "react";
import "./UserAvatar.css"; // You'll need to create this CSS file

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

  // If no profile image, use first letter of name
  const firstLetter = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return <div className="user-avatar avatar-letter">{firstLetter}</div>;
};

export default UserAvatar;
