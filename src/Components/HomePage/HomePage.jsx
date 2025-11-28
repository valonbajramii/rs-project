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
import CompleteProfile from "../../Pages/CompleteProfile/CompleteProfile";
import FavoritePackageView from "./FavoritePackageView/FavoritePackageView";
import { v4 as uuidv4 } from "uuid";
import { Dropdown } from "react-bootstrap";
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
import {
  packagesApi,
  transportApi,
  messagesApi,
  favoritesApi,
} from "../../API/api";

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
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFavoritePackageView, setShowFavoritePackageView] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

  const dropdownRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const [showForm, setShowForm] = useState(location.state?.showForm ?? true);
  const [activeIcon, setActiveIcon] = useState(
    location.state?.showForm === false ? "icon2" : "icon1"
  );

  // Add function to load favorites from backend
  const loadUserFavorites = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await favoritesApi.getUserFavorites();
      const favoritePackageIds = response.map((fav) => fav.packageId);
      setFavorites(favoritePackageIds);
      console.log("Loaded favorites from backend:", favoritePackageIds);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, [user?.id]);

  // Load favorites on mount and when user changes
  useEffect(() => {
    loadUserFavorites();
  }, [loadUserFavorites]);

  useEffect(() => {
    // Sync user from localStorage
    const syncUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
          setUser(parsedUser);
        }
      }
    };

    syncUserFromStorage();
  }, [user, setUser]);

  // Function to refresh packages from API
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

      const actualPackages = packagesArray.filter(
        (item) => item && item.id && item.name
      );
      const references = packagesArray.filter(
        (item) => item && item.$ref && !item.id
      );

      console.log("Actual packages:", actualPackages);
      console.log("References:", references);

      let resolvedReferences = [];
      if (references.length > 0) {
        console.log("Resolving references...");
        resolvedReferences = await packagesApi.resolveReferences(references);
        console.log("Resolved references:", resolvedReferences);
      }

      const allPackages = [...actualPackages, ...resolvedReferences];
      const uniquePackages = allPackages.filter(
        (pkg, index, array) => array.findIndex((p) => p.id === pkg.id) === index
      );

      console.log("All packages after resolving:", uniquePackages);

      const transformedPackages = uniquePackages.map((item) => ({
        id: item.id,
        name: item.name,
        imagePaths: item.imagePaths || [],
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

  const handleProfileComplete = useCallback(
    (updatedUser) => {
      console.log("🔄 Profile complete callback received:", updatedUser);

      if (!updatedUser.id && user?.id) {
        updatedUser.id = user.id;
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof setUser === "function") {
        setUser(updatedUser);
      }

      setShowCompleteProfile(false);
      setShowForm(true);
      setActiveIcon("icon1");
      refreshPackages();
    },
    [setUser, refreshPackages, user?.id]
  );

  const handleAddPackageClick = useCallback(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user.isProfileComplete) {
      setShowCompleteProfile(true);
      setShowForm(false);
      setIsAddPackageView(false);
      setShowProfile(false);
      setActiveIcon("profile");
      return;
    }
    setShowForm(true);
    setIsAddPackageView(true);
  }, [user, navigate]);

  // Load packages on component mount
  useEffect(() => {
    refreshPackages();
  }, [refreshPackages, user?.id]);

  const addNewDelivery = useCallback(
    async (newDelivery) => {
      try {
        const response = await packagesApi.createPackage(newDelivery);
        console.log("Package creation response:", response);

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

        setDeliveryOptions((prev) => [...prev, transformedPackage]);
        setFilteredOptions((prev) => [...prev, transformedPackage]);

        setTimeout(() => {
          refreshPackages();
        }, 1000);

        return response;
      } catch (error) {
        console.error("Failed to create package:", error);

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

  const updateFilterCriteria = useCallback((criteria) => {
    setFilterCriteria(criteria);
  }, []);

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

        let requestsArray = [];
        if (Array.isArray(response)) {
          requestsArray = response;
        } else if (response?.$values && Array.isArray(response.$values)) {
          requestsArray = response.$values;
        } else if (response.data && Array.isArray(response.data)) {
          requestsArray = response.data;
        }

        console.log("📋 Processed requests array:", requestsArray);

        const pending = requestsArray.filter((request) => {
          const status = request.status || request.Status;
          console.log(`📊 Request ${request.requestId} status:`, status);
          return status === "Pending" || status === "pending" || status === 0;
        });

        console.log("⏳ Filtered pending requests:", pending);

        const transformedPending = pending.map((request) => {
          console.log("🔍 Transforming request:", request);

          const transformed = {
            requestId: request.requestId,
            deliveryId: request.deliveryId,
            deliveryName: request.deliveryName,
            requester: request.requester,
            requesterId: request.requesterId,
            ownerId: request.ownerId,
            requesterName: request.requesterName,
            requesterProfileImage: request.requesterProfileImage,
            status: request.status,
            timestamp: request.timestamp,
          };

          console.log("✅ Transformed request:", transformed);
          return transformed;
        });

        console.log(
          "🔄 FINAL Transformed pending requests:",
          transformedPending
        );
        setPendingRequests(transformedPending);
      } catch (apiError) {
        console.error("❌ API Error:", apiError);
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
  }, [user?.id]);

  useEffect(() => {
    fetchPendingRequests();

    const intervalId = setInterval(fetchPendingRequests, 30000);

    return () => clearInterval(intervalId);
  }, [fetchPendingRequests]);

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

    if (typeof timestamp === "string") {
      requestTime = new Date(timestamp);
    } else if (typeof timestamp === "number") {
      requestTime = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      requestTime = timestamp;
    } else {
      return "Just now";
    }

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

  const handleRequestAction = useCallback(
    async (requestId, action) => {
      try {
        console.log("🔄 Updating request:", {
          requestId,
          type: typeof requestId,
          action: action,
        });

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

        console.log("📡 Calling API with:", { requestId: parsedId, status });
        const response = await transportApi.updateRequestStatus(
          parsedId,
          status
        );
        console.log("✅ API response:", response);

        if (action === "approve") {
          try {
            const request = pendingRequests.find(
              (req) => req.requestId === requestId
            );

            if (request) {
              const requesterContact = {
                id: request.requesterId || request.requester,
                email: request.requester,
                name: request.requesterName || request.requester.split("@")[0],
                profileImage: request.requesterProfileImage,
              };

              const ownerContact = {
                id: user.id,
                email: user.email,
                name: user.fullName || user.name,
                profileImage: user.profileImage,
              };

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

              addContactToStorage(user.id, requesterContact);
              console.log("✅ Chat relationship created for both users");
            }
          } catch (contactError) {
            console.error("Error creating chat relationship:", contactError);
          }
        }

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
    [fetchPendingRequests, pendingRequests]
  );

  const toggleModal = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const toggleProductModal = useCallback(() => {
    setIsProductModalOpen(!isProductModalOpen);
  }, [isProductModalOpen]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    onLogout(null);
    localStorage.removeItem("user");
    navigate("/login");
  }, [navigate, onLogout]);

  const showDeliveryForm = useCallback(() => {
    setShowForm(true);
    setActiveIcon("form");
  }, []);

  const showDeliveryOptions = useCallback(() => {
    setShowForm(false);
    setActiveIcon("options");
  }, []);

  // New handlers for info panel
  const handleSetSelectedDelivery = useCallback((delivery) => {
    setSelectedDelivery(delivery);
    setIsInfoPanelOpen(!!delivery);
  }, []);

  const handleCloseInfoPanel = useCallback(() => {
    setSelectedDelivery(null);
    setIsInfoPanelOpen(false);
  }, []);

  // const handleFooterClick = useCallback(
  //   (view) => {
  //     if (view === "form") {
  //       setShowForm(true);
  //       setIsAddPackageView(false);
  //       setShowProfile(false);
  //       setShowCompleteProfile(false);
  //       setShowNotifications(false);
  //       setShowChatView(false);
  //       setShowFavoritePackageView(false);
  //       setIsInMessageView(false);
  //       setActiveIcon("icon1");
  //     } else if (view === "options") {
  //       setShowForm(false);
  //       setIsAddPackageView(false);
  //       setShowProfile(false);
  //       setShowCompleteProfile(false);
  //       setShowNotifications(false);
  //       setShowChatView(false);
  //       setShowFavoritePackageView(false);
  //       setIsInMessageView(false);
  //       setActiveIcon("icon2");
  //     } else if (view === "add") {
  //       if (!user) {
  //         navigate("/login");
  //         return;
  //       }
  //       if (!user.isProfileComplete) {
  //         setShowCompleteProfile(true);
  //         setShowForm(false);
  //         setIsAddPackageView(false);
  //         setShowProfile(false);
  //         setActiveIcon("profile");
  //         return;
  //       }
  //       setShowForm(false);
  //       setIsAddPackageView(true);
  //       setShowProfile(false);
  //       setShowCompleteProfile(false);
  //       setShowNotifications(false);
  //       setShowChatView(false);
  //       setShowFavoritePackageView(false);
  //       setIsInMessageView(false);
  //       setActiveIcon("icon3");
  //     } else if (view === "profile") {
  //       if (!user?.isProfileComplete) {
  //         setShowCompleteProfile(true);
  //       } else {
  //         setShowProfile(true);
  //       }
  //       setShowForm(false);
  //       setIsAddPackageView(false);
  //       setShowNotifications(false);
  //       setShowChatView(false);
  //       setShowFavoritePackageView(false);
  //       setIsInMessageView(false);
  //       setActiveIcon("icon4");
  //     } else if (view === "messages") {
  //       setShowForm(false);
  //       setIsAddPackageView(false);
  //       setShowProfile(false);
  //       setShowCompleteProfile(false);
  //       setShowNotifications(true);
  //       setShowChatView(false);
  //       setShowFavoritePackageView(false);
  //       setIsInMessageView(false);
  //       setActiveIcon("icon5");
  //     } else if (view === "chat") {
  //       setShowForm(false);
  //       setIsAddPackageView(false);
  //       setShowProfile(false);
  //       setShowCompleteProfile(false);
  //       setShowNotifications(false);
  //       setShowChatView(true);
  //       setShowFavoritePackageView(false);
  //       setIsInMessageView(false);
  //       setActiveIcon("icon5");
  //     } else if (view === "favorites") {
  //       setShowForm(false);
  //       setIsAddPackageView(false);
  //       setShowProfile(false);
  //       setShowCompleteProfile(false);
  //       setShowNotifications(false);
  //       setShowChatView(false);
  //       setShowFavoritePackageView(true);
  //       setIsInMessageView(false);
  //       setActiveIcon("favorites");
  //     }
  //   },
  //   [user, navigate]
  // );

  const handleFooterClick = useCallback(
    (view) => {
      if (view === "form") {
        setShowForm(true);
        setIsAddPackageView(false);
        setShowProfile(false);
        setShowCompleteProfile(false);
        setShowNotifications(false);
        setShowChatView(false);
        setShowFavoritePackageView(false);
        setIsInMessageView(false);
        setActiveIcon("icon1");
      } else if (view === "options") {
        setShowForm(false);
        setIsAddPackageView(false);
        setShowProfile(false);
        setShowCompleteProfile(false);
        setShowNotifications(false);
        setShowChatView(false);
        setShowFavoritePackageView(false);
        setIsInMessageView(false);
        setActiveIcon("icon2");
      } else if (view === "messages") {
        setShowForm(false);
        setIsAddPackageView(false);
        setShowProfile(false);
        setShowCompleteProfile(false);
        setShowNotifications(true);
        setShowChatView(false);
        setShowFavoritePackageView(false);
        setIsInMessageView(false);
        setActiveIcon("icon3"); // Messages should be icon3
      } else if (view === "profile") {
        if (!user?.isProfileComplete) {
          setShowCompleteProfile(true);
        } else {
          setShowProfile(true);
        }
        setShowForm(false);
        setIsAddPackageView(false);
        setShowNotifications(false);
        setShowChatView(false);
        setShowFavoritePackageView(false);
        setIsInMessageView(false);
        setActiveIcon("icon4");
      } else if (view === "favorites") {
        setShowForm(false);
        setIsAddPackageView(false);
        setShowProfile(false);
        setShowCompleteProfile(false);
        setShowNotifications(false);
        setShowChatView(false);
        setShowFavoritePackageView(true);
        setIsInMessageView(false);
        setActiveIcon("icon2"); // Favorites should use icon2 (Packages) or create a 5th icon
      }
    },
    [user, navigate]
  );

  const handleMessagingClick = useCallback(() => {
    setShowChatView(true);
    setShowForm(false);
    setIsAddPackageView(false);
    setShowProfile(false);
    setShowNotifications(false);
    setActiveIcon("icon5");
  }, []);

  const toggleFavorite = useCallback(
    async (packageId) => {
      try {
        const isCurrentlyFavorited = favorites.includes(packageId);

        if (isCurrentlyFavorited) {
          await favoritesApi.removeFavorite(packageId);
          setFavorites((prev) => prev.filter((id) => id !== packageId));
        } else {
          await favoritesApi.addFavorite(packageId);
          setFavorites((prev) => [...prev, packageId]);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        alert(error.message || "Failed to update favorites");
      }
    },
    [favorites]
  );

  const handleCompleteProfileBack = () => {
    setShowCompleteProfile(false);
    setShowForm(true);
    setActiveIcon("icon1");
  };

  const handleBackFromFavorites = useCallback(() => {
    setShowFavoritePackageView(false);
    setShowForm(false);
    setActiveIcon("icon2");
  }, []);

  // Add this useEffect to check authentication on component load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      console.log("🔐 HomePage Auth Check:", {
        hasToken: !!token,
        hasUser: !!userData,
        tokenLength: token?.length,
        currentUser: user,
      });

      if (!token && user) {
        console.warn("⚠️ Token missing but user state exists - logging out");
        handleLogout();
      }
    };

    checkAuth();
  }, [user, handleLogout]);

  return (
    <div className="Homepage-container">
      {!isMobile && (
        <header className="homepage-header">
          <img className="homepage-sameway-logo" src={samewayLogo} />
          <div className="grouped-elements">
            {/* <button
              onClick={() => window.location.reload()}
              style={{ marginRight: "10px", padding: "5px 10px" }}
            >
              <small>
                User: {user?.id} | Requests: {pendingRequests.length}
              </small>
              Refresh
            </button> */}
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
                          profileImage: request.requesterProfileImage,
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
                  onClick={() => {
                    setShowFavoritePackageView(true);
                    setShowForm(false);
                    setIsAddPackageView(false);
                    setShowProfile(false);
                    setShowCompleteProfile(false);
                    setShowNotifications(false);
                    setShowChatView(false);
                    setActiveIcon("favorites");
                    setIsDropdownOpen(false);
                  }}
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
                    if (!user?.isProfileComplete) {
                      setShowCompleteProfile(true);
                      setShowForm(false);
                      setIsAddPackageView(false);
                      setShowProfile(false);
                      setActiveIcon("profile");
                    } else {
                      setShowProfile(true);
                      setShowForm(false);
                      setActiveIcon("profile");
                    }
                  }}
                >
                  <img className="profile-dropdown" src={profileImg} />
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
                onClose={() => {
                  setShowNotifications(false);
                  setShowFooter(true);
                }}
                setShowFooter={setShowFooter}
                setIsInMessageView={setIsInMessageView}
              />
            )}
          </div>
        </div>
      )}

      <div className={`${showForm ? "form-view" : "delivery-view"}`}>
        <div className="Components-container">
          {isMobile && showForm && !showFavoritePackageView && (
            <div className="mobile-favorites-button-container">
              <button
                className="mobile-favorites-button"
                onClick={() => handleFooterClick("favorites")}
              >
                <img src={heartIcon} alt="Favorites" />
                <span>Favorites ({favorites.length})</span>
              </button>
            </div>
          )}
          {!isMobile && <DeliveryMap />}
          {isMobile && showForm && <DeliveryMap />}
          <div
            className={`main-content-container ${
              isInfoPanelOpen ? "expanded" : ""
            }`}
          >
            <div
              className={`Components-container1 ${
                selectedDelivery ? "panel-open" : ""
              } ${isInfoPanelOpen ? "expanded" : ""}`}
            >
              {showCompleteProfile ? (
                <CompleteProfile
                  user={user}
                  setUser={setUser}
                  onProfileComplete={handleProfileComplete}
                  onBack={handleCompleteProfileBack}
                  isEmbedded={true}
                />
              ) : showProfile ? (
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
              ) : showFavoritePackageView ? (
                <FavoritePackageView
                  favorites={favorites}
                  deliveryOptions={deliveryOptions}
                  user={user}
                  toggleFavorite={toggleFavorite}
                  onBack={handleBackFromFavorites}
                  setSelectedDelivery={handleSetSelectedDelivery}
                />
              ) : (
                <>
                  {!isMobile && (
                    <div className="test-header">
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
                        setShowCompleteProfile={setShowCompleteProfile}
                        setSelectedDelivery={handleSetSelectedDelivery}
                        loading={loading}
                        onAddPackageClick={handleAddPackageClick}
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
                } ${isInfoPanelOpen ? "expanded" : ""}`}
              >
                <DeliveryInfoPanel
                  deliveryDetails={selectedDelivery}
                  user={user}
                  onClose={handleCloseInfoPanel}
                  setShowCompleteProfile={setShowCompleteProfile}
                  setShowForm={setShowForm}
                  setIsAddPackageView={setIsAddPackageView}
                  setShowProfile={setShowProfile}
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
    </div>
  );
};

export default HomePage;

// import React, { useState, useRef, useEffect, useCallback } from "react";
// import "./HomePage.css";
// import DeliveryForm from "./DeliveryForm/DeliveryForm";
// import DeliveryOptions from "./DeliveryOptions/DeliveryOptions";
// import DeliveryMap from "./DeliveryMap/DeliveryMap";
// import Delivery from "../Delivery/Delivery";
// import Profile from "../../Pages/Profile/Profile";
// import profileImg from "../../icons/person-fill.svg";
// import chevronDown from "../../icons/chevron-down.svg";
// import addDeliveryIcon from "../../icons/plus-circle-dotted.svg";
// import { useNavigate, useLocation } from "react-router-dom";
// import audiImage from "../../images/2025_audi_q7_4dr-suv_prestige_fq_oem_1_1600.avif";
// import mercedesImage from "../../images/2023-mercedes-amg-c63-s-e-performance-114-65d79698b0e26.avif";
// import MyProductModal from "./MyProductModal/MyProductModal";
// import CompleteProfile from "../../Pages/CompleteProfile/CompleteProfile";
// import FavoritePackageView from "./FavoritePackageView/FavoritePackageView";
// import { v4 as uuidv4 } from "uuid";
// import { Dropdown } from "react-bootstrap";
// import carIcon from "../../icons/car-front-outlined.svg";
// import Vector from "../../icons/Vector2.svg";
// import samewayLogo from "../../logo/sameway_logo.png";
// import { useMediaQuery } from "react-responsive";
// import MobileFooter from "../MobileFooter/MobileFooter";
// import UserAvatar from "../UserAvatar/UserAvatar";
// import heartIcon from "../../icons/HeartShape.svg";
// import manageAcc from "../../icons/manageAccIcon.svg";
// import keyIcon from "../../icons/Key-icon.svg";
// import logOutIcon from "../../icons/logoutIcon.svg";
// import bellIcon from "../../icons/bell-fill.svg";
// import DeliveryInfoPanel from "../DeliveryInfoPanel/DeliveryInfoPanel";
// import MobileNotifications from "../MobileNotifications/MobileNotifications";
// import editIcon from "../../icons/edit.svg";
// import Chat from "../Chat/Chat";
// import {
//   packagesApi,
//   transportApi,
//   messagesApi,
//   favoritesApi,
// } from "../../API/api";

// const HomePage = ({ user, setUser, onLogout }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isMobile = useMediaQuery({ maxWidth: 480 });

//   // State variables
//   const [isRequestsDropdownOpen, setIsRequestsDropdownOpen] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [isAddPackageView, setIsAddPackageView] = useState(false);
//   const [activeMessagesTab, setActiveMessagesTab] = useState("notifications");
//   const [selectedChatContact, setSelectedChatContact] = useState(null);
//   const [showChatView, setShowChatView] = useState(false);
//   const [showFooter, setShowFooter] = useState(true);
//   const [isInMessageView, setIsInMessageView] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [showCompleteProfile, setShowCompleteProfile] = useState(false);
//   const [activeRequestId, setActiveRequestId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isProductModalOpen, setIsProductModalOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [favorites, setFavorites] = useState([]);
//   const [deliveryOptions, setDeliveryOptions] = useState([]);
//   const [filterCriteria, setFilterCriteria] = useState({});
//   const [filteredOptions, setFilteredOptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFavoritePackageView, setShowFavoritePackageView] = useState(false);
//   const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

//   const dropdownRef = useRef(null);
//   const hasFetchedRef = useRef(false);

//   // Fixed: Better state management for active views and icons
//   const [activeView, setActiveView] = useState(
//     location.state?.showForm === false ? "options" : "form"
//   );
//   const [activeIcon, setActiveIcon] = useState(
//     location.state?.showForm === false ? "icon2" : "icon1"
//   );

//   // Add function to load favorites from backend
//   const loadUserFavorites = useCallback(async () => {
//     if (!user?.id) return;

//     try {
//       const response = await favoritesApi.getUserFavorites();
//       const favoritePackageIds = response.map((fav) => fav.packageId);
//       setFavorites(favoritePackageIds);
//       console.log("Loaded favorites from backend:", favoritePackageIds);
//     } catch (error) {
//       console.error("Error loading favorites:", error);
//     }
//   }, [user?.id]);

//   // Load favorites on mount and when user changes
//   useEffect(() => {
//     loadUserFavorites();
//   }, [loadUserFavorites]);

//   useEffect(() => {
//     // Sync user from localStorage
//     const syncUserFromStorage = () => {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
//           setUser(parsedUser);
//         }
//       }
//     };

//     syncUserFromStorage();
//   }, [user, setUser]);

//   // Function to refresh packages from API
//   const refreshPackages = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await packagesApi.getPackages();

//       console.log("Raw packages response:", response);

//       let packagesArray = [];
//       if (Array.isArray(response)) {
//         packagesArray = response;
//       } else if (response?.$values && Array.isArray(response.$values)) {
//         packagesArray = response.$values;
//       }

//       console.log("Packages array:", packagesArray);

//       const actualPackages = packagesArray.filter(
//         (item) => item && item.id && item.name
//       );
//       const references = packagesArray.filter(
//         (item) => item && item.$ref && !item.id
//       );

//       console.log("Actual packages:", actualPackages);
//       console.log("References:", references);

//       let resolvedReferences = [];
//       if (references.length > 0) {
//         console.log("Resolving references...");
//         resolvedReferences = await packagesApi.resolveReferences(references);
//         console.log("Resolved references:", resolvedReferences);
//       }

//       const allPackages = [...actualPackages, ...resolvedReferences];
//       const uniquePackages = allPackages.filter(
//         (pkg, index, array) => array.findIndex((p) => p.id === pkg.id) === index
//       );

//       console.log("All packages after resolving:", uniquePackages);

//       const transformedPackages = uniquePackages.map((item) => ({
//         id: item.id,
//         name: item.name,
//         imagePaths: item.imagePaths || [],
//         price: item.price?.toString() || "0",
//         location: item.location || "",
//         destination: item.destination || "",
//         description: item.description || "",
//         weightinKg: item.weight || item.weightinKg || "0",
//         length: item.length || 0,
//         height: item.height || 0,
//         width: item.width || 0,
//         deadline: item.deadline || "",
//         createdBy: item.userId || item.createdBy || "",
//       }));

//       console.log("Transformed packages:", transformedPackages);
//       setDeliveryOptions(transformedPackages);
//       setFilteredOptions(transformedPackages);
//     } catch (error) {
//       console.error("Failed to refresh packages:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const handleProfileComplete = useCallback(
//     (updatedUser) => {
//       console.log("🔄 Profile complete callback received:", updatedUser);

//       if (!updatedUser.id && user?.id) {
//         updatedUser.id = user.id;
//       }

//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       if (typeof setUser === "function") {
//         setUser(updatedUser);
//       }

//       setShowCompleteProfile(false);
//       setActiveView("form");
//       setActiveIcon("icon1");
//       refreshPackages();
//     },
//     [setUser, refreshPackages, user?.id]
//   );

//   const handleAddPackageClick = useCallback(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     if (!user.isProfileComplete) {
//       setShowCompleteProfile(true);
//       setActiveView("completeProfile");
//       setActiveIcon("profile");
//       return;
//     }
//     setIsAddPackageView(true);
//     setActiveView("addPackage");
//     setActiveIcon("icon3");
//   }, [user, navigate]);

//   // Load packages on component mount
//   useEffect(() => {
//     refreshPackages();
//   }, [refreshPackages, user?.id]);

//   const addNewDelivery = useCallback(
//     async (newDelivery) => {
//       try {
//         const response = await packagesApi.createPackage(newDelivery);
//         console.log("Package creation response:", response);

//         const transformedPackage = {
//           id: response.id,
//           name: response.name,
//           imagePaths: response.imagePaths || [],
//           price: response.price?.toString() || "0",
//           location: response.location || "",
//           destination: response.destination || "",
//           description: response.description || "",
//           weightinKg: response.weight || response.weightinKg || "0",
//           length: response.length || 0,
//           height: response.height || 0,
//           width: response.width || 0,
//           deadline: response.deadline || "",
//           createdBy:
//             response.userId ||
//             response.createdBy ||
//             newDelivery.createdBy ||
//             "",
//         };

//         console.log("Transformed new package:", transformedPackage);

//         setDeliveryOptions((prev) => [...prev, transformedPackage]);
//         setFilteredOptions((prev) => [...prev, transformedPackage]);

//         setTimeout(() => {
//           refreshPackages();
//         }, 1000);

//         return response;
//       } catch (error) {
//         console.error("Failed to create package:", error);

//         if (
//           error.message &&
//           error.message.includes("duplicate key") &&
//           error.message.includes("IX_Packages_Name_UserId")
//         ) {
//           throw new Error(
//             "You already have a package with this name. Please choose a different name."
//           );
//         }

//         throw error;
//       }
//     },
//     [refreshPackages]
//   );

//   // Function to filter delivery options based on filter criteria
//   useEffect(() => {
//     const applyFilters = () => {
//       let filtered = deliveryOptions;

//       if (filterCriteria.location) {
//         filtered = filtered.filter((option) =>
//           option.location
//             .toLowerCase()
//             .includes(filterCriteria.location.toLowerCase())
//         );
//       }

//       if (filterCriteria.destination) {
//         filtered = filtered.filter((option) =>
//           option.destination
//             .toLowerCase()
//             .includes(filterCriteria.destination.toLowerCase())
//         );
//       }

//       if (filterCriteria.length) {
//         filtered = filtered.filter(
//           (option) => parseInt(option.length) >= parseInt(filterCriteria.length)
//         );
//       }

//       if (filterCriteria.height) {
//         filtered = filtered.filter(
//           (option) => parseInt(option.height) >= parseInt(filterCriteria.height)
//         );
//       }

//       if (filterCriteria.pickupTime) {
//         filtered = filtered.filter(
//           (option) =>
//             new Date(option.pickupTim) >= new Date(filterCriteria.pickupTime)
//         );
//       }

//       setFilteredOptions(filtered);
//     };

//     applyFilters();
//   }, [filterCriteria, deliveryOptions]);

//   const updateFilterCriteria = useCallback((criteria) => {
//     setFilterCriteria(criteria);
//   }, []);

//   const deleteDelivery = useCallback(
//     (deletedDelivery) => {
//       const updatedDeliveryOptions = deliveryOptions.filter(
//         (delivery) => delivery.id !== deletedDelivery.id
//       );
//       setDeliveryOptions(updatedDeliveryOptions);
//       setFilteredOptions(updatedDeliveryOptions);
//     },
//     [deliveryOptions]
//   );

//   const editDelivery = useCallback(
//     (updatedDelivery) => {
//       const updatedOptions = deliveryOptions.map((delivery) =>
//         delivery.id === updatedDelivery.id ? updatedDelivery : delivery
//       );
//       setDeliveryOptions(updatedOptions);
//       setFilteredOptions(updatedOptions);
//     },
//     [deliveryOptions]
//   );

//   const fetchPendingRequests = useCallback(async () => {
//     try {
//       if (!user?.id) {
//         console.log("❌ No user ID available");
//         return;
//       }

//       console.log("📡 Fetching owner requests for user:", user.id);

//       try {
//         const response = await transportApi.getOwnerRequests(user.id);
//         console.log("📦 Owner requests from API:", response);

//         if (!response) {
//           console.log("❌ No requests returned");
//           setPendingRequests([]);
//           return;
//         }

//         let requestsArray = [];
//         if (Array.isArray(response)) {
//           requestsArray = response;
//         } else if (response?.$values && Array.isArray(response.$values)) {
//           requestsArray = response.$values;
//         } else if (response.data && Array.isArray(response.data)) {
//           requestsArray = response.data;
//         }

//         console.log("📋 Processed requests array:", requestsArray);

//         const pending = requestsArray.filter((request) => {
//           const status = request.status || request.Status;
//           console.log(`📊 Request ${request.requestId} status:`, status);
//           return status === "Pending" || status === "pending" || status === 0;
//         });

//         console.log("⏳ Filtered pending requests:", pending);

//         const transformedPending = pending.map((request) => {
//           console.log("🔍 Transforming request:", request);

//           const transformed = {
//             requestId: request.requestId,
//             deliveryId: request.deliveryId,
//             deliveryName: request.deliveryName,
//             requester: request.requester,
//             requesterId: request.requesterId,
//             ownerId: request.ownerId,
//             requesterName: request.requesterName,
//             requesterProfileImage: request.requesterProfileImage,
//             status: request.status,
//             timestamp: request.timestamp,
//           };

//           console.log("✅ Transformed request:", transformed);
//           return transformed;
//         });

//         console.log(
//           "🔄 FINAL Transformed pending requests:",
//           transformedPending
//         );
//         setPendingRequests(transformedPending);
//       } catch (apiError) {
//         console.error("❌ API Error:", apiError);
//         const userRequestsKey = `pendingRequests_${user.id}`;
//         const fallbackRequests = JSON.parse(
//           localStorage.getItem(userRequestsKey) || "[]"
//         );
//         setPendingRequests(fallbackRequests);
//       }
//     } catch (error) {
//       console.error("❌ Error in fetchPendingRequests:", error);
//       setPendingRequests([]);
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     fetchPendingRequests();

//     const intervalId = setInterval(fetchPendingRequests, 30000);

//     return () => clearInterval(intervalId);
//   }, [fetchPendingRequests]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }

//       const notificationsDropdown = document.querySelector(
//         ".notifications-dropdown-container"
//       );
//       if (
//         notificationsDropdown &&
//         !notificationsDropdown.contains(event.target)
//       ) {
//         setIsRequestsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isDropdownOpen, isRequestsDropdownOpen]);

//   const addChatContact = useCallback((contact) => {
//     const storedContacts =
//       JSON.parse(localStorage.getItem("chatContacts")) || [];
//     const contactExists = storedContacts.some((c) => c.email === contact.email);

//     if (!contactExists) {
//       const updatedContacts = [...storedContacts, contact];
//       localStorage.setItem("chatContacts", JSON.stringify(updatedContacts));
//     }
//   }, []);

//   const getRequesterInfo = useCallback((requesterEmail) => {
//     const users = JSON.parse(localStorage.getItem("users")) || [];
//     const requester = users.find((user) => user.email === requesterEmail);

//     return (
//       requester || {
//         email: requesterEmail,
//         name: requesterEmail.split("@")[0],
//         profileImage: null,
//       }
//     );
//   }, []);

//   const formatRelativeTime = useCallback((timestamp) => {
//     if (!timestamp) return "Just now";

//     let requestTime;

//     if (typeof timestamp === "string") {
//       requestTime = new Date(timestamp);
//     } else if (typeof timestamp === "number") {
//       requestTime = new Date(timestamp);
//     } else if (timestamp instanceof Date) {
//       requestTime = timestamp;
//     } else {
//       return "Just now";
//     }

//     if (isNaN(requestTime.getTime())) {
//       return "Just now";
//     }

//     const now = new Date();
//     const seconds = Math.floor((now - requestTime) / 1000);

//     let interval = Math.floor(seconds / 31536000);
//     if (interval >= 1)
//       return `${interval} year${interval === 1 ? "" : "s"} ago`;

//     interval = Math.floor(seconds / 2592000);
//     if (interval >= 1)
//       return `${interval} month${interval === 1 ? "" : "s"} ago`;

//     interval = Math.floor(seconds / 86400);
//     if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;

//     interval = Math.floor(seconds / 3600);
//     if (interval >= 1)
//       return `${interval} hour${interval === 1 ? "" : "s"} ago`;

//     interval = Math.floor(seconds / 60);
//     if (interval >= 1) return `${interval} min${interval === 1 ? "" : "s"} ago`;

//     return "Just now";
//   }, []);

//   const handleRequestAction = useCallback(
//     async (requestId, action) => {
//       try {
//         console.log("🔄 Updating request:", {
//           requestId,
//           type: typeof requestId,
//           action: action,
//         });

//         if (!requestId) {
//           console.error("❌ Request ID is null/undefined:", requestId);
//           alert("Invalid request ID");
//           return;
//         }

//         const parsedId = parseInt(requestId);
//         console.log("📊 Parsed ID:", parsedId, "Is NaN:", isNaN(parsedId));

//         if (isNaN(parsedId)) {
//           console.error("❌ Invalid request ID (not a number):", requestId);
//           alert("Invalid request ID");
//           return;
//         }

//         const status = action === "approve" ? "Accepted" : "Rejected";

//         console.log("📡 Calling API with:", { requestId: parsedId, status });
//         const response = await transportApi.updateRequestStatus(
//           parsedId,
//           status
//         );
//         console.log("✅ API response:", response);

//         if (action === "approve") {
//           try {
//             const request = pendingRequests.find(
//               (req) => req.requestId === requestId
//             );

//             if (request) {
//               const requesterContact = {
//                 id: request.requesterId || request.requester,
//                 email: request.requester,
//                 name: request.requesterName || request.requester.split("@")[0],
//                 profileImage: request.requesterProfileImage,
//               };

//               const ownerContact = {
//                 id: user.id,
//                 email: user.email,
//                 name: user.fullName || user.name,
//                 profileImage: user.profileImage,
//               };

//               const addContactToStorage = (userId, contact) => {
//                 const userContactsKey = `chatContacts_${userId}`;
//                 const storedContacts = JSON.parse(
//                   localStorage.getItem(userContactsKey) || "[]"
//                 );

//                 const contactExists = storedContacts.some(
//                   (c) => c.id === contact.id || c.email === contact.email
//                 );

//                 if (!contactExists) {
//                   const updatedContacts = [...storedContacts, contact];
//                   localStorage.setItem(
//                     userContactsKey,
//                     JSON.stringify(updatedContacts)
//                   );
//                 }
//               };

//               addContactToStorage(user.id, requesterContact);
//               console.log("✅ Chat relationship created for both users");
//             }
//           } catch (contactError) {
//             console.error("Error creating chat relationship:", contactError);
//           }
//         }

//         setPendingRequests((prev) =>
//           prev.filter((req) => req.requestId !== requestId)
//         );

//         alert(
//           `Request ${
//             action === "approve" ? "approved" : "rejected"
//           } successfully`
//         );
//       } catch (error) {
//         console.error("❌ Error updating request:", error);
//         alert(
//           "Failed to update request status: " +
//             (error.response?.data?.message || error.message)
//         );
//       }
//     },
//     [fetchPendingRequests, pendingRequests]
//   );

//   const toggleModal = useCallback(() => {
//     setIsModalOpen(!isModalOpen);
//   }, [isModalOpen]);

//   const toggleProductModal = useCallback(() => {
//     setIsProductModalOpen(!isProductModalOpen);
//   }, [isProductModalOpen]);

//   const toggleDropdown = useCallback(() => {
//     setIsDropdownOpen((prev) => !prev);
//   }, []);

//   const handleLogout = useCallback(() => {
//     onLogout(null);
//     localStorage.removeItem("user");
//     navigate("/login");
//   }, [navigate, onLogout]);

//   // Fixed: Better navigation functions
//   const showDeliveryForm = useCallback(() => {
//     setActiveView("form");
//     setActiveIcon("icon1");
//   }, []);

//   const showDeliveryOptions = useCallback(() => {
//     setActiveView("options");
//     setActiveIcon("icon2");
//   }, []);

//   // New handlers for info panel
//   const handleSetSelectedDelivery = useCallback((delivery) => {
//     setSelectedDelivery(delivery);
//     setIsInfoPanelOpen(!!delivery);
//   }, []);

//   const handleCloseInfoPanel = useCallback(() => {
//     setSelectedDelivery(null);
//     setIsInfoPanelOpen(false);
//   }, []);

//   const handleFooterClick = useCallback(
//     (view) => {
//       switch (view) {
//         case "form":
//           setActiveView("form");
//           setActiveIcon("icon1");
//           break;
//         case "options":
//           setActiveView("options");
//           setActiveIcon("icon2");
//           break;
//         case "messages":
//           setActiveView("messages");
//           setActiveIcon("icon3");
//           break;
//         case "profile":
//           if (!user?.isProfileComplete) {
//             setActiveView("completeProfile");
//           } else {
//             setActiveView("profile");
//           }
//           setActiveIcon("icon4");
//           break;
//         case "favorites":
//           setActiveView("favorites");
//           setActiveIcon("icon2");
//           break;
//         default:
//           setActiveView("form");
//           setActiveIcon("icon1");
//       }
//     },
//     [user]
//   );

//   const handleMessagingClick = useCallback(() => {
//     setActiveView("chat");
//     setActiveIcon("icon5");
//   }, []);

//   const toggleFavorite = useCallback(
//     async (packageId) => {
//       try {
//         const isCurrentlyFavorited = favorites.includes(packageId);

//         if (isCurrentlyFavorited) {
//           await favoritesApi.removeFavorite(packageId);
//           setFavorites((prev) => prev.filter((id) => id !== packageId));
//         } else {
//           await favoritesApi.addFavorite(packageId);
//           setFavorites((prev) => [...prev, packageId]);
//         }
//       } catch (error) {
//         console.error("Error toggling favorite:", error);
//         alert(error.message || "Failed to update favorites");
//       }
//     },
//     [favorites]
//   );

//   const handleCompleteProfileBack = () => {
//     setShowCompleteProfile(false);
//     setActiveView("form");
//     setActiveIcon("icon1");
//   };

//   const handleBackFromFavorites = useCallback(() => {
//     setShowFavoritePackageView(false);
//     setActiveView("options");
//     setActiveIcon("icon2");
//   }, []);

//   // Add this useEffect to check authentication on component load
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem("token");
//       const userData = localStorage.getItem("user");

//       console.log("🔐 HomePage Auth Check:", {
//         hasToken: !!token,
//         hasUser: !!userData,
//         tokenLength: token?.length,
//         currentUser: user,
//       });

//       if (!token && user) {
//         console.warn("⚠️ Token missing but user state exists - logging out");
//         handleLogout();
//       }
//     };

//     checkAuth();
//   }, [user, handleLogout]);

//   // Determine what to render based on activeView
//   const renderMainContent = () => {
//     switch (activeView) {
//       case "completeProfile":
//         return (
//           <CompleteProfile
//             user={user}
//             setUser={setUser}
//             onProfileComplete={handleProfileComplete}
//             onBack={handleCompleteProfileBack}
//             isEmbedded={true}
//           />
//         );
//       case "profile":
//         return (
//           <Profile
//             user={user}
//             setUser={setUser}
//             isEmbedded={true}
//             setShowProfile={setShowProfile}
//           />
//         );
//       case "addPackage":
//         return (
//           <Delivery
//             onClose={() => {
//               setIsAddPackageView(false);
//               setActiveView("options");
//               setActiveIcon("icon2");
//             }}
//             addNewDelivery={addNewDelivery}
//           />
//         );
//       case "chat":
//         return (
//           <Chat
//             user={user}
//             selectedContact={selectedChatContact}
//             onClose={() => {
//               setActiveView("form");
//               setActiveIcon("icon1");
//               setIsInMessageView(false);
//               setShowFooter(true);
//             }}
//             setShowFooter={setShowFooter}
//             setIsInMessageView={setIsInMessageView}
//           />
//         );
//       case "favorites":
//         return (
//           <FavoritePackageView
//             favorites={favorites}
//             deliveryOptions={deliveryOptions}
//             user={user}
//             toggleFavorite={toggleFavorite}
//             onBack={handleBackFromFavorites}
//             setSelectedDelivery={handleSetSelectedDelivery}
//           />
//         );
//       case "messages":
//         return (
//           <div className="mobile-messages-view">
//             <div className="mobile-messages-tabs">
//               <button
//                 className={`mobile-tab ${
//                   activeMessagesTab === "notifications" ? "active-tab" : ""
//                 }`}
//                 onClick={() => setActiveMessagesTab("notifications")}
//               >
//                 Notifications
//                 {pendingRequests.length > 0 && (
//                   <span className="notification-badge">
//                     {pendingRequests.length}
//                   </span>
//                 )}
//               </button>
//               <button
//                 className={`mobile-tab ${
//                   activeMessagesTab === "chat" ? "active-tab" : ""
//                 }`}
//                 onClick={() => setActiveMessagesTab("chat")}
//               >
//                 Chat
//               </button>
//             </div>

//             <div className="mobile-messages-content">
//               {activeMessagesTab === "notifications" ? (
//                 <MobileNotifications
//                   pendingRequests={pendingRequests}
//                   handleRequestAction={handleRequestAction}
//                   getRequesterInfo={getRequesterInfo}
//                   formatRelativeTime={formatRelativeTime}
//                   deliveryOptions={deliveryOptions}
//                 />
//               ) : (
//                 <Chat
//                   user={user}
//                   selectedContact={selectedChatContact}
//                   onClose={() => {
//                     setActiveView("form");
//                     setActiveIcon("icon1");
//                     setShowFooter(true);
//                   }}
//                   setShowFooter={setShowFooter}
//                   setIsInMessageView={setIsInMessageView}
//                 />
//               )}
//             </div>
//           </div>
//         );
//       case "options":
//         return (
//           <DeliveryOptions
//             deliveryOptions={filteredOptions}
//             user={user}
//             toggleFavorite={toggleFavorite}
//             favorites={favorites}
//             setIsAddPackageView={setIsAddPackageView}
//             setShowForm={setShowForm}
//             setShowProfile={setShowProfile}
//             setShowCompleteProfile={setShowCompleteProfile}
//             setSelectedDelivery={handleSetSelectedDelivery}
//             loading={loading}
//             onAddPackageClick={handleAddPackageClick}
//           />
//         );
//       case "form":
//       default:
//         return <DeliveryForm updateFilterCriteria={updateFilterCriteria} />;
//     }
//   };

//   return (
//     <div className="Homepage-container">
//       {!isMobile && (
//         <header className="homepage-header">
//           <img className="homepage-sameway-logo" src={samewayLogo} />
//           <div className="grouped-elements">
//             <div className="notifications-dropdown-container">
//               <div
//                 className="bell-icon-container"
//                 onClick={() =>
//                   setIsRequestsDropdownOpen(!isRequestsDropdownOpen)
//                 }
//               >
//                 <img className="bellIcon" src={bellIcon} alt="Notifications" />
//                 {pendingRequests.length > 0 && (
//                   <span className="bell-badge">{pendingRequests.length}</span>
//                 )}
//               </div>
//               {isRequestsDropdownOpen && (
//                 <div className="requests-dropdown">
//                   {pendingRequests.length > 0 ? (
//                     <div className="requests-list">
//                       {pendingRequests.map((request, index) => {
//                         const requesterUser = {
//                           email: request.requester,
//                           name:
//                             request.requesterName ||
//                             request.requester.split("@")[0],
//                           profileImage: request.requesterProfileImage,
//                         };
//                         return (
//                           <div
//                             key={index}
//                             className={`homepage-request-item ${
//                               activeRequestId === request.requestId
//                                 ? "active-request"
//                                 : ""
//                             }`}
//                             onClick={() =>
//                               setActiveRequestId(request.requestId)
//                             }
//                           >
//                             <div className="request-content">
//                               <div
//                                 className="highlight-bar"
//                                 style={{
//                                   backgroundColor:
//                                     activeRequestId === request.requestId
//                                       ? "#2f80ed"
//                                       : "transparent",
//                                 }}
//                               ></div>
//                               <UserAvatar user={requesterUser} />
//                               <div className="request-details">
//                                 <div className="requester-info">
//                                   <p className="requester-name">
//                                     {requesterUser.name}
//                                   </p>
//                                   <p className="request-time">
//                                     {formatRelativeTime(request.timestamp)}
//                                   </p>
//                                 </div>
//                                 <p className="delivery-name">
//                                   Has applied to deliver:{" "}
//                                   {request.deliveryName || "your package"}
//                                 </p>
//                               </div>
//                             </div>

//                             {activeRequestId === request.requestId && (
//                               <div className="request-actions">
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleRequestAction(
//                                       request.requestId,
//                                       "approve"
//                                     );
//                                     setIsRequestsDropdownOpen(false);
//                                   }}
//                                   className="approve-btn"
//                                 >
//                                   Accept
//                                 </button>
//                                 <button
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleRequestAction(
//                                       request.requestId,
//                                       "decline"
//                                     );
//                                     setIsRequestsDropdownOpen(false);
//                                   }}
//                                   className="decline-btn"
//                                 >
//                                   Decline
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         );
//                       })}
//                       <div className="request-dropdown-footer">View All</div>
//                     </div>
//                   ) : (
//                     <p className="no-requests">No requests</p>
//                   )}
//                 </div>
//               )}
//             </div>
//             <div className="dropdown-container" ref={dropdownRef}>
//               <button
//                 onClick={toggleDropdown}
//                 className="dropdown-toggle"
//                 aria-expanded={isDropdownOpen}
//               >
//                 <UserAvatar user={user} />
//               </button>

//               <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
//                 <div
//                   className="dropdown-item"
//                   onClick={() => {
//                     handleFooterClick("favorites");
//                     setIsDropdownOpen(false);
//                   }}
//                 >
//                   <img src={heartIcon} />
//                   Favourites
//                 </div>
//                 <hr className="dropdown-divider" />
//                 <div className="dropdown-item">
//                   <img src={manageAcc} />
//                   Manage Account
//                 </div>
//                 <hr className="dropdown-divider" />
//                 <div className="dropdown-item">
//                   <img src={keyIcon} />
//                   Change Password
//                 </div>
//                 <div
//                   className="dropdown-item"
//                   onClick={() => {
//                     handleFooterClick("profile");
//                     setIsDropdownOpen(false);
//                   }}
//                 >
//                   <img className="profile-dropdown" src={profileImg} />
//                   Profile
//                 </div>
//                 <hr className="dropdown-divider" />
//                 <div className="dropdown-item" onClick={handleLogout}>
//                   <img src={logOutIcon} />
//                   Logout
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>
//       )}

//       <div
//         className={`${activeView === "form" ? "form-view" : "delivery-view"}`}
//       >
//         <div className="Components-container">
//           {isMobile && activeView === "form" && activeView !== "favorites" && (
//             <div className="mobile-favorites-button-container">
//               <button
//                 className="mobile-favorites-button"
//                 onClick={() => handleFooterClick("favorites")}
//               >
//                 <img src={heartIcon} alt="Favorites" />
//                 <span>Favorites ({favorites.length})</span>
//               </button>
//             </div>
//           )}
//           {!isMobile && <DeliveryMap />}
//           {isMobile && activeView === "form" && <DeliveryMap />}
//           <div
//             className={`main-content-container ${
//               isInfoPanelOpen ? "expanded" : ""
//             }`}
//           >
//             <div
//               className={`Components-container1 ${
//                 selectedDelivery ? "panel-open" : ""
//               } ${isInfoPanelOpen ? "expanded" : ""}`}
//             >
//               {/* Only show header icons for form/options views on desktop */}
//               {!isMobile &&
//                 (activeView === "form" || activeView === "options") && (
//                   <div className="test-header">
//                     <div className="Components-header">
//                       <div
//                         className="homepage-car-icon-container"
//                         onClick={showDeliveryForm}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <img
//                           className={`homepage-car-icon ${
//                             activeIcon === "icon1" ? "active-icon" : ""
//                           }`}
//                           src={carIcon}
//                           alt="Car Icon"
//                         />
//                         <label
//                           className={`homepage-icons-label ${
//                             activeIcon === "icon1" ? "activelabel" : ""
//                           }`}
//                         >
//                           Direction
//                         </label>
//                         {activeIcon === "icon1" && (
//                           <hr className="Components-header-icons-hr" />
//                         )}
//                       </div>
//                       <div
//                         className="homepage-vector-icon-container"
//                         onClick={showDeliveryOptions}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <img
//                           className={`vector-icon ${
//                             activeIcon === "icon2" ? "active-icon" : ""
//                           }`}
//                           src={Vector}
//                           alt="Vector Icon"
//                         />
//                         <label
//                           className={`homepage-icons-label ${
//                             activeIcon === "icon2" ? "activelabel" : ""
//                           }`}
//                         >
//                           Packages
//                         </label>
//                         {activeIcon === "icon2" && (
//                           <hr className="Components-header-icons-hr" />
//                         )}
//                       </div>
//                     </div>
//                     <hr className="header-hr" />
//                   </div>
//                 )}

//               <div className="Components-container2">{renderMainContent()}</div>
//             </div>
//             {selectedDelivery && (
//               <div
//                 className={`delivery-info-panel ${
//                   selectedDelivery ? "open" : ""
//                 } ${isInfoPanelOpen ? "expanded" : ""}`}
//               >
//                 <DeliveryInfoPanel
//                   deliveryDetails={selectedDelivery}
//                   user={user}
//                   onClose={handleCloseInfoPanel}
//                   setShowCompleteProfile={setShowCompleteProfile}
//                   setShowForm={setShowForm}
//                   setIsAddPackageView={setIsAddPackageView}
//                   setShowProfile={setShowProfile}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {!isMobile && (
//           <div className="messaging-container" onClick={handleMessagingClick}>
//             <div className="avatar-message-container">
//               <UserAvatar user={user} />
//               <p>Messaging</p>
//             </div>
//             <img src={editIcon} />
//           </div>
//         )}
//       </div>

//       {isMobile && (
//         <MobileFooter
//           className={`mobile-footer-container ${
//             isInMessageView ? "hidden" : ""
//           }`}
//           onFooterClick={handleFooterClick}
//           activeIcon={activeIcon}
//         />
//       )}

//       {isModalOpen && (
//         <Delivery onClose={toggleModal} addNewDelivery={addNewDelivery} />
//       )}
//       {isProductModalOpen && (
//         <MyProductModal
//           onClose={toggleProductModal}
//           user={user}
//           deleteDelivery={deleteDelivery}
//           editDelivery={editDelivery}
//         />
//       )}
//     </div>
//   );
// };

// export default HomePage;
