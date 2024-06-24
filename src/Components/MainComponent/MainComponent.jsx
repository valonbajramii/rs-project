import React from "react";
import "./MainComponent.css";
import DeliveryForm from "./DeliveryForm/DeliveryForm";
import DeliveryOptions from "./DeliveryOptions/DeliveryOptions";
import DeliveryMap from "./DeliveryMap/DeliveryMap";

const MainComponent = () => {
  return (
    <div className="main-container">
      <DeliveryForm />
      <DeliveryOptions />
      <DeliveryMap />
    </div>
  );
};

export default MainComponent;
