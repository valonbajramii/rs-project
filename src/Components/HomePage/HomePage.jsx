import React, { useState, useEffect } from "react";
import "./HomePage.css";
import DeliveryForm from "./DeliveryForm/DeliveryForm";
import DeliveryOptions from "./DeliveryOptions/DeliveryOptions";
import DeliveryMap from "./DeliveryMap/DeliveryMap";
import Delivery from "../Delivery/Delivery";
import profileImg from "../../icons/person-circle.svg";
import addDeliveryIcon from "../../icons/plus-circle-dotted.svg";
import { useNavigate } from "react-router-dom";
import audiImage from '../../images/2025_audi_q7_4dr-suv_prestige_fq_oem_1_1600.avif';
import mercedesImage from '../../images/2023-mercedes-amg-c63-s-e-performance-114-65d79698b0e26.avif';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for managing delivery options
  const [deliveryOptions, setDeliveryOptions] = useState([
    {
      name: "John Doe",
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
    },
    {
      name: "David Brown",
      image: mercedesImage,
      price: "200",
      location: "Kamenic",
      destination: "Prishtin",
      description: "Description",
      weightinKg: "20",
      length: "50cm",
      height: "50cm",
      width: "50cm",
      pickupTim: "2024-08-28T17:00",
    },
    // ... other initial deliveries
  ]);

  const [filterCriteria, setFilterCriteria] = useState({});
  const [filteredOptions, setFilteredOptions] = useState(deliveryOptions);

  // Handler to add a new delivery
  const addNewDelivery = (newDelivery) => {
    setDeliveryOptions((prevOptions) => [...prevOptions, newDelivery]);
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
        filtered = filtered.filter(option =>
          option.location.toLowerCase().includes(filterCriteria.location.toLowerCase())
        );
      }

      if (filterCriteria.destination) {
        filtered = filtered.filter(option =>
          option.destination.toLowerCase().includes(filterCriteria.destination.toLowerCase())
        );
      }

      if (filterCriteria.length) {
        filtered = filtered.filter(option =>
          parseInt(option.length) >= parseInt(filterCriteria.length)
        );
      }

      if (filterCriteria.height) {
        filtered = filtered.filter(option =>
          parseInt(option.height) >= parseInt(filterCriteria.height)
        );
      }

      if (filterCriteria.pickupTime) {
        filtered = filtered.filter(option =>
          new Date(option.pickupTim) >= new Date(filterCriteria.pickupTime)
        );
      }

      setFilteredOptions(filtered);
    };

    applyFilters();
  }, [filterCriteria, deliveryOptions]);

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile route
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  return (
    <div className="Homepage-container">
      <header className="homepage-header">
        <img
          className="profile-icon"
          src={profileImg}
          alt="Profile"
          onClick={handleProfileClick} // Add onClick handler
          style={{ cursor: "pointer" }} // Optional: Change cursor to pointer
        />
        <div className="add-delivery-container" onClick={toggleModal}>
          <img className="add-delivery-icon" src={addDeliveryIcon} alt="" />
          Add Delivery
        </div>
      </header>
      <div className="Components-container">
        <DeliveryForm updateFilterCriteria={updateFilterCriteria} />
        {/* Pass the filteredOptions instead of deliveryOptions */}
        <DeliveryOptions deliveryOptions={filteredOptions} />
        <DeliveryMap />
      </div>
      {isModalOpen && (
        <Delivery
          onClose={toggleModal}
          addNewDelivery={(delivery) => addNewDelivery({ ...delivery, name: user.name })}
        />
      )}
    </div>
  );
};

export default HomePage;