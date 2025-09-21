import React, { useState, useRef, useEffect, useCallback } from "react";
import "./HomePage.css";
import DeliveryForm from "./DeliveryForm/DeliveryForm";
import DeliveryOptions from "./DeliveryOptions/DeliveryOptions";
import DeliveryMap from "./DeliveryMap/DeliveryMap";
import Delivery from "../Delivery/Delivery";
import Profile from "../../Pages/Profile/Profile";
import profileImg from "../../icons/person-fill.svg";
import chevronDown from "../../icons/chevron-down.svg";
import addDeliveryIcon from "../../icons/plus-circle-dotted.svg";
import { useNavigate, useLocation } from "react-router-dom";
import audiImage from "../../images/2025_audi_q7_4dr-suv_prestige_fq_oem_1_1600.avif";
import mercedesImage from "../../images/2023-mercedes-amg-c63-s-e-performance-114-65d79698b0e26.avif";
import MyProductModal from "./MyProductModal/MyProductModal";
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from "react-bootstrap";
import FavoritedeliveryModal from "../FavoritedeliveryModal/FavoritedeliveryModal";
import carIcon from "../../icons/car-front-outlined.svg";
import Vector from "../../icons/Vector2.svg";
import samewayLogo from "../../logo/sameway_logo.png";
import { useMediaQuery } from "react-responsive";
import MobileFooter from "../MobileFooter/MobileFooter";
import UserAvatar from "../UserAvatar/UserAvatar";
import heartIcon from "../../icons/HeartShape.svg";
import manageAcc from "../../icons/manageAccIcon.svg";
import keyIcon from "../../icons/Key-icon.svg";
import logOutIcon from "../../icons/logoutIcon.svg";
import bellIcon from "../../icons/bell-fill.svg";
import DeliveryInfoPanel from "../DeliveryInfoPanel/DeliveryInfoPanel";
import MobileNotifications from "../MobileNotifications/MobileNotifications";
import editIcon from "../../icons/edit.svg";
import Chat from "../Chat/Chat";
import { packagesApi, transportApi, messagesApi } from "../../API/api";

