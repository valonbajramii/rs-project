// import React, { useRef, useEffect, useState, useCallback } from "react";
// import "./HEREDeliveryMap.css";
// import { calculateRoute, decodePolyline } from "../../../utils/hereRouting";
// import geoFilIcon from "../../../icons/geo-alt-fill.svg";

// const HEREDeliveryMap = ({ userLocation, destination, showRoute = false }) => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const routeLineRef = useRef(null);
//   const markersRef = useRef([]);

//   const originIconRef = useRef(null);
//   const destinationIconRef = useRef(null);

//   const [map, setMap] = useState(null);
//   const [routeLoading, setRouteLoading] = useState(false);
//   const [error, setError] = useState("");

//   // ================= MAP INIT =================
//   const initializeMap = useCallback(() => {
//     if (!mapRef.current || !window.H) return;

//     try {
//       const platform = new window.H.service.Platform({
//         apikey: "IWbj9t2I4YTh0ipZ6OtXe2cUbZ0mQ-1MY1LhPOMeCq4",
//       });

//       const layers = platform.createDefaultLayers();

//       const mapInstance = new window.H.Map(
//         mapRef.current,
//         layers.vector.normal.map,
//         {
//           center: { lat: 42.6629, lng: 21.1655 },
//           zoom: 8,
//           pixelRatio: window.devicePixelRatio || 1,
//         }
//       );

//       new window.H.mapevents.Behavior(
//         new window.H.mapevents.MapEvents(mapInstance)
//       );

//       window.H.ui.UI.createDefault(mapInstance, layers);

//       mapInstanceRef.current = mapInstance;
//       setMap(mapInstance);

//       setTimeout(() => mapInstance.getViewPort().resize(), 300);
//     } catch (e) {
//       console.error(e);
//       setError("Failed to load HERE map");
//     }
//   }, []);

//   useEffect(() => {
//     const waitForSDK = () => {
//       if (window.H && window.H.Map) initializeMap();
//       else setTimeout(waitForSDK, 100);
//     };
//     waitForSDK();

//     return () => {
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.dispose();
//       }
//     };
//   }, [initializeMap]);

//   // ================= ICONS (SAFE DATA-URL SVG) =================
//   useEffect(() => {
//     if (!map || !window.H) return;

//     // 🟢 ORIGIN → rreth (si më parë)
//     const createSvgIcon = (color) => {
//       const svg = `
//       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
//         <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
//         <circle cx="16" cy="16" r="6" fill="white"/>
//       </svg>
//     `;

//       return new window.H.map.Icon(
//         `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
//         {
//           size: { w: 32, h: 32 },
//           anchor: { x: 16, y: 16 },
//         }
//       );
//     };

//     originIconRef.current = createSvgIcon("#4285F4"); // BLUE

//     // 🔴 DESTINATION → Bootstrap SVG PIN
//     destinationIconRef.current = new window.H.map.Icon(geoFilIcon, {
//       size: { w: 32, h: 32 },
//       anchor: { x: 16, y: 32 }, // PIN TOUCHES GROUND
//     });
//   }, [map]);

//   // ================= MARKERS =================
//   useEffect(() => {
//     if (!map) return;

//     // Remove old markers safely
//     markersRef.current.forEach((m) => {
//       if (m && map.hasObject && map.hasObject(m)) {
//         map.removeObject(m);
//       }
//     });
//     markersRef.current = [];

//     // Add origin marker
//     if (userLocation && originIconRef.current) {
//       const m = new window.H.map.Marker(userLocation, {
//         icon: originIconRef.current,
//       });
//       map.addObject(m);
//       markersRef.current.push(m);
//     }

//     // Add destination marker
//     if (destination && destinationIconRef.current) {
//       const m = new window.H.map.Marker(destination, {
//         icon: destinationIconRef.current,
//       });
//       map.addObject(m);
//       markersRef.current.push(m);
//     }
//   }, [map, userLocation, destination]);

//   // ================= ROUTE =================
//   const drawRoute = useCallback(async () => {
//     if (!map || !userLocation || !destination) return;

//     setRouteLoading(true);

//     if (routeLineRef.current) {
//       map.removeObject(routeLineRef.current);
//       routeLineRef.current = null;
//     }

//     try {
//       const route = await calculateRoute(userLocation, destination);
//       const polyline = route?.sections?.[0]?.polyline;

//       if (polyline) {
//         const lineString = decodePolyline(polyline);
//         const routeLine = new window.H.map.Polyline(lineString, {
//           style: { strokeColor: "#2F80ED", lineWidth: 6 },
//         });
//         map.addObject(routeLine);
//         routeLineRef.current = routeLine;
//       }
//     } catch {
//       const ls = new window.H.geo.LineString();
//       ls.pushPoint(userLocation);
//       ls.pushPoint(destination);

//       const fallback = new window.H.map.Polyline(ls, {
//         style: { strokeColor: "#FF9900", lineWidth: 4, lineDash: [8, 4] },
//       });

//       map.addObject(fallback);
//       routeLineRef.current = fallback;
//     }

//     map.getViewModel().setLookAtData({
//       bounds: new window.H.geo.Rect(
//         Math.min(userLocation.lat, destination.lat),
//         Math.min(userLocation.lng, destination.lng),
//         Math.max(userLocation.lat, destination.lat),
//         Math.max(userLocation.lng, destination.lng)
//       ),
//       padding: { top: 50, left: 50, right: 50, bottom: 50 },
//     });

//     setRouteLoading(false);
//   }, [map, userLocation, destination]);

//   useEffect(() => {
//     if (map && showRoute) setTimeout(drawRoute, 300);
//   }, [map, showRoute, drawRoute]);

//   // ================= RENDER =================
//   return (
//     <div className="here-map-container">
//       <div
//         ref={mapRef}
//         className="map-canvas"
//         style={{ width: "100%", height: "100%" }}
//       />

//       {routeLoading && (
//         <div className="route-loading">
//           <div className="loading-spinner small" />
//           <p>Calculating route...</p>
//         </div>
//       )}

//       {error && (
//         <div className="map-error">
//           <p>{error}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HEREDeliveryMap;
///////////////////////////////////////////////////////////////////////////////////.............................................///////////////////////
// import React, { useRef, useEffect, useState, useCallback } from "react";
// import "./HEREDeliveryMap.css";
// import {
//   calculateRoute,
//   decodePolyline,
//   geocodeAddress,
// } from "../../../utils/hereRouting";
// import geoFilIcon from "../../../icons/geo-alt-fill.svg";

// const HEREDeliveryMap = ({
//   userLocation,
//   destination,
//   showRoute = false,
//   packages = [],
//   routeLocation = "",
//   routeDestination = "",
//   onPackageClick = null,
//   selectedPackage = null,
// }) => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const routeLineRef = useRef(null);
//   const markersRef = useRef([]);
//   const packageMarkersRef = useRef([]);
//   const packageRouteLineRef = useRef(null);
//   const packageSpecificMarkersRef = useRef([]);
//   const mapEventsRef = useRef(null);
//   const cleanupRef = useRef(false);

//   const originIconRef = useRef(null);
//   const destinationIconRef = useRef(null);
//   const matchingPackageIconRef = useRef(null);
//   const otherPackageIconRef = useRef(null);
//   const packageOriginIconRef = useRef(null);
//   const packageDestinationIconRef = useRef(null);

//   const [map, setMap] = useState(null);
//   const [mapInitialized, setMapInitialized] = useState(false);
//   const [routeLoading, setRouteLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [packageCoordinates, setPackageCoordinates] = useState({});
//   const [localSelectedPackage, setLocalSelectedPackage] = useState(null);
//   const [packageRouteLoading, setPackageRouteLoading] = useState(false);
//   const [sdkReady, setSdkReady] = useState(false);
//   const [iconsReady, setIconsReady] = useState(false);

//   // ================= COMPLETE CLEANUP =================
//   const cleanupMap = useCallback(() => {
//     if (cleanupRef.current) return;
//     cleanupRef.current = true;

//     console.log("🧹 Cleaning up map...");

