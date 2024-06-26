// import React from "react";
// import "./DeliveryMap.css";

// const DeliveryMap = () => {
//   return (
//     <div className="map-container">
//       {/* Map integration code here */}
//       <h2>Map</h2>
//       <div id="map"></div>
//     </div>
//   );
// };

// export default DeliveryMap;

// import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "./DeliveryMap.css";

// import L from "leaflet";
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
// });

// L.Marker.prototype.options.icon = DefaultIcon;

// const LocationMarker = ({ setDestination }) => {
//   const [position, setPosition] = useState(null);
//   const map = useMapEvents({
//     click(e) {
//       setDestination(e.latlng);
//     },
//     locationfound(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, map.getZoom());
//     },
//   });

//   useEffect(() => {
//     map.locate();
//   }, [map]);

//   return position === null ? null : (
//     <Marker position={position}>
//       <Popup>You are here</Popup>
//     </Marker>
//   );
// };

// const DeliveryMap = () => {
//   const [destination, setDestination] = useState(null);

//   return (
//     <div className="map-container">
//       <h2>Map</h2>
//       <MapContainer
//         center={[51.505, -0.09]}
//         zoom={13}
//         style={{ height: "500px", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <LocationMarker setDestination={setDestination} />
//         {destination && (
//           <Marker position={destination}>
//             <Popup>Destination</Popup>
//           </Marker>
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default DeliveryMap;

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./DeliveryMap.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const MAPBOX_TOKEN = "YOUR_MAPBOX_ACCESS_TOKEN";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setUserLocation }) => {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      setUserLocation(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const DeliveryMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (userLocation && destination) {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((coord) => ({
              lat: coord[1],
              lng: coord[0],
            }));
            setRoute(coords);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [userLocation, destination]);

  const handleMapClick = (e) => {
    setDestination(e.latlng);
  };

  return (
    <div className="map-container">
      <h2>Map</h2>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker setUserLocation={setUserLocation} />
        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        {route.length > 0 && <Polyline positions={route} />}
      </MapContainer>
    </div>
  );
};

export default DeliveryMap;
