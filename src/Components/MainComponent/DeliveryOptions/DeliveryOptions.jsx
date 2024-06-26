// import React from "react";
// import "./DeliveryOptions.css";
// import CarIcon from "../../../icons/car-front-fill.svg";

// const DeliveryOptions = () => {
//   const deliveryOptions = [
//     {
//       image: CarIcon,
//       name: "John Doe",
//       rating: 4.5,
//       price: "100.- CHF",
//     },
//     {
//       image: CarIcon,
//       name: "Jane Doe",
//       rating: 4.7,
//       price: "120.- CHF",
//     },
//     {
//       image: CarIcon,
//       name: "Jane Doe",
//       rating: 4.7,
//       price: "120.- CHF",
//     },
//     {
//       image: CarIcon,
//       name: "Jane Doe",
//       rating: 4.7,
//       price: "120.- CHF",
//     },
//   ];

//   return (
//     <div className="delivery-option-container">
//       <h2 className="deliver-option-h2">Choose Delivery</h2>
//       <hr />
//       <div>
//         {deliveryOptions.map((option, index) => (
//           <div key={index} className="delivery-option">
//             <div className="delivery-option2">
//               <img
//                 className="car-icon"
//                 src={option.image}
//                 alt="Delivery Icon"
//               />
//               <div>
//                 <p>{option.name}</p>
//                 <p>Rating: {option.rating}</p>
//               </div>
//               <p>{option.price}</p>
//             </div>
//             <hr />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DeliveryOptions;

import React from "react";
import "./DeliveryOptions.css";
import CarIcon from "../../../icons/car-front-fill.svg";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const DeliveryOptions = () => {
  const deliveryOptions = [
    {
      image: CarIcon,
      name: "John Doe",
      rating: 4.5,
      price: "100.- CHF",
    },
    {
      image: CarIcon,
      name: "Jane Doe",
      rating: 4,
      price: "120.- CHF",
    },
    {
      image: CarIcon,
      name: "Jane Doe",
      rating: 4.7,
      price: "120.- CHF",
    },
    {
      image: CarIcon,
      name: "Jane Doe",
      rating: 3,
      price: "120.- CHF",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  return (
    <div className="delivery-option-container">
      <h2 className="deliver-option-h2">Choose Delivery</h2>
      <hr />
      <div>
        {deliveryOptions.map((option, index) => (
          <div key={index} className="delivery-option">
            <div className="delivery-option2">
              <img
                className="car-icon"
                src={option.image}
                alt="Delivery Icon"
              />
              <div>
                <p>{option.name}</p>
                <div className="rating">{renderStars(option.rating)}</div>
              </div>
              <p>{option.price}</p>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryOptions;
