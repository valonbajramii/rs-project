import React, { useState, useEffect } from "react";
import "./HomePage.css";
import DeliveryForm from "./DeliveryForm/DeliveryForm";
import DeliveryOptions from "./DeliveryOptions/DeliveryOptions";
import DeliveryMap from "./DeliveryMap/DeliveryMap";
import Delivery from "../Delivery/Delivery";
import profileImg from "../../icons/person-circle.svg";
import addDeliveryIcon from "../../icons/plus-circle-dotted.svg";
import { useNavigate } from "react-router-dom";
import audiImage from "../../images/2025_audi_q7_4dr-suv_prestige_fq_oem_1_1600.avif";
import mercedesImage from "../../images/2023-mercedes-amg-c63-s-e-performance-114-65d79698b0e26.avif";
import MyProductModal from "./MyProductModal/MyProductModal";
import { v4 as uuidv4 } from "uuid";

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

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

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleProductModal = () => {
    setIsProductModalOpen(!isProductModalOpen);
  };

  const editDelivery = (updatedDelivery) => {
    const updatedOptions = deliveryOptions.map((delivery) =>
      delivery.id === updatedDelivery.id ? updatedDelivery : delivery
    );
    setDeliveryOptions(updatedOptions);
  };

  return (
    <div className="Homepage-container">
      <header className="homepage-header">
        <img
          className="profile-icon"
          src={profileImg}
          alt="Profile"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        />
        <div className="add-buttons-container">
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
        </div>
      </header>
      <div className="Components-container">
        <DeliveryForm updateFilterCriteria={updateFilterCriteria} />
        <DeliveryOptions deliveryOptions={filteredOptions} user={user} />
        <DeliveryMap />
      </div>
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
          deleteDelivery={deleteDelivery} // Pass deleteDelivery function to modal
          editDelivery={editDelivery}
        />
      )}
    </div>
  );
};

export default HomePage;