//     // Remove event listeners
//     if (mapEventsRef.current && mapInstanceRef.current) {
//       try {
//         mapInstanceRef.current.removeEventListener("tap", mapEventsRef.current);
//       } catch (e) {
//         console.warn("Error removing map event listener:", e);
//       }
//       mapEventsRef.current = null;
//     }

//     // Dispose map instance
//     if (mapInstanceRef.current) {
//       try {
//         mapInstanceRef.current.dispose();
//         console.log("✅ Map disposed");
//       } catch (e) {
//         console.warn("Error disposing map:", e);
//       }
//       mapInstanceRef.current = null;
//     }

//     // Clear all refs
//     routeLineRef.current = null;
//     markersRef.current = [];
//     packageMarkersRef.current = [];
//     packageRouteLineRef.current = null;
//     packageSpecificMarkersRef.current = [];

//     setMap(null);
//     setMapInitialized(false);
//     setLocalSelectedPackage(null);
//     setPackageCoordinates({});
//     cleanupRef.current = false;
//   }, []);

//   // ================= CHECK SDK READY =================
//   useEffect(() => {
//     const checkSDK = () => {
//       if (window.H && window.H.service && window.H.Map && window.H.ui) {
//         console.log("✅ HERE SDK is fully loaded");
//         setSdkReady(true);
//         return true;
//       }
//       return false;
//     };

//     if (checkSDK()) return;

//     const interval = setInterval(() => {
//       if (checkSDK()) {
//         clearInterval(interval);
//       }
//     }, 100);

//     return () => {
//       clearInterval(interval);
//       cleanupMap();
//     };
//   }, [cleanupMap]);

//   // ================= SYNC SELECTED PACKAGE FROM PARENT =================
//   useEffect(() => {
//     if (selectedPackage && packageCoordinates[selectedPackage.id]) {
//       const coords = packageCoordinates[selectedPackage.id];
//       showPackageRoute(selectedPackage, coords);
//       setLocalSelectedPackage(selectedPackage);
//     } else if (!selectedPackage && localSelectedPackage) {
//       clearPackageRoute();
//       setLocalSelectedPackage(null);
//     }
//   }, [selectedPackage, packageCoordinates]);

//   // ================= CLEAR PACKAGE ROUTE =================
//   const clearPackageRoute = useCallback(() => {
//     if (!mapInstanceRef.current) return;

//     console.log("🧹 Clearing package route...");

//     // Remove package route line
//     if (packageRouteLineRef.current) {
//       try {
//         if (mapInstanceRef.current.hasObject(packageRouteLineRef.current)) {
//           mapInstanceRef.current.removeObject(packageRouteLineRef.current);
//         }
//       } catch (e) {
//         console.warn("Error removing package route line:", e);
//       }
//       packageRouteLineRef.current = null;
//     }

//     // Remove package-specific markers
//     packageSpecificMarkersRef.current.forEach((marker) => {
//       try {
//         if (marker && mapInstanceRef.current.hasObject(marker)) {
//           mapInstanceRef.current.removeObject(marker);
//         }
//       } catch (e) {
//         console.warn("Error removing package marker:", e);
//       }
//     });
//     packageSpecificMarkersRef.current = [];

//     // Remove any info bubbles
//     if (mapInstanceRef.current) {
//       mapInstanceRef.current.getObjects().forEach((obj) => {
//         if (obj instanceof window.H.ui.InfoBubble) {
//           try {
//             mapInstanceRef.current.removeObject(obj);
//           } catch (e) {
//             console.warn("Error removing info bubble:", e);
//           }
//         }
//       });
//     }

//     setLocalSelectedPackage(null);
//     console.log("✅ Package route cleared");
//   }, []);

//   // ================= SHOW PACKAGE ROUTE =================
//   const showPackageRoute = useCallback(
//     async (packageData, markerData) => {
//       if (
//         !mapInstanceRef.current ||
//         !packageData ||
//         !markerData ||
//         !iconsReady
//       ) {
//         console.warn("Cannot show package route - missing requirements:", {
//           map: !!mapInstanceRef.current,
//           packageData: !!packageData,
//           markerData: !!markerData,
//           iconsReady,
//         });
//         return;
//       }

//       console.log("📍 Showing package route for:", packageData.name);

//       setPackageRouteLoading(true);
//       setLocalSelectedPackage(packageData);

//       // Clear previous package route first
//       clearPackageRoute();

//       try {
//         // Check if icons are ready
//         if (
//           !packageOriginIconRef.current ||
//           !packageDestinationIconRef.current
//         ) {
//           console.error("Package route icons not ready!");
//           return;
//         }

//         // Geocode package destination
//         const packageDestCoords = await geocodeAddress(packageData.destination);

//         console.log("📍 Package destination coordinates:", packageDestCoords);

//         // Validate coordinates
//         if (
//           !packageDestCoords ||
//           typeof packageDestCoords.lat !== "number" ||
//           typeof packageDestCoords.lng !== "number" ||
//           !markerData.lat ||
//           !markerData.lng
//         ) {
//           console.error("❌ Invalid coordinates for package route");
//           return;
//         }

//         // Create package origin marker
//         const originMarker = new window.H.map.Marker(
//           { lat: markerData.lat, lng: markerData.lng },
//           {
//             icon: packageOriginIconRef.current,
//             zIndex: 150,
//           },
//         );

//         // Create package destination marker
//         const destMarker = new window.H.map.Marker(
//           { lat: packageDestCoords.lat, lng: packageDestCoords.lng },
//           {
//             icon: packageDestinationIconRef.current,
//             zIndex: 150,
//           },
//         );

//         // Add markers to map
//         if (originMarker && destMarker) {
//           mapInstanceRef.current.addObject(originMarker);
//           mapInstanceRef.current.addObject(destMarker);

//           // Store references
//           packageSpecificMarkersRef.current.push(originMarker, destMarker);
//         }

//         // Calculate and draw package route
//         const route = await calculateRoute(
//           { lat: markerData.lat, lng: markerData.lng },
//           { lat: packageDestCoords.lat, lng: packageDestCoords.lng },
//         );

//         console.log("📍 Package route calculated:", route);

//         const polyline = route?.sections?.[0]?.polyline;

//         if (polyline) {
//           const lineString = decodePolyline(polyline);
//           if (
//             lineString &&
//             lineString.getPointCount &&
//             lineString.getPointCount() > 0
//           ) {
//             const routeLine = new window.H.map.Polyline(lineString, {
//               style: {
//                 strokeColor: "#9C27B0",
//                 lineWidth: 4,
//                 lineDash: [6, 3],
//                 zIndex: 75,
//               },
//               zIndex: 75,
//             });

//             if (routeLine) {
//               mapInstanceRef.current.addObject(routeLine);
//               packageRouteLineRef.current = routeLine;
//             }
//           }
//         }

//         // Adjust view to show both routes
//         const pointsToShow = [
//           userLocation,
//           destination,
//           { lat: markerData.lat, lng: markerData.lng },
//           { lat: packageDestCoords.lat, lng: packageDestCoords.lng },
//         ].filter(
//           (p) => p && typeof p.lat === "number" && typeof p.lng === "number",
//         );

//         if (pointsToShow.length > 0) {
//           try {
//             const bounds = new window.H.geo.Rect(
//               Math.min(...pointsToShow.map((p) => p.lat)),
//               Math.min(...pointsToShow.map((p) => p.lng)),
//               Math.max(...pointsToShow.map((p) => p.lat)),
//               Math.max(...pointsToShow.map((p) => p.lng)),
//             );

//             mapInstanceRef.current.getViewModel().setLookAtData({
//               bounds: bounds,
//               padding: { top: 60, left: 60, right: 60, bottom: 100 },
//             });
//           } catch (boundsError) {
//             console.warn("Error setting map bounds:", boundsError);
//           }
//         }
//       } catch (error) {
//         console.error("❌ Failed to show package route:", error);
//       }

//       setPackageRouteLoading(false);
//     },
//     [userLocation, destination, clearPackageRoute, iconsReady],
//   );

//   // ================= SAFE MAP INITIALIZATION =================
//   const initializeMap = useCallback(() => {
//     if (!mapRef.current || !sdkReady) {
//       console.log("⚠️ Map initialization delayed - waiting for SDK");
//       return;
//     }

