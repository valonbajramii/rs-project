import React, { useState, useRef, useEffect } from "react";
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

const HomePage = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object from React Router
  const isMobile = useMediaQuery({ maxWidth: 480 });

  //request dropdown state
  const [isRequestsDropdownOpen, setIsRequestsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const [isAddPackageView, setIsAddPackageView] = useState(false);

  //
  // Add these state variables at the top of your HomePage component
  // const [showChat, setShowChat] = useState(false);
  // const [selectedChatContact, setSelectedChatContact] = useState(null);
  // const [showChatView, setShowChatView] = useState(false);

  const [selectedChatContact, setSelectedChatContact] = useState(null);
  const [showChatView, setShowChatView] = useState(false);

  const [showProfile, setShowProfile] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFavoritedeliveryModal, setIsFavoritedeliveryModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const dropdownRef = useRef(null); // Ref for the dropdown
  const [showForm, setShowForm] = useState(
    location.state?.showForm ?? true // Default to true if not specified
  );
  const [activeIcon, setActiveIcon] = useState(
    location.state?.showForm === false ? "icon2" : "icon1"
  ); // New state to track active icon

  // Function to initialize deliveries with 'createdBy' if missing
  const initializeDeliveries = () => {
    const storedDeliveries = localStorage.getItem("deliveries");
    let deliveries = storedDeliveries
      ? JSON.parse(storedDeliveries)
      : [
          {
            id: uuidv4(),
            name: "Car",
            image: audiImage,
            price: "100",
            location: "Kamenic",
            destination: "Prishtin",
            description: "Description",
            weightinKg: "20",
            length: "50cm",
            height: "50cm",
            width: "50cm",
            pickupTim: "2024-08-28T17:00",
            deadline: "08-09 T12:55",
            createdBy: user.email,
            requests: [], // Ensure requests is an array
          },
          // Other deliveries...
        ];

    deliveries = deliveries.map((delivery) => {
      if (!delivery.createdBy) {
        return { ...delivery, createdBy: user.email, id: uuidv4() };
      }
      return delivery;
    });

    localStorage.setItem("deliveries", JSON.stringify(deliveries));
    return deliveries;
  };

  const [deliveryOptions, setDeliveryOptions] = useState(initializeDeliveries);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [filteredOptions, setFilteredOptions] = useState(deliveryOptions);

  // Save deliveries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("deliveries", JSON.stringify(deliveryOptions));
  }, [deliveryOptions]);

  useEffect(() => {
    const storedDeliveries = localStorage.getItem("deliveries");
    if (storedDeliveries) {
      const deliveries = JSON.parse(storedDeliveries).map((delivery) => ({
        ...delivery,
        requests: Array.isArray(delivery.requests) ? delivery.requests : [], // Validate requests
      }));
      setDeliveryOptions(deliveries);
    }
  }, []);

  // Handler to add a new delivery
  const addNewDelivery = (newDelivery) => {
    const deliveryWithUser = {
      ...newDelivery,
      createdBy: user.email,
      id: uuidv4(),
    }; // Add a unique id
    const updatedDeliveryOptions = [...deliveryOptions, deliveryWithUser];
    setDeliveryOptions(updatedDeliveryOptions);
  };

  // Handler to delete a delivery using id
  const deleteDelivery = (deletedDelivery) => {
    const updatedDeliveryOptions = deliveryOptions.filter(
      (delivery) => delivery.id !== deletedDelivery.id // Use id for comparison
    );
    setDeliveryOptions(updatedDeliveryOptions);
  };

  // Function to update filter criteria
  const updateFilterCriteria = (criteria) => {
    setFilterCriteria(criteria);
  };

  //usefect to select the top request in dropdown

  useEffect(() => {
    if (isRequestsDropdownOpen && pendingRequests.length > 0) {
      setActiveRequestId(pendingRequests[0].requestId);
    }
  }, [isRequestsDropdownOpen, pendingRequests]);

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

  //useffect to track pending request
  // useEffect(() => {
  //   const pending = [];
  //   deliveryOptions.forEach((delivery) => {
  //     if (delivery.createdBy === user.email && delivery.requests) {
  //       delivery.requests.forEach((request) => {
  //         if (request.status === "Pending") {
  //           pending.push({
  //             deliveryId: delivery.id,
  //             deliveryName: delivery.name,
  //             requestId: request.id,
  //             requester: request.requester,
  //             status: request.status,
  //           });
  //         }
  //       });
  //     }
  //   });
  //   setPendingRequests(pending);
  // }, [deliveryOptions, user.email]); // Ensure these dependencies are correct
  useEffect(() => {
    const storedDeliveries =
      JSON.parse(localStorage.getItem("deliveries")) || [];
    const pending = [];

    storedDeliveries.forEach((delivery) => {
      if (delivery.createdBy === user.email && delivery.requests) {
        delivery.requests.forEach((request) => {
          if (request.status === "Pending") {
            pending.push({
              deliveryId: delivery.id,
              deliveryName: delivery.name,
              requestId: request.id,
              requester: request.requester,
              status: request.status,
              timestamp: request.timestamp,
              // Add any other relevant fields
            });
          }
        });
      }
    });

    // Sort by timestamp (newest first)
    pending.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setPendingRequests(pending);
  }, [deliveryOptions, user.email]); // Add deliveryOptions as dependency

  useEffect(() => {
    // This will force a re-render every minute to update the relative times
    const interval = setInterval(() => {
      // This state update will trigger a re-render
      setPendingRequests((prev) => [...prev]);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // const handleRequestAction = (deliveryId, requestId, action) => {
  //   const updatedDeliveries = deliveryOptions.map((delivery) => {
  //     if (delivery.id === deliveryId) {
  //       const updatedRequests = delivery.requests.map((request) => {
  //         if (request.id === requestId) {
  //           return {
  //             ...request,
  //             status: action === "approve" ? "Approved" : "Declined",
  //           };
  //         }
  //         return request;
  //       });
  //       return { ...delivery, requests: updatedRequests };
  //     }
  //     return delivery;
  //   });

  //   setDeliveryOptions(updatedDeliveries);
  //   localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
  // };

  const refreshRequests = () => {
    const storedDeliveries =
      JSON.parse(localStorage.getItem("deliveries")) || [];
    setDeliveryOptions(storedDeliveries);
  };

  // Then modify your handleRequestAction to call refresh:
  const handleRequestAction = (deliveryId, requestId, action) => {
    const updatedDeliveries = deliveryOptions.map((delivery) => {
      if (delivery.id === deliveryId) {
        const updatedRequests = delivery.requests.map((request) => {
          if (request.id === requestId) {
            // Add requester to chat contacts if accepting
            if (action === "approve") {
              const requesterUser = getRequesterInfo(request.requester);
              addChatContact(requesterUser);
            }
            return {
              ...request,
              status: action === "approve" ? "Approved" : "Declined",
            };
          }
          return request;
        });
        return { ...delivery, requests: updatedRequests };
      }
      return delivery;
    });

    setDeliveryOptions(updatedDeliveries);
    localStorage.setItem("deliveries", JSON.stringify(updatedDeliveries));
    refreshRequests();
  };

  // Handler for profile click
  const handleProfileClick = () => {
    navigate("/profile");
  };

  // Toggle modal functions
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleProductModal = () => {
    setIsProductModalOpen(!isProductModalOpen);
  };

  const toggleFavoritedeliveryModal = () => {
    setIsFavoritedeliveryModal(!isFavoritedeliveryModal);
  };

  // Edit delivery handler
  const editDelivery = (updatedDelivery) => {
    const updatedOptions = deliveryOptions.map((delivery) =>
      delivery.id === updatedDelivery.id ? updatedDelivery : delivery
    );
    setDeliveryOptions(updatedOptions);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      // Add check for notifications dropdown
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

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Function to toggle favorite delivery
  const toggleFavorite = (deliveryId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(deliveryId)
        ? prevFavorites.filter((id) => id !== deliveryId)
        : [...prevFavorites, deliveryId]
    );
  };

  const showDeliveryForm = () => {
    setShowForm(true);
    setActiveIcon("form"); // Set 'form' as the active icon
  };

  const showDeliveryOptions = () => {
    setShowForm(false);
    setActiveIcon("options"); // Set 'options' as the active icon
  };

  // Add this function to manage chat contacts
  const addChatContact = (contact) => {
    const storedContacts =
      JSON.parse(localStorage.getItem("chatContacts")) || [];
    const contactExists = storedContacts.some((c) => c.email === contact.email);

    if (!contactExists) {
      const updatedContacts = [...storedContacts, contact];
      localStorage.setItem("chatContacts", JSON.stringify(updatedContacts));
    }
  };

  // Update the messaging container click handler
  const handleMessagingClick = () => {
    setShowChatView(true);
    setShowForm(false);
    setIsAddPackageView(false);
    setShowProfile(false);
    setShowNotifications(false);
    setActiveIcon("icon5");
  };

  // const handleFooterClick = (view) => {
  //   if (view === "form") {
  //     setShowForm(true);
  //     setActiveIcon("icon1");
  //   } else if (view === "options") {
  //     setShowForm(false);
  //     setActiveIcon("icon2");
  //   } else if (view === "profile") {
  //     setActiveIcon("icon4");
  //     navigate("/profile");
  //   }
  // };

  const handleFooterClick = (view) => {
    if (view === "form") {
      setShowForm(true);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(false);
      setActiveIcon("icon1");
    } else if (view === "options") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(false);
      setActiveIcon("icon2");
    } else if (view === "add") {
      setShowForm(false);
      setIsAddPackageView(true);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(false);
      setActiveIcon("icon3");
    } else if (view === "profile") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(true);
      setShowNotifications(false);
      setShowChatView(false);
      setActiveIcon("icon4");
    } else if (view === "notifications") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(true);
      setShowChatView(false);
      setActiveIcon("icon3");
    } else if (view === "chat") {
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      setShowNotifications(false);
      setShowChatView(true);
      setActiveIcon("icon5");
    }
  };

  const getRequesterInfo = (requesterEmail) => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const requester = users.find((user) => user.email === requesterEmail);

    return (
      requester || {
        email: requesterEmail,
        name: requesterEmail.split("@")[0], // Default to email prefix if user not found
        profileImage: null,
      }
    );
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const requestTime = new Date(timestamp);
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
  };

  return (
    <div className="Homepage-container">
      {!isMobile && (
        <header className="homepage-header">
          {/* <img
          className="profile-icon"
          src={profileImg}
          alt="Profile"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        /> */}
          <img className="homepage-sameway-logo" src={samewayLogo} />
          <div className="grouped-elements">
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
                  {/* <div className="dropdown-header">
                    <h4>Requests ({pendingRequests.length})</h4>
                    <button onClick={() => setIsRequestsDropdownOpen(false)}>
                      ×
                    </button>
                  </div> */}

                  {pendingRequests.length > 0 ? (
                    <div className="requests-list">
                      {pendingRequests.map((request, index) => {
                        const requesterUser = getRequesterInfo(
                          request.requester
                        );
                        const delivery = deliveryOptions.find(
                          (d) => d.id === request.deliveryId
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
                                  Has applied to deliver the: {delivery?.name}
                                </p>
                              </div>
                            </div>

                            {/* Only show buttons for the active request */}
                            {activeRequestId === request.requestId && (
                              <div className="request-actions">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRequestAction(
                                      request.deliveryId,
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
                                      request.deliveryId,
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
                {/* <img
                className="profile-icon"
                src={profileImg}
                alt="Profile"
                style={{ cursor: "pointer" }}
              /> */}
                {/* <span className="dropdown-text">User Menu</span> */}
                <UserAvatar user={user} />
                {/* <img
                className="chevron-down"
                src={chevronDown}
                alt="Chevron"
                style={{ cursor: "pointer" }}
              /> */}
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
                  Change Passwrod
                </div>
                {/* <div className="dropdown-item" onClick={toggleProductModal}>
                  My Products
                </div>
                <div className="dropdown-item" onClick={toggleModal}>
                  Add Delivery
                </div> */}
                <div
                  className="dropdown-item"
                  // onClick={() => navigate("/profile")}
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
            {/* <div className="add-buttons-container">
          <div className="add-delivery-container">
            <img
              className="add-delivery-icon"
              src={addDeliveryIcon}
              alt=""
              onClick={toggleProductModal}
            />
            My Products
          </div>
          <div className="add-delivery-container" onClick={toggleModal}>
            <img className="add-delivery-icon" src={addDeliveryIcon} alt="" />
            Add Delivery
          </div>
        </div> */}
          </div>
        </header>
      )}
      <div className={`${showForm ? "form-view" : "delivery-view"}`}>
        <div className="Components-container">
          {!isMobile && <DeliveryMap />} {/* Always show map on desktop */}
          {isMobile && showForm && <DeliveryMap />}{" "}
          {/* Show map only in mobile when form is active */}
          <div className="main-content-container">
            <div className="Components-container1">
              {
                /* {showNotifications ? (
                <MobileNotifications
                  pendingRequests={pendingRequests}
                  handleRequestAction={handleRequestAction}
                  getRequesterInfo={getRequesterInfo}
                  formatRelativeTime={formatRelativeTime}
                />
              ) :*/ showProfile ? (
                  <Profile
                    user={user}
                    setUser={setUser}
                    isEmbedded={true}
                    setShowProfile={setShowProfile}
                  />
                ) : isAddPackageView ? (
                  <Delivery
                    onClose={() => setIsAddPackageView(false)}
                    addNewDelivery={(delivery) => {
                      addNewDelivery({ ...delivery });
                      setIsAddPackageView(false);
                      setShowForm(false);
                    }}
                  />
                ) : showChatView ? (
                  <Chat
                    user={user}
                    selectedContact={selectedChatContact}
                    onClose={() => setShowChatView(false)}
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
                        />
                      )}
                    </div>
                  </>
                )
              }
            </div>
            {/* Add the DeliveryInfoPanel */}
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
        {/* {showChat && (
          <Chat
            user={user}
            selectedContact={selectedChatContact}
            onClose={() => setShowChat(false)}
          />
        )} */}
        // Update the messaging container to include the onClick handler
        <div className="messaging-container" onClick={handleMessagingClick}>
          <div className="avatar-message-container">
            <UserAvatar user={user} />
            <p2>Messaging</p2>
          </div>
          <img src={editIcon} />
        </div>
      </div>
      {isMobile && (
        <MobileFooter
          className="MobileFooter"
          onFooterClick={handleFooterClick}
          activeIcon={activeIcon}
        />
      )}
      {isModalOpen && (
        <Delivery
          onClose={toggleModal}
          addNewDelivery={(delivery) => addNewDelivery({ ...delivery })}
        />
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