const HomePage = ({ user, setUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 480 });

  // State variables
  const [isRequestsDropdownOpen, setIsRequestsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isAddPackageView, setIsAddPackageView] = useState(false);
  const [activeMessagesTab, setActiveMessagesTab] = useState("notifications");
  const [selectedChatContact, setSelectedChatContact] = useState(null);
  const [showChatView, setShowChatView] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [isInMessageView, setIsInMessageView] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFavoritedeliveryModal, setIsFavoritedeliveryModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef(null);
  const hasFetchedRef = useRef(false); // Use ref instead of state for fetch tracking
  const [showForm, setShowForm] = useState(location.state?.showForm ?? true);
  const [activeIcon, setActiveIcon] = useState(
    location.state?.showForm === false ? "icon2" : "icon1"
  );

  // Function to refresh packages from API - FIXED
  const refreshPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await packagesApi.getPackages();

      console.log("Raw packages response:", response);

      let packagesArray = [];
      if (Array.isArray(response)) {
        packagesArray = response;
      } else if (response?.$values && Array.isArray(response.$values)) {
        packagesArray = response.$values;
      }

      console.log("Packages array:", packagesArray);

      // Separate actual packages from references
      const actualPackages = packagesArray.filter(
        (item) => item && item.id && item.name
      );
      const references = packagesArray.filter(
        (item) => item && item.$ref && !item.id
      );

      console.log("Actual packages:", actualPackages);
      console.log("References:", references);

      // Resolve references if any
      let resolvedReferences = [];
      if (references.length > 0) {
        console.log("Resolving references...");
        resolvedReferences = await packagesApi.resolveReferences(references);
        console.log("Resolved references:", resolvedReferences);
      }

      // Combine actual packages with resolved references
      const allPackages = [...actualPackages, ...resolvedReferences];

      // Remove duplicates
      const uniquePackages = allPackages.filter(
        (pkg, index, array) => array.findIndex((p) => p.id === pkg.id) === index
      );

      console.log("All packages after resolving:", uniquePackages);

      // Transform packages
      const transformedPackages = uniquePackages.map((item) => ({
        id: item.id,
        name: item.name,
        imagePaths: item.imagePaths || [], // ← FIXED: Changed from images to imagePaths
        price: item.price?.toString() || "0",
        location: item.location || "",
        destination: item.destination || "",
        description: item.description || "",
        weightinKg: item.weight || item.weightinKg || "0",
        length: item.length || 0,
        height: item.height || 0,
        width: item.width || 0,
        deadline: item.deadline || "",
        createdBy: item.userId || item.createdBy || "",
      }));

      console.log("Transformed packages:", transformedPackages);

      setDeliveryOptions(transformedPackages);
      setFilteredOptions(transformedPackages);
    } catch (error) {
      console.error("Failed to refresh packages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load packages on component mount - only once - FIXED
  useEffect(() => {
    refreshPackages();
  }, [refreshPackages, user?.id]); // Refresh when user ID changes

  // Handler to add a new delivery
  const addNewDelivery = useCallback(
    async (newDelivery) => {
      try {
        const response = await packagesApi.createPackage(newDelivery);
        console.log("Package creation response:", response);

        // Transform the response to match your package format
        const transformedPackage = {
          id: response.id,
          name: response.name,
          imagePaths: response.imagePaths || [],
          price: response.price?.toString() || "0",
          location: response.location || "",
          destination: response.destination || "",
          description: response.description || "",
          weightinKg: response.weight || response.weightinKg || "0",
          length: response.length || 0,
          height: response.height || 0,
          width: response.width || 0,
          deadline: response.deadline || "",
          createdBy:
            response.userId ||
            response.createdBy ||
            newDelivery.createdBy ||
            "",
        };

        console.log("Transformed new package:", transformedPackage);

        // Add the new package to both deliveryOptions and filteredOptions
        setDeliveryOptions((prev) => [...prev, transformedPackage]);
        setFilteredOptions((prev) => [...prev, transformedPackage]);

        // Also refresh the packages to ensure we have the latest data
        setTimeout(() => {
          refreshPackages();
        }, 1000);

        return response;
      } catch (error) {
        console.error("Failed to create package:", error);

        // Handle duplicate name error specifically
        if (
          error.message &&
          error.message.includes("duplicate key") &&
          error.message.includes("IX_Packages_Name_UserId")
        ) {
          throw new Error(
            "You already have a package with this name. Please choose a different name."
          );
        }

        throw error;
      }
    },
    [refreshPackages]
  );

  // Function to filter delivery options based on filter criteria
  useEffect(() => {
    const applyFilters = () => {
      let filtered = deliveryOptions;

      if (filterCriteria.location) {
        filtered = filtered.filter((option) =>
          option.location
            .toLowerCase()
            .includes(filterCriteria.location.toLowerCase())
        );
      }

      if (filterCriteria.destination) {
        filtered = filtered.filter((option) =>
          option.destination
            .toLowerCase()
            .includes(filterCriteria.destination.toLowerCase())
        );
      }

      if (filterCriteria.length) {
        filtered = filtered.filter(
          (option) => parseInt(option.length) >= parseInt(filterCriteria.length)
        );
      }

      if (filterCriteria.height) {
        filtered = filtered.filter(
          (option) => parseInt(option.height) >= parseInt(filterCriteria.height)
        );
      }

      if (filterCriteria.pickupTime) {
        filtered = filtered.filter(
          (option) =>
            new Date(option.pickupTim) >= new Date(filterCriteria.pickupTime)
        );
      }

      setFilteredOptions(filtered);
    };

    applyFilters();
  }, [filterCriteria, deliveryOptions]);

  // Function to update filter criteria
  const updateFilterCriteria = useCallback((criteria) => {
    setFilterCriteria(criteria);
  }, []);

  // Handler to delete a delivery
  const deleteDelivery = useCallback(
    (deletedDelivery) => {
      const updatedDeliveryOptions = deliveryOptions.filter(
        (delivery) => delivery.id !== deletedDelivery.id
      );
      setDeliveryOptions(updatedDeliveryOptions);
      setFilteredOptions(updatedDeliveryOptions);
    },
    [deliveryOptions]
  );

  // Edit delivery handler
  const editDelivery = useCallback(
    (updatedDelivery) => {
      const updatedOptions = deliveryOptions.map((delivery) =>
        delivery.id === updatedDelivery.id ? updatedDelivery : delivery
      );
      setDeliveryOptions(updatedOptions);
      setFilteredOptions(updatedOptions);
    },
    [deliveryOptions]
  );

  // Pending requests logic - FETCH FROM BACKEND
  const fetchPendingRequests = useCallback(async () => {
    try {
      if (!user?.id) {
        console.log("❌ No user ID available");
        return;
      }

      console.log("📡 Fetching owner requests for user:", user.id);

      try {
        const response = await transportApi.getOwnerRequests(user.id);
        console.log("📦 Owner requests from API:", response);

        if (!response) {
          console.log("❌ No requests returned");
          setPendingRequests([]);
          return;
        }

        // Handle different response formats
        let requestsArray = [];
        if (Array.isArray(response)) {
          requestsArray = response;
        } else if (response?.$values && Array.isArray(response.$values)) {
          requestsArray = response.$values;
        } else if (response.data && Array.isArray(response.data)) {
          requestsArray = response.data;
        }

        console.log("📋 Processed requests array:", requestsArray);

        // Filter for pending requests only
        const pending = requestsArray.filter((request) => {
          const status = request.status || request.Status;
          return status === "Pending" || status === "pending" || status === 0;
        });

        console.log("⏳ Filtered pending requests:", pending);

        // Transform to match your frontend format with proper field mapping
        const transformedPending = await Promise.all(
          pending.map(async (request) => {
            // Handle different field name variations
            const requestId = request.id || request.Id || request.requestId;
            const packageId = request.packageId || request.PackageId;

            // Try to get package name from multiple possible sources
            let packageName = request.packageName || request.PackageName;

            // If package name is not available, try to fetch it from the API
            if (!packageName && packageId) {
              try {
                const packageDetails = await packagesApi.getPackageById(
                  packageId
                );
                packageName =
                  packageDetails.name ||
                  packageDetails.Name ||
                  "Unknown Package";
              } catch (error) {
                console.error("Error fetching package details:", error);
                packageName = "Unknown Package";
              }
            }

            const requesterEmail =
              request.requesterEmail || request.RequesterEmail;
            const requesterName =
              request.requesterName || request.RequesterName;
            const requesterProfileImage =
              request.requesterProfileImage || request.RequesterProfileImage;
            const status = request.status || request.Status;
            const timestamp =
              request.requestDate || request.RequestDate || request.createdAt;

            return {
              requestId: requestId,
              deliveryId: packageId,
              deliveryName: packageName || "Package Delivery", // Fallback name
              requester: requesterEmail,
              requesterName: requesterName,
              requesterProfileImage: requesterProfileImage,
              status: status,
              timestamp: timestamp,
            };
          })
        );

        console.log("🔄 Transformed pending requests:", transformedPending);
        setPendingRequests(transformedPending);
      } catch (apiError) {
        console.error("❌ API Error:", apiError);
        // For development, use user-specific mock data
        const userRequestsKey = `pendingRequests_${user.id}`;
        const fallbackRequests = JSON.parse(
          localStorage.getItem(userRequestsKey) || "[]"
        );
        setPendingRequests(fallbackRequests);
      }
    } catch (error) {
      console.error("❌ Error in fetchPendingRequests:", error);
      setPendingRequests([]);
    }
  }, [user?.id]); // Add dependencies here

  // Then update your useEffect to use the function
  useEffect(() => {
    fetchPendingRequests();

    // Set up polling to check for new requests every 30 seconds
    const intervalId = setInterval(fetchPendingRequests, 30000);

    return () => clearInterval(intervalId);
  }, [fetchPendingRequests]); // Add fetchPendingRequests to dependencies

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      const notificationsDropdown = document.querySelector(
        ".notifications-dropdown-container"
      );
      if (
        notificationsDropdown &&
        !notificationsDropdown.contains(event.target)
      ) {
        setIsRequestsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isRequestsDropdownOpen]);

  // Helper functions
  const addChatContact = useCallback((contact) => {
    const storedContacts =
      JSON.parse(localStorage.getItem("chatContacts")) || [];
    const contactExists = storedContacts.some((c) => c.email === contact.email);

    if (!contactExists) {
      const updatedContacts = [...storedContacts, contact];
      localStorage.setItem("chatContacts", JSON.stringify(updatedContacts));
    }
  }, []);

  const getRequesterInfo = useCallback((requesterEmail) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const requester = users.find((user) => user.email === requesterEmail);

    return (
      requester || {
        email: requesterEmail,
        name: requesterEmail.split("@")[0],
        profileImage: null,
      }
    );
  }, []);

  const formatRelativeTime = useCallback((timestamp) => {
    if (!timestamp) return "Just now";

    let requestTime;

    // Handle different timestamp formats
    if (typeof timestamp === "string") {
      requestTime = new Date(timestamp);
    } else if (typeof timestamp === "number") {
      requestTime = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      requestTime = timestamp;
    } else {
      return "Just now";
    }

    // Check if the date is valid
    if (isNaN(requestTime.getTime())) {
      return "Just now";
    }

    const now = new Date();
    const seconds = Math.floor((now - requestTime) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return `${interval} year${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} month${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} min${interval === 1 ? "" : "s"} ago`;

    return "Just now";
  }, []);

  // Request action handler
  // In HomePage.js, update handleRequestAction
  const handleRequestAction = useCallback(
    async (requestId, action) => {
      try {
        console.log("🔄 Updating request:", {
          requestId,
          type: typeof requestId,
          action: action,
        });

        // Validate requestId exists and is a number
        if (!requestId) {
          console.error("❌ Request ID is null/undefined:", requestId);
          alert("Invalid request ID");
          return;
        }

        const parsedId = parseInt(requestId);
        console.log("📊 Parsed ID:", parsedId, "Is NaN:", isNaN(parsedId));

        if (isNaN(parsedId)) {
          console.error("❌ Invalid request ID (not a number):", requestId);
          alert("Invalid request ID");
          return;
        }

        const status = action === "approve" ? "Accepted" : "Rejected";

        // Call the API to update the request status
        console.log("📡 Calling API with:", { requestId: parsedId, status });
        const response = await transportApi.updateRequestStatus(
          parsedId,
          status
        );
        console.log("✅ API response:", response);

        // If request was approved, create chat relationship
        if (action === "approve") {
          try {
            // Find the request details to get both users info
            const request = pendingRequests.find(
              (req) => req.requestId === requestId
            );

            if (request) {
              // Add the requester to chat contacts for BOTH users
              const requesterContact = {
                id: request.requesterId || request.requester,
                email: request.requester,
                name: request.requesterName || request.requester.split("@")[0],
                profileImage: request.requesterProfileImage,
              };

              const ownerContact = {
                id: user.id, // Current user (the one approving)
                email: user.email,
                name: user.fullName || user.name,
                profileImage: user.profileImage,
              };

              // Add to localStorage for immediate access for BOTH users
              const addContactToStorage = (userId, contact) => {
                const userContactsKey = `chatContacts_${userId}`;
                const storedContacts = JSON.parse(
                  localStorage.getItem(userContactsKey) || "[]"
                );

                const contactExists = storedContacts.some(
                  (c) => c.id === contact.id || c.email === contact.email
                );

                if (!contactExists) {
                  const updatedContacts = [...storedContacts, contact];
                  localStorage.setItem(
                    userContactsKey,
                    JSON.stringify(updatedContacts)
                  );
                }
              };

              // Add requester to owner's contacts
              addContactToStorage(user.id, requesterContact);

              // Add owner to requester's contacts (simulate this for the other user)
              // This would ideally be done via API or when the other user logs in
              console.log("✅ Chat relationship created for both users");
            }
          } catch (contactError) {
            console.error("Error creating chat relationship:", contactError);
          }
        }

        // Update local state
        setPendingRequests((prev) =>
          prev.filter((req) => req.requestId !== requestId)
        );

        alert(
          `Request ${
            action === "approve" ? "approved" : "rejected"
          } successfully`
        );
      } catch (error) {
        console.error("❌ Error updating request:", error);
        alert(
          "Failed to update request status: " +
            (error.response?.data?.message || error.message)
        );
      }
    },
    [fetchPendingRequests, pendingRequests] // Add pendingRequests to dependencies
  );

  // Toggle functions
  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const toggleProductModal = useCallback(() => {
    setIsProductModalOpen(!isProductModalOpen);
  }, [isProductModalOpen]);

  const toggleFavoritedeliveryModal = useCallback(() => {
    setIsFavoritedeliveryModal(!isFavoritedeliveryModal);
  }, [isFavoritedeliveryModal]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    onLogout(null);
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate, onLogout]);

  // View handlers
  const showDeliveryForm = useCallback(() => {
    setShowForm(true);
    setActiveIcon("form");
  }, []);

  const showDeliveryOptions = useCallback(() => {
    setShowForm(false);
    setActiveIcon("options");
  }, []);

  const handleFooterClick = useCallback((view) => {
    if (view === "form") {
      setShowForm(true);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(false);
      setIsInMessageView(false);
      setActiveIcon("icon1");
    } else if (view === "options") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(false);
      setIsInMessageView(false);
      setActiveIcon("icon2");
    } else if (view === "add") {
      setShowForm(false);
      setIsAddPackageView(true);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(false);
      setIsInMessageView(false);
      setActiveIcon("icon3");
    } else if (view === "profile") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(true);
      setShowNotifications(false);
      setShowChatView(false);
      setIsInMessageView(false);
      setActiveIcon("icon4");
    } else if (view === "messages") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(true);
      setShowChatView(true);
      setIsInMessageView(false);
      setActiveIcon("icon5");
    } else if (view === "chat") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(true);
      setIsInMessageView(false);
      setActiveIcon("icon5");
    }
  }, []);

  const handleMessagingClick = useCallback(() => {
    setShowChatView(true);
    setShowForm(false);
    setIsAddPackageView(false);
    setShowProfile(false);
    setShowNotifications(false);
    setActiveIcon("icon5");
  }, []);

  const toggleFavorite = useCallback((deliveryId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(deliveryId)) {
        // Nëse pakoja është tashmë favorite → e heq
        return prevFavorites.filter((id) => id !== deliveryId);
      } else {
        // Nëse nuk është favorite → e shton
        return [...prevFavorites, deliveryId];
      }
    });
  }, []);

  return (
    <div className="Homepage-container">
      {!isMobile && (
        <header className="homepage-header">
          <img className="homepage-sameway-logo" src={samewayLogo} />
          <div className="grouped-elements">
            <button
              onClick={() => window.location.reload()}
              style={{ marginRight: "10px", padding: "5px 10px" }}
            >
              <small>
                User: {user?.id} | Requests: {pendingRequests.length}
              </small>
              Refresh
            </button>
            <div className="notifications-dropdown-container">
              <div
                className="bell-icon-container"
                onClick={() =>
                  setIsRequestsDropdownOpen(!isRequestsDropdownOpen)
                }
              >
                <img className="bellIcon" src={bellIcon} alt="Notifications" />
                {pendingRequests.length > 0 && (
                  <span className="bell-badge">{pendingRequests.length}</span>
                )}
              </div>
              {isRequestsDropdownOpen && (
                <div className="requests-dropdown">
                  {pendingRequests.length > 0 ? (
                    <div className="requests-list">
                      {pendingRequests.map((request, index) => {
                        const requesterUser = {
                          email: request.requester,
                          name:
                            request.requesterName ||
                            request.requester.split("@")[0],
                          profileImage: request.requesterProfileImage, // Add this from the API response
                        };
                        console.log("Request object:", request);
                        console.log(
                          "Request ID:",
                          request.requestId,
                          "Type:",
                          typeof request.requestId
                        );
                        return (
                          <div
                            key={index}
                            className={`homepage-request-item ${
                              activeRequestId === request.requestId
                                ? "active-request"
                                : ""
                            }`}
                            onClick={() =>
                              setActiveRequestId(request.requestId)
                            }
                          >
                            <div className="request-content">
                              <div
                                className="highlight-bar"
                                style={{
                                  backgroundColor:
                                    activeRequestId === request.requestId
                                      ? "#2f80ed"
                                      : "transparent",
                                }}
                              ></div>
                              <UserAvatar user={requesterUser} />
                              <div className="request-details">
                                <div className="requester-info">
                                  <p className="requester-name">
                                    {requesterUser.name}
                                  </p>
                                  <p className="request-time">
                                    {formatRelativeTime(request.timestamp)}
                                  </p>
                                </div>
                                <p className="delivery-name">
                                  Has applied to deliver:{" "}
                                  {request.deliveryName || "your package"}
                                </p>
                              </div>
                            </div>

                            {activeRequestId === request.requestId && (
                              <div className="request-actions">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log(
                                      "Approve button clicked for request:",
                                      request.requestId
                                    );
                                    handleRequestAction(
                                      request.requestId,
                                      "approve"
                                    );
                                    setIsRequestsDropdownOpen(false);
                                  }}
                                  className="approve-btn"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestAction(
                                      request.requestId,
                                      "decline"
                                    );
                                    setIsRequestsDropdownOpen(false);
                                  }}
                                  className="decline-btn"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div className="request-dropdown-footer">View All</div>
                    </div>
                  ) : (
                    <p className="no-requests">No requests</p>
                  )}
                </div>
              )}
            </div>
            <div className="dropdown-container" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="dropdown-toggle"
                aria-expanded={isDropdownOpen}
              >
                <UserAvatar user={user} />
              </button>

              <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                <div
                  className="dropdown-item"
                  onClick={toggleFavoritedeliveryModal}
                >
                  <img src={heartIcon} />
                  Favourites
                </div>
                <hr className="dropdown-divider" />
                <div className="dropdown-item">
                  <img src={manageAcc} />
                  Manage Account
                </div>
                <hr className="dropdown-divider" />
                <div className="dropdown-item">
                  <img src={keyIcon} />
                  Change Password
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfile(true);
                    setShowForm(false);
                    setActiveIcon("profile");
                  }}
                >
                  <img src={profileImg} />
                  Profile
                </div>
                <hr className="dropdown-divider" />
                <div className="dropdown-item" onClick={handleLogout}>
                  <img src={logOutIcon} />
                  Logout
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {isMobile && showNotifications && (
        <div className="mobile-messages-view">
          <div className="mobile-messages-tabs">
            <button
              className={`mobile-tab ${
                activeMessagesTab === "notifications" ? "active-tab" : ""
              }`}
              onClick={() => setActiveMessagesTab("notifications")}
            >
              Notifications
              {pendingRequests.length > 0 && (
                <span className="notification-badge">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              className={`mobile-tab ${
                activeMessagesTab === "chat" ? "active-tab" : ""
              }`}
              onClick={() => setActiveMessagesTab("chat")}
            >
              Chat
            </button>
          </div>

          <div className="mobile-messages-content">
            {activeMessagesTab === "notifications" ? (
              <MobileNotifications
                pendingRequests={pendingRequests}
                handleRequestAction={handleRequestAction}
                getRequesterInfo={getRequesterInfo}
                formatRelativeTime={formatRelativeTime}
                deliveryOptions={deliveryOptions}
              />
            ) : (
              <Chat
                user={user}
                selectedContact={selectedChatContact}
                onClose={() => setShowChatView(false)}
                setShowFooter={setShowFooter}
              />
            )}
          </div>
        </div>
      )}

      <div className={`${showForm ? "form-view" : "delivery-view"}`}>
        <div className="Components-container">
          {!isMobile && <DeliveryMap />}
          {isMobile && showForm && <DeliveryMap />}
          <div className="main-content-container">
            <div className="Components-container1">
              {showProfile ? (
                <Profile
                  user={user}
                  setUser={setUser}
                  isEmbedded={true}
                  setShowProfile={setShowProfile}
                />
              ) : isAddPackageView ? (
                <Delivery
                  onClose={() => setIsAddPackageView(false)}
                  addNewDelivery={addNewDelivery}
                />
              ) : showChatView ? (
                <Chat
                  user={user}
                  selectedContact={selectedChatContact}
                  onClose={() => {
                    setShowChatView(false);
                    setIsInMessageView(false);
                    setShowFooter(true);
                  }}
                  setShowFooter={setShowFooter}
                  setIsInMessageView={setIsInMessageView}
                />
              ) : (
                <>
                  {!isMobile && (
                    <div>
                      <div className="Components-header">
                        <div
                          className="homepage-car-icon-container"
                          onClick={showDeliveryForm}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            className={`homepage-car-icon ${
                              activeIcon === "form" ? "active-icon" : ""
                            }`}
                            src={carIcon}
                            alt="Car Icon"
                          />
                          <label
                            className={`homepage-icons-label ${
                              activeIcon === "form" ? "activelabel" : ""
                            }`}
                          >
                            Direction
                          </label>
                          <hr
                            className={`${
                              activeIcon === "form"
                                ? "Components-header-icons-hr"
                                : ""
                            }`}
                          />
                        </div>
                        <div
                          className="homepage-vector-icon-container"
                          onClick={showDeliveryOptions}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            className={`vector-icon ${
                              activeIcon === "options" ? "active-icon" : ""
                            }`}
                            src={Vector}
                            alt="Vector Icon"
                          />
                          <label
                            className={`homepage-icons-label ${
                              activeIcon === "options" ? "activelabel" : ""
                            }`}
                          >
                            Packages
                          </label>
                          <hr
                            className={`${
                              activeIcon === "options"
                                ? "Components-header-icons-hr"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                      <hr className="header-hr" />
                    </div>
                  )}

                  <div className="Components-container2">
                    {showForm ? (
                      <DeliveryForm
                        updateFilterCriteria={updateFilterCriteria}
                      />
                    ) : (
                      <DeliveryOptions
                        deliveryOptions={filteredOptions}
                        user={user}
                        toggleFavorite={toggleFavorite}
                        favorites={favorites}
                        setIsAddPackageView={setIsAddPackageView}
                        setShowForm={setShowForm}
                        setShowProfile={setShowProfile}
                        setSelectedDelivery={setSelectedDelivery}
                        loading={loading}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
            {selectedDelivery && (
              <div
                className={`delivery-info-panel ${
                  selectedDelivery ? "open" : ""
                }`}
              >
                <DeliveryInfoPanel
                  deliveryDetails={selectedDelivery}
                  user={user}
                  onClose={() => setSelectedDelivery(null)}
                />
              </div>
            )}
          </div>
        </div>

        {!isMobile && (
          <div className="messaging-container" onClick={handleMessagingClick}>
            <div className="avatar-message-container">
              <UserAvatar user={user} />
              <p>Messaging</p>
            </div>
            <img src={editIcon} />
          </div>
        )}
      </div>

      {isMobile && (
        <MobileFooter
          className={`mobile-footer-container ${
            isInMessageView ? "hidden" : ""
          }`}
          onFooterClick={handleFooterClick}
          activeIcon={activeIcon}
        />
      )}

      {isModalOpen && (
        <Delivery onClose={toggleModal} addNewDelivery={addNewDelivery} />
      )}
      {isProductModalOpen && (
        <MyProductModal
          onClose={toggleProductModal}
          user={user}
          deleteDelivery={deleteDelivery}
          editDelivery={editDelivery}
        />
      )}
      {isFavoritedeliveryModal && (
        <FavoritedeliveryModal
          favorites={favorites}
          deliveryOptions={deliveryOptions}
          show={isFavoritedeliveryModal}
          onClose={toggleFavoritedeliveryModal}
        />
      )}
    </div>
  );
};

export default HomePage;