//     // Check if already initialized
//     if (mapInstanceRef.current) {
//       console.log("⚠️ Map already initialized");
//       return;
//     }

//     try {
//       console.log("🗺️ Initializing HERE Map...");

//       // Check if container exists and has dimensions
//       if (
//         !mapRef.current ||
//         mapRef.current.offsetWidth === 0 ||
//         mapRef.current.offsetHeight === 0
//       ) {
//         console.warn("⚠️ Map container has zero dimensions");
//         setTimeout(initializeMap, 100);
//         return;
//       }

//       const platform = new window.H.service.Platform({
//         apikey: "IWbj9t2I4YTh0ipZ6OtXe2cUbZ0mQ-1MY1LhPOMeCq4",
//       });

//       const layers = platform.createDefaultLayers();

//       const mapInstance = new window.H.Map(
//         mapRef.current,
//         layers.vector.normal.map,
//         {
//           center: { lat: 42.6629, lng: 21.1655 },
//           zoom: 8,
//           pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
//         },
//       );

//       // Add behavior
//       new window.H.mapevents.Behavior(
//         new window.H.mapevents.MapEvents(mapInstance),
//       );

//       // Create default UI
//       window.H.ui.UI.createDefault(mapInstance, layers);

//       mapInstanceRef.current = mapInstance;
//       setMap(mapInstance);
//       setMapInitialized(true);

//       // Add map click handler
//       const handleMapClick = (evt) => {
//         const target = evt.target;
//         if (!(target instanceof window.H.map.Marker)) {
//           clearPackageRoute();
//           if (onPackageClick) {
//             onPackageClick(null);
//           }
//         }
//       };

//       mapEventsRef.current = handleMapClick;
//       mapInstance.addEventListener("tap", handleMapClick);

//       // Force resize after a short delay
//       setTimeout(() => {
//         if (mapInstance.getViewPort()) {
//           mapInstance.getViewPort().resize();
//         }
//       }, 100);

//       console.log("✅ HERE Map initialized successfully");
//     } catch (e) {
//       console.error("❌ Failed to initialize map:", e);
//       setError("Failed to load map. Please refresh the page.");
//     }
//   }, [sdkReady, clearPackageRoute, onPackageClick]);

//   // ================= INITIALIZE MAP ONCE SDK IS READY =================
//   useEffect(() => {
//     if (sdkReady && !mapInitialized) {
//       // Small delay to ensure DOM is ready
//       const timer = setTimeout(() => {
//         initializeMap();
//       }, 300);
//       return () => clearTimeout(timer);
//     }
//   }, [sdkReady, mapInitialized, initializeMap]);

//   // ================= CLEANUP ON UNMOUNT =================
//   useEffect(() => {
//     return () => {
//       console.log("🔄 HEREDeliveryMap unmounting, cleaning up...");
//       cleanupMap();
//     };
//   }, [cleanupMap]);

//   // ================= CREATE ICONS =================
//   const createIcons = useCallback(() => {
//     if (!window.H || !mapInstanceRef.current) return;

//     try {
//       // Circle icon for origin
//       const createCircleIcon = (color) => {
//         const svg = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
//           <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
//           <circle cx="16" cy="16" r="6" fill="white"/>
//         </svg>`;
//         return new window.H.map.Icon(
//           `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
//           { size: { w: 32, h: 32 }, anchor: { x: 16, y: 16 } },
//         );
//       };

//       // Package icon
//       const createPackageIcon = (color) => {
//         const svg = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
//           <rect x="6" y="6" width="20" height="20" rx="4" fill="${color}" stroke="white" stroke-width="2"/>
//           <path d="M12 12 L20 12 L20 20 L12 20 Z" fill="white" fill-opacity="0.8"/>
//         </svg>`;
//         return new window.H.map.Icon(
//           `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
//           { size: { w: 32, h: 32 }, anchor: { x: 16, y: 16 } },
//         );
//       };

//       // Small circle for package route
//       const createSmallCircleIcon = (color) => {
//         const svg = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
//           <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
//           <circle cx="12" cy="12" r="4" fill="white"/>
//         </svg>`;
//         return new window.H.map.Icon(
//           `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
//           { size: { w: 24, h: 24 }, anchor: { x: 12, y: 12 } },
//         );
//       };

//       originIconRef.current = createCircleIcon("#4285F4");
//       matchingPackageIconRef.current = createPackageIcon("#4CAF50");
//       otherPackageIconRef.current = createPackageIcon("#FF9800");
//       packageOriginIconRef.current = createSmallCircleIcon("#9C27B0");
//       packageDestinationIconRef.current = createSmallCircleIcon("#E91E63");

//       destinationIconRef.current = new window.H.map.Icon(geoFilIcon, {
//         size: { w: 32, h: 32 },
//         anchor: { x: 16, y: 32 },
//       });

//       setIconsReady(true);
//       console.log("✅ Icons created successfully");
//     } catch (e) {
//       console.error("Error creating icons:", e);
//     }
//   }, []);

//   useEffect(() => {
//     if (mapInstanceRef.current) {
//       createIcons();
//     }
//   }, [mapInstanceRef.current, createIcons]);

//   // ================= CHECK IF ICONS ARE READY =================
//   const checkIconsReady = useCallback(() => {
//     return (
//       originIconRef.current &&
//       destinationIconRef.current &&
//       matchingPackageIconRef.current &&
//       otherPackageIconRef.current &&
//       packageOriginIconRef.current &&
//       packageDestinationIconRef.current
//     );
//   }, []);

//   // ================= GEOCODE PACKAGES =================
//   const geocodePackages = useCallback(async () => {
//     if (!packages.length || !mapInstanceRef.current) return;

//     console.log("📍 Geocoding package locations...");

//     const coordinates = {};
//     const geocodePromises = [];

//     for (const pkg of packages) {
//       if (pkg.location && !coordinates[pkg.id]) {
//         geocodePromises.push(
//           (async () => {
//             try {
//               const result = await geocodeAddress(pkg.location);
//               coordinates[pkg.id] = {
//                 lat: result.lat,
//                 lng: result.lng,
//                 name: pkg.name,
//                 location: pkg.location,
//                 destination: pkg.destination,
//                 isMatching:
//                   routeLocation &&
//                   routeDestination &&
//                   (pkg.location
//                     .toLowerCase()
//                     .includes(routeLocation.toLowerCase()) ||
//                     pkg.destination
//                       .toLowerCase()
//                       .includes(routeDestination.toLowerCase())),
//               };
//             } catch (error) {
//               console.warn(`Failed to geocode ${pkg.location}:`, error);
//               // Fallback coordinates
//               coordinates[pkg.id] = {
//                 lat: 42.6629 + (Math.random() - 0.5) * 0.5,
//                 lng: 21.1655 + (Math.random() - 0.5) * 0.5,
//                 name: pkg.name,
//                 location: pkg.location,
//                 destination: pkg.destination,
//                 isMatching: false,
//               };
//             }
//           })(),
//         );
//       }
//     }

//     await Promise.all(geocodePromises);
//     setPackageCoordinates(coordinates);
//     console.log(`✅ Geocoded ${Object.keys(coordinates).length} packages`);
//   }, [packages, routeLocation, routeDestination]);

//   // ================= ADD PACKAGE MARKERS =================
//   const addPackageMarkers = useCallback(() => {
//     if (
//       !mapInstanceRef.current ||
//       !window.H ||
//       Object.keys(packageCoordinates).length === 0 ||
//       !checkIconsReady()
//     ) {
//       console.warn("Cannot add package markers - missing requirements:", {
//         map: !!mapInstanceRef.current,
//         windowH: !!window.H,
//         packageCount: Object.keys(packageCoordinates).length,
//         iconsReady: checkIconsReady(),
//       });
//       return;
//     }

//     // Remove existing package markers
//     packageMarkersRef.current.forEach((marker) => {
//       try {
//         if (marker && mapInstanceRef.current.hasObject(marker)) {
//           mapInstanceRef.current.removeObject(marker);
//         }
//       } catch (e) {
//         console.warn("Error removing marker:", e);
//       }
//     });
//     packageMarkersRef.current = [];

