// import React from "react";
// import "./UserAvatar.css";
// import { getProfileImageUrl } from "../../API/api"; // Import the function

// const UserAvatar = ({ user }) => {
//   if (!user) return null;

//   // If user has a profile image
//   if (user.profileImage) {
//     const imageUrl = getProfileImageUrl(user.profileImage);
//     return (
//       <div className="user-avatar">
//         <img src={imageUrl} alt="Profile" className="avatar-image" />
//       </div>
//     );
//   }

//   // Get first letter from various possible name fields
//   const getFirstLetter = () => {
//     if (user.fullName) return user.fullName.charAt(0).toUpperCase();
//     if (user.name) return user.name.charAt(0).toUpperCase();
//     if (user.email) return user.email.charAt(0).toUpperCase();
//     return "U";
//   };

//   const firstLetter = getFirstLetter();

//   return <div className="user-avatar avatar-letter">{firstLetter}</div>;
// };

// export default UserAvatar;

import React, { useState, useEffect } from "react";
import "./UserAvatar.css";
import { getProfileImageUrl, packagesApi } from "../../API/api";

const UserAvatar = ({ user }) => {
  const [userData, setUserData] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset state when user prop changes
  useEffect(() => {
    setUserData(user);
    setImageError(false);
    setIsLoading(false);
  }, [user]); // Reset when user prop changes

  useEffect(() => {
    const fetchUserData = async () => {
      // If we already have profile image or it's the current user, no need to fetch
      if (user?.profileImage || !user?.id) return;

      setIsLoading(true);
      try {
        // Fetch user data from API to get their profile image
        const userDetails = await packagesApi.getUser(user.id || user.email);
        setUserData(userDetails);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(user); // Fallback to original user data
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!userData) return null;

  // If user has a profile image and no error
  if (userData.profileImage && !imageError) {
    const imageUrl = getProfileImageUrl(userData.profileImage);
    return (
      <div className="user-avatar">
        <img
          src={imageUrl}
          alt="Profile"
          className="avatar-image"
          onError={(e) => {
            setImageError(true); // Set error state to trigger fallback
            e.target.style.display = "none";
          }}
          key={imageUrl} // Add key to force re-render when image changes
        />
      </div>
    );
  }

  // Get first letter from various possible name fields
  const getFirstLetter = () => {
    if (userData.fullName) return userData.fullName.charAt(0).toUpperCase();
    if (userData.name) return userData.name.charAt(0).toUpperCase();
    if (userData.email) return userData.email.charAt(0).toUpperCase();
    return "U";
  };

  const firstLetter = getFirstLetter();

  return <div className="user-avatar avatar-letter">{firstLetter}</div>;
};

export default UserAvatar;