//     // Add new markers
//     Object.entries(packageCoordinates).forEach(([packageId, coords]) => {
//       try {
//         // Validate coordinates
//         if (!coords.lat || !coords.lng) {
//           console.warn(`Invalid coordinates for package ${packageId}:`, coords);
//           return;
//         }

//         const icon = coords.isMatching
//           ? matchingPackageIconRef.current
//           : otherPackageIconRef.current;

//         if (!icon) {
//           console.warn("Icon not ready for package:", packageId);
//           return;
//         }

//         const marker = new window.H.map.Marker(
//           { lat: coords.lat, lng: coords.lng },
//           {
//             icon: icon,
//             data: { packageId, ...coords },
//           },
//         );

//         // Add click event
//         marker.addEventListener("tap", (evt) => {
//           const markerData = evt.target.getData();
//           const clickedPackage = packages.find(
//             (p) => p.id === markerData.packageId,
//           );

//           // Remove existing info bubbles
//           mapInstanceRef.current.getObjects().forEach((obj) => {
//             if (obj instanceof window.H.ui.InfoBubble) {
//               mapInstanceRef.current.removeObject(obj);
//             }
//           });

//           // Show info bubble
//           const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
//             content: `
//                 <div style="padding: 10px; font-family: Arial, sans-serif; max-width: 250px;">
//                   <h3 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">${
//                     markerData.name
//                   }</h3>
//                   <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">
//                     <strong>📍 Pickup:</strong> ${markerData.location}
//                   </p>
//                   <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">
//                     <strong>🎯 Delivery:</strong> ${markerData.destination}
//                   </p>
//                   ${
//                     markerData.isMatching
//                       ? '<span style="display: inline-block; background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">Matches Your Route</span>'
//                       : '<span style="display: inline-block; background: #FF9800; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">Other Package</span>'
//                   }
//                 </div>
//               `,
//           });

//           mapInstanceRef.current.addObject(bubble);

//           // Callback if provided
//           if (onPackageClick && clickedPackage) {
//             onPackageClick(clickedPackage);
//           }

//           // Show package route
//           if (clickedPackage) {
//             showPackageRoute(clickedPackage, markerData);
//           }
//         });

//         mapInstanceRef.current.addObject(marker);
//         packageMarkersRef.current.push(marker);
//       } catch (e) {
//         console.error("Error adding package marker:", e);
//       }
//     });

//     console.log(`📍 Added ${packageMarkersRef.current.length} package markers`);
//   }, [
//     packageCoordinates,
//     packages,
//     onPackageClick,
//     showPackageRoute,
//     checkIconsReady,
//   ]);

//   // ================= ADJUST MAP VIEW =================
//   const adjustMapView = useCallback(
//     (points) => {
//       if (!mapInstanceRef.current || !window.H || points.length === 0) return;

//       try {
//         const bounds = new window.H.geo.Rect(
//           Math.min(...points.map((p) => p.lat)),
//           Math.min(...points.map((p) => p.lng)),
//           Math.max(...points.map((p) => p.lat)),
//           Math.max(...points.map((p) => p.lng)),
//         );

//         mapInstanceRef.current.getViewModel().setLookAtData({
//           bounds: bounds,
//           padding: {
//             top: 50,
//             left: 50,
//             right: 50,
//             bottom: localSelectedPackage ? 100 : 50,
//           },
//         });
//       } catch (e) {
//         console.warn("Error adjusting map view:", e);
//       }
//     },
//     [localSelectedPackage],
//   );

//   // ================= ADD ROUTE MARKERS =================
//   const addRouteMarkers = useCallback(() => {
//     if (!mapInstanceRef.current || !window.H || !checkIconsReady()) return;

//     // Remove old markers
//     markersRef.current.forEach((m) => {
//       try {
//         if (m && mapInstanceRef.current.hasObject(m)) {
//           mapInstanceRef.current.removeObject(m);
//         }
//       } catch (e) {
//         console.warn("Error removing marker:", e);
//       }
//     });
//     markersRef.current = [];

//     // Add origin marker
//     if (
//       userLocation &&
//       originIconRef.current &&
//       typeof userLocation.lat === "number" &&
//       typeof userLocation.lng === "number"
//     ) {
//       try {
//         const marker = new window.H.map.Marker(userLocation, {
//           icon: originIconRef.current,
//           zIndex: 100,
//         });
//         mapInstanceRef.current.addObject(marker);
//         markersRef.current.push(marker);
//       } catch (e) {
//         console.error("Error adding origin marker:", e);
//       }
//     }

//     // Add destination marker
//     if (
//       destination &&
//       destinationIconRef.current &&
//       typeof destination.lat === "number" &&
//       typeof destination.lng === "number"
//     ) {
//       try {
//         const marker = new window.H.map.Marker(destination, {
//           icon: destinationIconRef.current,
//           zIndex: 100,
//         });
//         mapInstanceRef.current.addObject(marker);
//         markersRef.current.push(marker);
//       } catch (e) {
//         console.error("Error adding destination marker:", e);
//       }
//     }
//   }, [userLocation, destination, checkIconsReady]);

//   useEffect(() => {
//     if (mapInstanceRef.current && checkIconsReady()) {
//       addRouteMarkers();
//     }
//   }, [
//     mapInstanceRef.current,
//     userLocation,
//     destination,
//     addRouteMarkers,
//     checkIconsReady,
//   ]);

//   // ================= DRAW ROUTE =================
//   const drawRoute = useCallback(async () => {
//     if (!mapInstanceRef.current || !userLocation || !destination) return;

//     setRouteLoading(true);

//     // Remove existing route
//     if (
//       routeLineRef.current &&
//       mapInstanceRef.current.hasObject(routeLineRef.current)
//     ) {
//       mapInstanceRef.current.removeObject(routeLineRef.current);
//       routeLineRef.current = null;
//     }

//     try {
//       const route = await calculateRoute(userLocation, destination);
//       const polyline = route?.sections?.[0]?.polyline;

//       if (polyline) {
//         const lineString = decodePolyline(polyline);
//         if (
//           lineString &&
//           lineString.getPointCount &&
//           lineString.getPointCount() > 0
//         ) {
//           const routeLine = new window.H.map.Polyline(lineString, {
//             style: {
//               strokeColor: "#2F80ED",
//               lineWidth: 6,
//               zIndex: 50,
//             },
//             zIndex: 50,
//           });

//           if (routeLine) {
//             mapInstanceRef.current.addObject(routeLine);
//             routeLineRef.current = routeLine;
//           }
//         }
//       }

//       // Adjust view
//       adjustMapView([userLocation, destination]);
//     } catch (error) {
//       console.error("Failed to draw route:", error);
//       // Draw straight line as fallback
//       const ls = new window.H.geo.LineString();
//       ls.pushPoint(userLocation);
//       ls.pushPoint(destination);

//       const fallback = new window.H.map.Polyline(ls, {
//         style: {
//           strokeColor: "#FF9900",
//           lineWidth: 4,
//           lineDash: [8, 4],
//           zIndex: 50,
//         },
//         zIndex: 50,
//       });

//       if (fallback) {
//         mapInstanceRef.current.addObject(fallback);
//         routeLineRef.current = fallback;
//       }
//     }

//     setRouteLoading(false);
//   }, [userLocation, destination, adjustMapView]);

//   // ================= EFFECTS =================
//   // Geocode packages when they change
//   useEffect(() => {
//     if (mapInstanceRef.current && packages.length > 0) {
//       geocodePackages();
//     }
//   }, [mapInstanceRef.current, packages, geocodePackages]);

//   // Add package markers when coordinates are ready AND icons are ready
//   useEffect(() => {
//     if (
//       mapInstanceRef.current &&
//       Object.keys(packageCoordinates).length > 0 &&
//       checkIconsReady()
//     ) {
//       addPackageMarkers();
//     }
//   }, [
//     mapInstanceRef.current,
//     packageCoordinates,
//     addPackageMarkers,
//     checkIconsReady,
//   ]);

//   // Draw route when needed
//   useEffect(() => {
//     if (mapInstanceRef.current && showRoute && userLocation && destination) {
//       const timer = setTimeout(() => {
//         drawRoute();
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [mapInstanceRef.current, showRoute, drawRoute, userLocation, destination]);

//   // ================= RENDER =================
//   return (
//     <div className="here-map-container">
//       {/* SDK loading indicator */}
//       {!sdkReady && (
//         <div className="sdk-loading">
//           <div className="loading-spinner"></div>
//           <p>Loading map...</p>
//         </div>
//       )}

//       {/* Map container */}
//       <div
//         ref={mapRef}
//         className="map-canvas"
//         style={{
//           width: "100%",
//           height: "100%",
//           display: sdkReady ? "block" : "none",
//         }}
//       />

//       {/* Route loading indicator */}
//       {routeLoading && (
//         <div className="route-loading">
//           <div className="loading-spinner small"></div>
//           <p>Calculating route...</p>
//         </div>
//       )}

//       {/* Package route loading indicator */}
//       {packageRouteLoading && (
//         <div
//           className="route-loading"
//           style={{ top: localSelectedPackage ? "100px" : "80px" }}
//         >
//           <div className="loading-spinner small"></div>
//           <p>Calculating package route...</p>
//         </div>
//       )}

//       {/* Package count indicator */}
//       {mapInitialized &&
//         Object.keys(packageCoordinates).length > 0 &&
//         iconsReady && (
//           <div className="package-count-indicator">
//             <span className="package-count-badge">
//               📦 {Object.keys(packageCoordinates).length} packages on map
//             </span>
//             <div className="package-legend">
//               <div className="legend-item">
//                 <span className="legend-color matching"></span>
//                 <span>
//                   Matches route (
//                   {
//                     Object.values(packageCoordinates).filter(
//                       (c) => c.isMatching,
//                     ).length
//                   }
//                   )
//                 </span>
//               </div>
//               <div className="legend-item">
//                 <span className="legend-color other"></span>
//                 <span>
//                   Other packages (
//                   {
//                     Object.values(packageCoordinates).filter(
//                       (c) => !c.isMatching,
//                     ).length
//                   }
//                   )
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//       {/* Package route info */}
//       {localSelectedPackage && (
//         <div className="package-route-info">
//           <div className="package-route-header">
//             <h4>📦 {localSelectedPackage.name}</h4>
//             <button
//               className="close-package-route-btn"
//               onClick={() => {
//                 clearPackageRoute();
//                 // Also clear selection in parent
//                 if (onPackageClick) {
//                   onPackageClick(null);
//                 }
//               }}
//               aria-label="Close package route"
//             >
//               ×
//             </button>
//           </div>
//           <div className="package-route-details">
//             <p>
//               <strong>📍 Pickup:</strong> {localSelectedPackage.location}
//             </p>
//             <p>
//               <strong>🎯 Delivery:</strong> {localSelectedPackage.destination}
//             </p>
//             <p className="route-note">
//               <small>Purple dashed line shows package delivery route</small>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Error message */}
//       {error && (
//         <div className="map-error">
//           <p>{error}</p>
//           <button onClick={() => window.location.reload()}>Retry</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HEREDeliveryMap;

import React, { useRef, useEffect, useState, useCallback } from "react";
import "./HEREDeliveryMap.css";
import {
  calculateRoute,
  decodePolyline,
  geocodeAddress,
} from "../../../utils/hereRouting";
import geoFilIcon from "../../../icons/geo-alt-fill.svg";

const HEREDeliveryMap = ({
  userLocation,
  destination,
  showRoute = false,
  packages = [],
  routeLocation = "",
  routeDestination = "",
  onPackageClick = null,
  selectedPackage = null,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLineRef = useRef(null);
  const markersRef = useRef([]);
  const packageMarkersRef = useRef([]);
  const packageRouteLineRef = useRef(null);
  const packageSpecificMarkersRef = useRef([]);
  const mapEventsRef = useRef(null);
  const cleanupRef = useRef(false);

  const originIconRef = useRef(null);
  const destinationIconRef = useRef(null);
  const matchingPackageIconRef = useRef(null);
  const otherPackageIconRef = useRef(null);
  const packageOriginIconRef = useRef(null);
  const packageDestinationIconRef = useRef(null);

  const [map, setMap] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState("");
  const [packageCoordinates, setPackageCoordinates] = useState({});
  const [localSelectedPackage, setLocalSelectedPackage] = useState(null);
  const [packageRouteLoading, setPackageRouteLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [iconsReady, setIconsReady] = useState(false);

  // ================= COMPLETE CLEANUP =================
  const cleanupMap = useCallback(() => {
    if (cleanupRef.current) return;
    cleanupRef.current = true;

    console.log("🧹 Cleaning up map...");

    // Remove event listeners
    if (mapEventsRef.current && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.removeEventListener("tap", mapEventsRef.current);
      } catch (e) {
        console.warn("Error removing map event listener:", e);
      }
      mapEventsRef.current = null;
    }

    // Dispose map instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.dispose();
        console.log("✅ Map disposed");
      } catch (e) {
        console.warn("Error disposing map:", e);
      }
      mapInstanceRef.current = null;
    }

    // Clear all refs
    routeLineRef.current = null;
    markersRef.current = [];
    packageMarkersRef.current = [];
    packageRouteLineRef.current = null;
    packageSpecificMarkersRef.current = [];

    setMap(null);
    setMapInitialized(false);
    setLocalSelectedPackage(null);
    setPackageCoordinates({});
    cleanupRef.current = false;
  }, []);

  // ================= CHECK SDK READY =================
  useEffect(() => {
    const checkSDK = () => {
      if (window.H && window.H.service && window.H.Map && window.H.ui) {
        console.log("✅ HERE SDK is fully loaded");
        setSdkReady(true);
        return true;
      }
      return false;
    };

    if (checkSDK()) return;

    const interval = setInterval(() => {
      if (checkSDK()) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      cleanupMap();
    };
  }, [cleanupMap]);

  // ================= SYNC SELECTED PACKAGE FROM PARENT =================
  useEffect(() => {
    // When parent component clears selection, clear the route
    if (!selectedPackage && localSelectedPackage) {
      clearPackageRoute();
      setLocalSelectedPackage(null);
    }
    // Note: We DON'T automatically draw route when selectedPackage changes
    // Route drawing only happens when clicking on map markers
  }, [selectedPackage, localSelectedPackage]);

  // ================= CLEAR PACKAGE ROUTE =================
  const clearPackageRoute = useCallback(() => {
    if (!mapInstanceRef.current) return;

    console.log("🧹 Clearing package route...");

    // Remove package route line
    if (packageRouteLineRef.current) {
      try {
        if (mapInstanceRef.current.hasObject(packageRouteLineRef.current)) {
          mapInstanceRef.current.removeObject(packageRouteLineRef.current);
        }
      } catch (e) {
        console.warn("Error removing package route line:", e);
      }
      packageRouteLineRef.current = null;
    }

    // Remove package-specific markers
    packageSpecificMarkersRef.current.forEach((marker) => {
      try {
        if (marker && mapInstanceRef.current.hasObject(marker)) {
          mapInstanceRef.current.removeObject(marker);
        }
      } catch (e) {
        console.warn("Error removing package marker:", e);
      }
    });
    packageSpecificMarkersRef.current = [];

    // Remove any info bubbles
    if (mapInstanceRef.current) {
      mapInstanceRef.current.getObjects().forEach((obj) => {
        if (obj instanceof window.H.ui.InfoBubble) {
          try {
            mapInstanceRef.current.removeObject(obj);
          } catch (e) {
            console.warn("Error removing info bubble:", e);
          }
        }
      });
    }

    setLocalSelectedPackage(null);
    console.log("✅ Package route cleared");
  }, []);

  // ================= SHOW PACKAGE ROUTE =================
  const showPackageRoute = useCallback(
    async (packageData, markerData) => {
      console.log("🚀 showPackageRoute called with:", {
        packageData,
        markerData,
        mapReady: !!mapInstanceRef.current,
        iconsReady,
      });

      if (
        !mapInstanceRef.current ||
        !packageData ||
        !markerData ||
        !iconsReady
      ) {
        console.error("❌ Cannot show package route - missing requirements:", {
          map: !!mapInstanceRef.current,
          packageData: !!packageData,
          markerData: !!markerData,
          iconsReady,
        });
        return;
      }

      console.log("📍 Showing package route for:", packageData.name);

      setPackageRouteLoading(true);
      setLocalSelectedPackage(packageData);

      // Clear previous package route first
      clearPackageRoute();

      try {
        // Check if icons are ready
        if (
          !packageOriginIconRef.current ||
          !packageDestinationIconRef.current
        ) {
          console.error("❌ Package route icons not ready!");
          return;
        }

        console.log(
          "📍 Geocoding package destination:",
          packageData.destination,
        );
        // Geocode package destination
        const packageDestCoords = await geocodeAddress(packageData.destination);

        console.log("📍 Package destination coordinates:", packageDestCoords);

        // Validate coordinates
        if (
          !packageDestCoords ||
          typeof packageDestCoords.lat !== "number" ||
          typeof packageDestCoords.lng !== "number" ||
          !markerData.lat ||
          !markerData.lng
        ) {
          console.error("❌ Invalid coordinates for package route", {
            destCoords: packageDestCoords,
            markerData,
          });
          return;
        }

        console.log("📍 Creating markers...");
        // SAFELY create origin marker
        let originMarker = null;
        try {
          originMarker = new window.H.map.Marker(
            { lat: markerData.lat, lng: markerData.lng },
            {
              icon: packageOriginIconRef.current,
              zIndex: 150,
            },
          );
          console.log("✅ Origin marker created");
        } catch (markerError) {
          console.error("❌ Error creating origin marker:", markerError);
        }

        // SAFELY create destination marker
        let destMarker = null;
        try {
          destMarker = new window.H.map.Marker(
            { lat: packageDestCoords.lat, lng: packageDestCoords.lng },
            {
              icon: packageDestinationIconRef.current,
              zIndex: 150,
            },
          );
          console.log("✅ Destination marker created");
        } catch (markerError) {
          console.error("❌ Error creating destination marker:", markerError);
        }

        // SAFELY add markers to map
        if (originMarker && mapInstanceRef.current) {
          try {
            mapInstanceRef.current.addObject(originMarker);
            packageSpecificMarkersRef.current.push(originMarker);
            console.log("✅ Origin marker added to map");
          } catch (addError) {
            console.error("❌ Error adding origin marker to map:", addError);
          }
        }

        if (destMarker && mapInstanceRef.current) {
          try {
            mapInstanceRef.current.addObject(destMarker);
            packageSpecificMarkersRef.current.push(destMarker);
            console.log("✅ Destination marker added to map");
          } catch (addError) {
            console.error(
              "❌ Error adding destination marker to map:",
              addError,
            );
          }
        }

        console.log("📍 Calculating route...");
        // Calculate and draw package route
        const route = await calculateRoute(
          { lat: markerData.lat, lng: markerData.lng },
          { lat: packageDestCoords.lat, lng: packageDestCoords.lng },
        );

        console.log("📍 Route calculation result:", route);

        const polyline = route?.sections?.[0]?.polyline;
        console.log("📍 Polyline data:", polyline ? "Exists" : "Missing");

        if (polyline) {
          try {
            const lineString = decodePolyline(polyline);
            console.log("📍 LineString decoded:", lineString);

            if (
              lineString &&
              lineString.getPointCount &&
              lineString.getPointCount() > 0
            ) {
              console.log("📍 Creating route line...");
              const routeLine = new window.H.map.Polyline(lineString, {
                style: {
                  strokeColor: "#9C27B0",
                  lineWidth: 4,
                  lineDash: [6, 3],
                  zIndex: 75,
                },
                zIndex: 75,
              });

              if (routeLine && mapInstanceRef.current) {
                try {
                  mapInstanceRef.current.addObject(routeLine);
                  packageRouteLineRef.current = routeLine;
                  console.log("✅ Route line added to map");
                } catch (addError) {
                  console.error("❌ Error adding route line to map:", addError);
                }
              }
            } else {
              console.warn("⚠️ LineString is empty or invalid");
            }
          } catch (polylineError) {
            console.error("❌ Error creating polyline:", polylineError);
          }
        } else {
          console.warn("⚠️ No polyline in route response");
        }

        // Adjust view to show both routes
        const pointsToShow = [
          userLocation,
          destination,
          { lat: markerData.lat, lng: markerData.lng },
          { lat: packageDestCoords.lat, lng: packageDestCoords.lng },
        ].filter(
          (p) => p && typeof p.lat === "number" && typeof p.lng === "number",
        );

        console.log("📍 Points to show:", pointsToShow);

        if (pointsToShow.length > 0) {
          try {
            const bounds = new window.H.geo.Rect(
              Math.min(...pointsToShow.map((p) => p.lat)),
              Math.min(...pointsToShow.map((p) => p.lng)),
              Math.max(...pointsToShow.map((p) => p.lat)),
              Math.max(...pointsToShow.map((p) => p.lng)),
            );

            mapInstanceRef.current.getViewModel().setLookAtData({
              bounds: bounds,
              padding: { top: 60, left: 60, right: 60, bottom: 100 },
            });
            console.log("✅ Map view adjusted");
          } catch (boundsError) {
            console.warn("⚠️ Error setting map bounds:", boundsError);
          }
        }
      } catch (error) {
        console.error("❌ Failed to show package route:", error);
      }

      setPackageRouteLoading(false);
      console.log("✅ showPackageRoute completed");
    },
    [userLocation, destination, clearPackageRoute, iconsReady],
  );

  // ================= SAFE MAP INITIALIZATION =================
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !sdkReady) {
      console.log("⚠️ Map initialization delayed - waiting for SDK");
      return;
    }

    // Check if already initialized
    if (mapInstanceRef.current) {
      console.log("⚠️ Map already initialized");
      return;
    }

    try {
      console.log("🗺️ Initializing HERE Map...");

      // Check if container exists and has dimensions
      if (
        !mapRef.current ||
        mapRef.current.offsetWidth === 0 ||
        mapRef.current.offsetHeight === 0
      ) {
        console.warn("⚠️ Map container has zero dimensions");
        setTimeout(initializeMap, 100);
        return;
      }

      const platform = new window.H.service.Platform({
        apikey: "IWbj9t2I4YTh0ipZ6OtXe2cUbZ0mQ-1MY1LhPOMeCq4",
      });

      const layers = platform.createDefaultLayers();

      const mapInstance = new window.H.Map(
        mapRef.current,
        layers.vector.normal.map,
        {
          center: { lat: 42.6629, lng: 21.1655 },
          zoom: 8,
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        },
      );

      // Add behavior
      new window.H.mapevents.Behavior(
        new window.H.mapevents.MapEvents(mapInstance),
      );

      // Create default UI
      window.H.ui.UI.createDefault(mapInstance, layers);

      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);
      setMapInitialized(true);

      // Add map click handler
      const handleMapClick = (evt) => {
        const target = evt.target;

        // Check if click is on a marker
        const isMarker = target instanceof window.H.map.Marker;
        const isPackageMarker =
          isMarker && target.getData && target.getData().packageId;

        if (!isPackageMarker) {
          // Clicked on empty map - clear package route
          clearPackageRoute();
          if (onPackageClick) {
            onPackageClick(null);
          }
        }
      };

      mapEventsRef.current = handleMapClick;
      mapInstance.addEventListener("tap", handleMapClick);

      // Force resize after a short delay
      setTimeout(() => {
        if (mapInstance.getViewPort()) {
          mapInstance.getViewPort().resize();
        }
      }, 100);

      console.log("✅ HERE Map initialized successfully");
    } catch (e) {
      console.error("❌ Failed to initialize map:", e);
      setError("Failed to load map. Please refresh the page.");
    }
  }, [sdkReady, clearPackageRoute, onPackageClick]);

  // ================= INITIALIZE MAP ONCE SDK IS READY =================
  useEffect(() => {
    if (sdkReady && !mapInitialized) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeMap();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sdkReady, mapInitialized, initializeMap]);

  // ================= CLEANUP ON UNMOUNT =================
  useEffect(() => {
    return () => {
      console.log("🔄 HEREDeliveryMap unmounting, cleaning up...");
      cleanupMap();
    };
  }, [cleanupMap]);

  // ================= CREATE ICONS =================
  const createIcons = useCallback(() => {
    if (!window.H || !mapInstanceRef.current) return;

    try {
      // Circle icon for origin
      const createCircleIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
          <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>`;
        return new window.H.map.Icon(
          `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
          { size: { w: 32, h: 32 }, anchor: { x: 16, y: 16 } },
        );
      };

      // Package icon
      const createPackageIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
          <rect x="6" y="6" width="20" height="20" rx="4" fill="${color}" stroke="white" stroke-width="2"/>
          <path d="M12 12 L20 12 L20 20 L12 20 Z" fill="white" fill-opacity="0.8"/>
        </svg>`;
        return new window.H.map.Icon(
          `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
          { size: { w: 32, h: 32 }, anchor: { x: 16, y: 16 } },
        );
      };

      // Small circle for package route
      const createSmallCircleIcon = (color) => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>`;
        return new window.H.map.Icon(
          `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
          { size: { w: 24, h: 24 }, anchor: { x: 12, y: 12 } },
        );
      };

      originIconRef.current = createCircleIcon("#4285F4");
      matchingPackageIconRef.current = createPackageIcon("#4CAF50");
      otherPackageIconRef.current = createPackageIcon("#FF9800");
      packageOriginIconRef.current = createSmallCircleIcon("#9C27B0");
      packageDestinationIconRef.current = createSmallCircleIcon("#E91E63");

      destinationIconRef.current = new window.H.map.Icon(geoFilIcon, {
        size: { w: 32, h: 32 },
        anchor: { x: 16, y: 32 },
      });

      setIconsReady(true);
      console.log("✅ Icons created successfully");
    } catch (e) {
      console.error("Error creating icons:", e);
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      createIcons();
    }
  }, [mapInstanceRef.current, createIcons]);

  // ================= CHECK IF ICONS ARE READY =================
  const checkIconsReady = useCallback(() => {
    return (
      originIconRef.current &&
      destinationIconRef.current &&
      matchingPackageIconRef.current &&
      otherPackageIconRef.current &&
      packageOriginIconRef.current &&
      packageDestinationIconRef.current
    );
  }, []);

  // ================= GEOCODE PACKAGES =================
  const geocodePackages = useCallback(async () => {
    if (!packages.length || !mapInstanceRef.current) return;

    console.log("📍 Geocoding package locations...");

    const coordinates = {};
    const geocodePromises = [];

    for (const pkg of packages) {
      if (pkg.location && !coordinates[pkg.id]) {
        geocodePromises.push(
          (async () => {
            try {
              const result = await geocodeAddress(pkg.location);
              coordinates[pkg.id] = {
                lat: result.lat,
                lng: result.lng,
                name: pkg.name,
                location: pkg.location,
                destination: pkg.destination,
                isMatching:
                  routeLocation &&
                  routeDestination &&
                  (pkg.location
                    .toLowerCase()
                    .includes(routeLocation.toLowerCase()) ||
                    pkg.destination
                      .toLowerCase()
                      .includes(routeDestination.toLowerCase())),
              };
            } catch (error) {
              console.warn(`Failed to geocode ${pkg.location}:`, error);
              // Fallback coordinates
              coordinates[pkg.id] = {
                lat: 42.6629 + (Math.random() - 0.5) * 0.5,
                lng: 21.1655 + (Math.random() - 0.5) * 0.5,
                name: pkg.name,
                location: pkg.location,
                destination: pkg.destination,
                isMatching: false,
              };
            }
          })(),
        );
      }
    }

    await Promise.all(geocodePromises);
    setPackageCoordinates(coordinates);
    console.log(`✅ Geocoded ${Object.keys(coordinates).length} packages`);
  }, [packages, routeLocation, routeDestination]);

  // ================= ADD PACKAGE MARKERS =================
  const addPackageMarkers = useCallback(() => {
    if (
      !mapInstanceRef.current ||
      !window.H ||
      Object.keys(packageCoordinates).length === 0 ||
      !checkIconsReady()
    ) {
      console.warn("Cannot add package markers - missing requirements:", {
        map: !!mapInstanceRef.current,
        windowH: !!window.H,
        packageCount: Object.keys(packageCoordinates).length,
        iconsReady: checkIconsReady(),
      });
      return;
    }

    // Remove existing package markers
    packageMarkersRef.current.forEach((marker) => {
      try {
        if (marker && mapInstanceRef.current.hasObject(marker)) {
          mapInstanceRef.current.removeObject(marker);
        }
      } catch (e) {
        console.warn("Error removing marker:", e);
      }
    });
    packageMarkersRef.current = [];

    // Add new markers
    Object.entries(packageCoordinates).forEach(([packageId, coords]) => {
      try {
        // Validate coordinates
        if (!coords.lat || !coords.lng) {
          console.warn(`Invalid coordinates for package ${packageId}:`, coords);
          return;
        }

        const icon = coords.isMatching
          ? matchingPackageIconRef.current
          : otherPackageIconRef.current;

        if (!icon) {
          console.warn("Icon not ready for package:", packageId);
          return;
        }

        const marker = new window.H.map.Marker(
          { lat: coords.lat, lng: coords.lng },
          {
            icon: icon,
            data: { packageId, ...coords },
          },
        );

        // Add click event
        marker.addEventListener("tap", (evt) => {
          const markerData = evt.target.getData();
          console.log("📍 Marker data:", markerData);
          console.log("📦 Available packages:", packages);

          // Convert packageId to number for comparison (if needed)
          const markerPackageId = markerData.packageId;
          const clickedPackage = packages.find((p) => {
            // Try multiple comparison methods
            return (
              p.id == markerPackageId || // Loose equality
              p.id.toString() === markerPackageId.toString() || // String comparison
              parseInt(p.id) === parseInt(markerPackageId) // Number comparison
            );
          });

          console.log("🔍 Search result:", {
            markerPackageId,
            typeOfMarkerId: typeof markerPackageId,
            clickedPackage,
            comparison: packages.map((p) => ({
              id: p.id,
              type: typeof p.id,
              matches: p.id == markerPackageId,
            })),
          });

          // Clear any existing tooltips
          try {
            const currentObjects = mapInstanceRef.current.getObjects();
            currentObjects.forEach((obj) => {
              // Remove custom DOM elements (tooltips)
              if (obj && obj.element && obj.element.style) {
                try {
                  mapInstanceRef.current.removeObject(obj);
                } catch (e) {
                  // Ignore errors
                }
              }
            });
          } catch (e) {
            console.warn("Error clearing tooltips:", e);
          }

          // Callback if provided (to update parent component)
          if (onPackageClick && clickedPackage) {
            console.log(
              "📞 Calling onPackageClick callback with:",
              clickedPackage,
            );
            onPackageClick(clickedPackage);
          }

          // Show package route ONLY when clicking on map marker
          if (clickedPackage) {
            console.log("🔄 Calling showPackageRoute with:", {
              package: clickedPackage,
              markerData,
            });
            showPackageRoute(clickedPackage, markerData);
          } else {
            console.warn("❌ clickedPackage not found! Trying fallback...");

            // Fallback: Create a temporary package object from marker data
            const fallbackPackage = {
              id: markerData.packageId,
              name: markerData.name,
              location: markerData.location,
              destination: markerData.destination,
              // Add other required fields with defaults
              imagePaths: [],
              price: "0",
              description: "",
              weightinKg: "0",
              length: 0,
              height: 0,
              width: 0,
              deadline: "",
              createdBy: "",
            };

            console.log("🔄 Using fallback package:", fallbackPackage);
            showPackageRoute(fallbackPackage, markerData);

            // Still call onPackageClick with fallback
            if (onPackageClick) {
              onPackageClick(fallbackPackage);
            }
          }
        });

        try {
          mapInstanceRef.current.addObject(marker);
          packageMarkersRef.current.push(marker);
        } catch (addError) {
          console.error("Error adding package marker to map:", addError);
        }
      } catch (e) {
        console.error("Error creating package marker:", e);
      }
    });

    console.log(`📍 Added ${packageMarkersRef.current.length} package markers`);
  }, [
    packageCoordinates,
    packages,
    onPackageClick,
    showPackageRoute,
    checkIconsReady,
  ]);

  // ================= ADJUST MAP VIEW =================
  const adjustMapView = useCallback(
    (points) => {
      if (!mapInstanceRef.current || !window.H || points.length === 0) return;

      try {
        const bounds = new window.H.geo.Rect(
          Math.min(...points.map((p) => p.lat)),
          Math.min(...points.map((p) => p.lng)),
          Math.max(...points.map((p) => p.lat)),
          Math.max(...points.map((p) => p.lng)),
        );

        mapInstanceRef.current.getViewModel().setLookAtData({
          bounds: bounds,
          padding: {
            top: 50,
            left: 50,
            right: 50,
            bottom: localSelectedPackage ? 100 : 50,
          },
        });
      } catch (e) {
        console.warn("Error adjusting map view:", e);
      }
    },
    [localSelectedPackage],
  );

  // ================= ADD ROUTE MARKERS =================
  const addRouteMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.H || !checkIconsReady()) return;

    // Remove old markers
    markersRef.current.forEach((m) => {
      try {
        if (m && mapInstanceRef.current.hasObject(m)) {
          mapInstanceRef.current.removeObject(m);
        }
      } catch (e) {
        console.warn("Error removing marker:", e);
      }
    });
    markersRef.current = [];

    // Add origin marker
    if (
      userLocation &&
      originIconRef.current &&
      typeof userLocation.lat === "number" &&
      typeof userLocation.lng === "number"
    ) {
      try {
        const marker = new window.H.map.Marker(userLocation, {
          icon: originIconRef.current,
          zIndex: 100,
        });
        mapInstanceRef.current.addObject(marker);
        markersRef.current.push(marker);
      } catch (e) {
        console.error("Error adding origin marker:", e);
      }
    }

    // Add destination marker
    if (
      destination &&
      destinationIconRef.current &&
      typeof destination.lat === "number" &&
      typeof destination.lng === "number"
    ) {
      try {
        const marker = new window.H.map.Marker(destination, {
          icon: destinationIconRef.current,
          zIndex: 100,
        });
        mapInstanceRef.current.addObject(marker);
        markersRef.current.push(marker);
      } catch (e) {
        console.error("Error adding destination marker:", e);
      }
    }
  }, [userLocation, destination, checkIconsReady]);

  useEffect(() => {
    if (mapInstanceRef.current && checkIconsReady()) {
      addRouteMarkers();
    }
  }, [
    mapInstanceRef.current,
    userLocation,
    destination,
    addRouteMarkers,
    checkIconsReady,
  ]);

  // ================= DRAW ROUTE =================
  const drawRoute = useCallback(async () => {
    if (!mapInstanceRef.current || !userLocation || !destination) return;

    setRouteLoading(true);

    // Remove existing route
    if (
      routeLineRef.current &&
      mapInstanceRef.current.hasObject(routeLineRef.current)
    ) {
      try {
        mapInstanceRef.current.removeObject(routeLineRef.current);
      } catch (e) {
        console.warn("Error removing route line:", e);
      }
      routeLineRef.current = null;
    }

    try {
      const route = await calculateRoute(userLocation, destination);
      const polyline = route?.sections?.[0]?.polyline;

      if (polyline) {
        try {
          const lineString = decodePolyline(polyline);
          if (
            lineString &&
            lineString.getPointCount &&
            lineString.getPointCount() > 0
          ) {
            const routeLine = new window.H.map.Polyline(lineString, {
              style: {
                strokeColor: "#2F80ED",
                lineWidth: 6,
                zIndex: 50,
              },
              zIndex: 50,
            });

            if (routeLine && mapInstanceRef.current) {
              try {
                mapInstanceRef.current.addObject(routeLine);
                routeLineRef.current = routeLine;
              } catch (addError) {
                console.error("Error adding route line to map:", addError);
              }
            }
          }
        } catch (decodeError) {
          console.error("Error decoding polyline:", decodeError);
        }
      }

      // Adjust view
      adjustMapView([userLocation, destination]);
    } catch (error) {
      console.error("Failed to draw route:", error);
      // Draw straight line as fallback
      try {
        const ls = new window.H.geo.LineString();
        ls.pushPoint(userLocation);
        ls.pushPoint(destination);

        const fallback = new window.H.map.Polyline(ls, {
          style: {
            strokeColor: "#FF9900",
            lineWidth: 4,
            lineDash: [8, 4],
            zIndex: 50,
          },
          zIndex: 50,
        });

        if (fallback && mapInstanceRef.current) {
          try {
            mapInstanceRef.current.addObject(fallback);
            routeLineRef.current = fallback;
          } catch (addError) {
            console.error("Error adding fallback route line:", addError);
          }
        }
      } catch (fallbackError) {
        console.error("Error creating fallback route:", fallbackError);
      }
    }

    setRouteLoading(false);
  }, [userLocation, destination, adjustMapView]);

  // ================= EFFECTS =================
  // Geocode packages when they change
  useEffect(() => {
    if (mapInstanceRef.current && packages.length > 0) {
      geocodePackages();
    }
  }, [mapInstanceRef.current, packages, geocodePackages]);

  // Add package markers when coordinates are ready AND icons are ready
  useEffect(() => {
    if (
      mapInstanceRef.current &&
      Object.keys(packageCoordinates).length > 0 &&
      checkIconsReady()
    ) {
      addPackageMarkers();
    }
  }, [
    mapInstanceRef.current,
    packageCoordinates,
    addPackageMarkers,
    checkIconsReady,
  ]);

  // Draw route when needed
  useEffect(() => {
    if (mapInstanceRef.current && showRoute && userLocation && destination) {
      const timer = setTimeout(() => {
        drawRoute();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mapInstanceRef.current, showRoute, drawRoute, userLocation, destination]);

  // ================= RENDER =================
  return (
    <div className="here-map-container">
      {/* SDK loading indicator */}
      {!sdkReady && (
        <div className="sdk-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        className="map-canvas"
        style={{
          width: "100%",
          height: "100%",
          display: sdkReady ? "block" : "none",
        }}
      />

      {/* Route loading indicator */}
      {routeLoading && (
        <div className="route-loading">
          <div className="loading-spinner small"></div>
          <p>Calculating route...</p>
        </div>
      )}

      {/* Package route loading indicator */}
      {packageRouteLoading && (
        <div
          className="route-loading"
          style={{ top: localSelectedPackage ? "100px" : "80px" }}
        >
          <div className="loading-spinner small"></div>
          <p>Calculating package route...</p>
        </div>
      )}

      {/* Package count indicator */}
      {mapInitialized &&
        Object.keys(packageCoordinates).length > 0 &&
        iconsReady && (
          <div className="package-count-indicator">
            <span className="package-count-badge">
              📦 {Object.keys(packageCoordinates).length} packages on map
            </span>
            <div className="package-legend">
              <div className="legend-item">
                <span className="legend-color matching"></span>
                <span>
                  Matches route (
                  {
                    Object.values(packageCoordinates).filter(
                      (c) => c.isMatching,
                    ).length
                  }
                  )
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-color other"></span>
                <span>
                  Other packages (
                  {
                    Object.values(packageCoordinates).filter(
                      (c) => !c.isMatching,
                    ).length
                  }
                  )
                </span>
              </div>
            </div>
          </div>
        )}

      {/* Package route info */}
      {localSelectedPackage && (
        <div className="package-route-info">
          <div className="package-route-header">
            <h4>📦 {localSelectedPackage.name}</h4>
            <button
              className="close-package-route-btn"
              onClick={() => {
                clearPackageRoute();
                // Also clear selection in parent
                if (onPackageClick) {
                  onPackageClick(null);
                }
              }}
              aria-label="Close package route"
            >
              ×
            </button>
          </div>
          <div className="package-route-details">
            <p>
              <strong>📍 Pickup:</strong> {localSelectedPackage.location}
            </p>
            <p>
              <strong>🎯 Delivery:</strong> {localSelectedPackage.destination}
            </p>
            <p className="route-note">
              <small>Purple dashed line shows package delivery route</small>
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="map-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
    </div>
  );
};

export default HEREDeliveryMap;
