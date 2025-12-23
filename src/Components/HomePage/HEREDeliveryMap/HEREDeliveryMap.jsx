// import React, { useRef, useEffect, useState } from "react";
// import "./HEREDeliveryMap.css";

// const HEREDeliveryMap = () => {
//   const mapRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     console.log("=== HEREDeliveryMap mounted ===");

//     // Function to load HERE SDK dynamically
//     const loadHEREsdk = () => {
//       return new Promise((resolve, reject) => {
//         // Check if already loaded
//         if (window.H && window.H.service && window.H.Map) {
//           console.log("HERE SDK already loaded");
//           resolve(true);
//           return;
//         }

//         console.log("Loading HERE SDK dynamically...");

//         // Load scripts in correct order
//         const scripts = [
//           "https://js.api.here.com/v3/3.1/mapsjs-core.js",
//           "https://js.api.here.com/v3/3.1/mapsjs-service.js",
//           "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
//           "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
//         ];

//         let loaded = 0;
//         let failed = false;

//         scripts.forEach((src, index) => {
//           // Create script element
//           const script = document.createElement("script");
//           script.src = src;

//           script.onload = () => {
//             loaded++;
//             console.log(`✅ Loaded: ${src} (${loaded}/${scripts.length})`);

//             if (loaded === scripts.length && !failed) {
//               console.log("All scripts loaded");

//               // Wait a bit for SDK to initialize
//               setTimeout(() => {
//                 if (window.H && window.H.service && window.H.Map) {
//                   console.log("HERE SDK ready after dynamic load");
//                   resolve(true);
//                 } else {
//                   console.log("HERE SDK not ready after loading scripts");
//                   reject("SDK didn't initialize");
//                 }
//               }, 1000);
//             }
//           };

//           script.onerror = () => {
//             console.error(`❌ Failed to load: ${src}`);
//             failed = true;
//             reject(`Failed to load ${src}`);
//           };

//           // Add to document
//           document.head.appendChild(script);
//         });

//         // Load CSS
//         const cssLink = document.createElement("link");
//         cssLink.rel = "stylesheet";
//         cssLink.type = "text/css";
//         cssLink.href = "https://js.api.here.com/v3/3.1/mapsjs-ui.css";
//         document.head.appendChild(cssLink);
//       });
//     };

//     // Function to initialize map
//     const initializeMap = () => {
//       try {
//         if (!mapRef.current) {
//           throw new Error("Map container not found");
//         }

//         console.log("Creating platform...");

//         // Create platform
//         const platform = new window.H.service.Platform({
//           apikey: "IWbj9t2I4YTh0ipZ6OtXe2cUbZ0mQ-1MY1LhPOMeCq4",
//         });

//         console.log("Platform created, creating map...");

//         // Get default layers
//         const defaultLayers = platform.createDefaultLayers();

//         // Create map
//         const mapInstance = new window.H.Map(
//           mapRef.current,
//           defaultLayers.vector.normal.map,
//           {
//             center: { lat: 42.6629, lng: 21.1655 },
//             zoom: 13,
//             pixelRatio: window.devicePixelRatio || 1,
//           }
//         );

//         // Add behavior
//         const mapEvents = new window.H.mapevents.MapEvents(mapInstance);
//         new window.H.mapevents.Behavior(mapEvents);

//         // Add UI
//         window.H.ui.UI.createDefault(mapInstance, defaultLayers);

//         // Add a marker
//         const marker = new window.H.map.Marker({ lat: 42.6629, lng: 21.1655 });
//         mapInstance.addObject(marker);

//         // Store map
//         setMap(mapInstance);
//         setLoading(false);
//         setError("");

//         console.log("✅ HERE Map initialized successfully");

//         // Handle resize
//         const handleResize = () => {
//           mapInstance.getViewPort().resize();
//         };

//         window.addEventListener("resize", handleResize);

//         // Cleanup
//         return () => {
//           window.removeEventListener("resize", handleResize);
//           if (mapInstance) {
//             mapInstance.dispose();
//           }
//         };
//       } catch (err) {
//         console.error("Map initialization error:", err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     // Main initialization
//     const init = async () => {
//       try {
//         setLoading(true);

//         // Check if SDK is already loaded
//         if (!window.H || !window.H.service) {
//           console.log("SDK not loaded, loading dynamically...");
//           await loadHEREsdk();
//         }

//         // Initialize map
//         initializeMap();
//       } catch (err) {
//         console.error("Failed to load HERE SDK:", err);
//         setError(`Failed to load maps: ${err}`);
//         setLoading(false);
//       }
//     };

//     // Start initialization
//     init();
//   }, []);

//   const mapHeight = window.innerWidth <= 480 ? "calc(100vh - 400px)" : "100vh";

//   return (
//     <div className="here-map-container">
//       <div
//         ref={mapRef}
//         style={{
//           width: "100%",
//           height: mapHeight,
//           minHeight: "400px",
//           position: "relative",
//         }}
//       />

//       {loading && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             background: "white",
//             padding: "30px",
//             borderRadius: "10px",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//             textAlign: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             style={{
//               border: "5px solid #f3f3f3",
//               borderTop: "5px solid #3498db",
//               borderRadius: "50%",
//               width: "50px",
//               height: "50px",
//               animation: "spin 1s linear infinite",
//               margin: "0 auto 20px",
//             }}
//           ></div>
//           <h3 style={{ margin: "0 0 10px 0" }}>Loading HERE Maps...</h3>
//           <p style={{ color: "#666", margin: 0 }}>This may take a moment</p>
//         </div>
//       )}

//       {error && (
//         <div
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             background: "white",
//             padding: "30px",
//             borderRadius: "10px",
//             boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
//             textAlign: "center",
//             zIndex: 1000,
//             maxWidth: "400px",
//           }}
//         >
//           <h3 style={{ margin: "0 0 15px 0", color: "#e74c3c" }}>Map Error</h3>
//           <p style={{ margin: "0 0 20px 0", color: "#333" }}>{error}</p>
//           <div
//             style={{ display: "flex", gap: "10px", justifyContent: "center" }}
//           >
//             <button
//               onClick={() => window.location.reload()}
//               style={{
//                 padding: "10px 20px",
//                 background: "#3498db",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 fontSize: "14px",
//               }}
//             >
//               Refresh Page
//             </button>
//             <button
//               onClick={() => {
//                 console.log("Manual SDK check:", {
//                   H: !!window.H,
//                   service: !!window.H?.service,
//                   Map: !!window.H?.Map,
//                 });
//               }}
//               style={{
//                 padding: "10px 20px",
//                 background: "#95a5a6",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 fontSize: "14px",
//               }}
//             >
//               Debug SDK
//             </button>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HEREDeliveryMap;

/////////////////////=====================================================//////////////////////================================================================
// import React, { useRef, useEffect, useState, useCallback } from "react";
// import "./HEREDeliveryMap.css";
// import { calculateRoute, decodePolyline } from "../../../utils/hereRouting";

// const HEREDeliveryMap = ({
//   userLocation,
//   destination,
//   onMapClick,
//   showRoute = false,
// }) => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [routeLoading, setRouteLoading] = useState(false);
//   const routeLineRef = useRef(null);
//   const markersRef = useRef([]);

//   // ========== 1. SIMPLIFIED MAP INITIALIZATION ==========
//   const initializeMap = useCallback(() => {
//     if (!mapRef.current) return;

//     console.log("🗺️ Initializing HERE Map...");

//     // Check if SDK is loaded
//     if (!window.H || !window.H.service || !window.H.Map) {
//       console.error("HERE Maps SDK not loaded");
//       setError("HERE Maps SDK not loaded. Please refresh the page.");
//       return;
//     }

//     try {
//       // Create platform
//       const platform = new window.H.service.Platform({
//         apikey: "IWbj9t2I4YTh0ipZ6OtXe2cUbZ0mQ-1MY1LhPOMeCq4",
//       });

//       // Get default layers
//       const defaultLayers = platform.createDefaultLayers();

//       // Create map - SIMPLIFIED: Use fixed dimensions
//       const mapInstance = new window.H.Map(
//         mapRef.current,
//         defaultLayers.vector.normal.map,
//         {
//           center: { lat: 42.6629, lng: 21.1655 },
//           zoom: 8,
//           pixelRatio: window.devicePixelRatio || 1,
//         }
//       );

//       // Add basic behavior
//       const behavior = new window.H.mapevents.Behavior(
//         new window.H.mapevents.MapEvents(mapInstance)
//       );

//       // Add UI
//       window.H.ui.UI.createDefault(mapInstance, defaultLayers);

//       // Store reference
//       mapInstanceRef.current = mapInstance;
//       setMap(mapInstance);
//       setLoading(false);

//       console.log("✅ Map initialized successfully");

//       // Force resize after a delay
//       setTimeout(() => {
//         if (mapInstance && mapInstance.getViewPort) {
//           try {
//             mapInstance.getViewPort().resize();
//           } catch (e) {
//             console.warn("Resize error:", e);
//           }
//         }
//       }, 500);
//     } catch (err) {
//       console.error("❌ Map initialization error:", err);
//       setError(`Map failed to load: ${err.message}`);
//       setLoading(false);
//     }
//   }, []);

//   // ========== 2. INITIALIZE MAP ON MOUNT ==========
//   useEffect(() => {
//     console.log("🧭 Map component mounted");

//     // Wait for SDK to be ready
//     const checkSDK = () => {
//       if (window.H && window.H.service && window.H.Map) {
//         initializeMap();
//       } else {
//         setTimeout(checkSDK, 100);
//       }
//     };

//     checkSDK();

//     // Cleanup
//     return () => {
//       if (mapInstanceRef.current) {
//         try {
//           mapInstanceRef.current.dispose();
//         } catch (e) {
//           console.warn("Error disposing map:", e);
//         }
//       }
//     };
//   }, [initializeMap]);

//   // ========== 3. SIMPLIFIED ROUTE DRAWING ==========
//   // ========== 3. SIMPLIFIED ROUTE DRAWING ==========
//   const drawRoute = useCallback(async () => {
//     if (!map || !userLocation || !destination) {
//       console.log("⚠️ Cannot draw route - missing data");
//       return;
//     }

//     try {
//       setRouteLoading(true);
//       console.log("🔄 Drawing route...");

//       // Clear previous route
//       if (routeLineRef.current) {
//         try {
//           map.removeObject(routeLineRef.current);
//         } catch (e) {
//           console.warn("Error removing old route:", e);
//         }
//         routeLineRef.current = null;
//       }

//       try {
//         // Get route from API
//         const routeData = await calculateRoute(userLocation, destination);
//         console.log("✅ Route data received:", routeData);

//         if (routeData?.sections?.[0]?.polyline) {
//           // Decode polyline
//           const lineString = decodePolyline(routeData.sections[0].polyline);

//           if (
//             lineString &&
//             lineString.getPointCount &&
//             lineString.getPointCount() > 0
//           ) {
//             console.log(
//               `✅ Decoded polyline with ${lineString.getPointCount()} points`
//             );

//             // Create route line with PROPER STYLE (FIXED: Remove lineDash: null)
//             const routeLine = new window.H.map.Polyline(lineString, {
//               style: {
//                 strokeColor: "#2F80ED", // BRIGHT RED
//                 lineWidth: 6, // Thicker line
//                 lineCap: "round",
//                 lineJoin: "round",
//                 // REMOVED: lineDash: null, // This was causing the error
//               },
//             });

//             // Add to map
//             map.addObject(routeLine);
//             routeLineRef.current = routeLine;
//             console.log("✅ Route line added to map");

//             // Log route details
//             const summary = routeData.sections[0].summary;
//             if (summary) {
//               console.log("Route Summary:", {
//                 length: summary.length
//                   ? `${(summary.length / 1000).toFixed(1)} km`
//                   : "Unknown",
//                 duration: summary.duration
//                   ? `${Math.round(summary.duration / 60)} min`
//                   : "Unknown",
//                 baseDuration: summary.baseDuration
//                   ? `${Math.round(summary.baseDuration / 60)} min`
//                   : "Unknown",
//               });
//             }
//           } else {
//             console.warn(
//               "⚠️ LineString is empty or invalid, using straight line"
//             );
//             drawStraightLine();
//           }
//         } else {
//           console.warn("⚠️ No polyline in route data, using straight line");
//           drawStraightLine();
//         }
//       } catch (apiError) {
//         console.error("❌ API route calculation failed:", apiError);
//         drawStraightLine();
//       }

//       // Center map on route
//       if (map && userLocation && destination) {
//         const bounds = new window.H.geo.Rect(
//           Math.min(userLocation.lat, destination.lat),
//           Math.min(userLocation.lng, destination.lng),
//           Math.max(userLocation.lat, destination.lat),
//           Math.max(userLocation.lng, destination.lng)
//         );

//         map.getViewModel().setLookAtData(
//           {
//             bounds: bounds,
//             padding: { top: 50, right: 50, bottom: 50, left: 50 },
//           },
//           true
//         );
//         console.log("✅ Map centered on route");
//       }

//       setRouteLoading(false);
//     } catch (error) {
//       console.error("❌ Failed to draw route:", error);
//       setRouteLoading(false);
//       drawStraightLine();
//     }

//     // Helper function for straight line fallback
//     function drawStraightLine() {
//       if (map && window.H) {
//         try {
//           const lineString = new window.H.geo.LineString();
//           lineString.pushPoint(userLocation);
//           lineString.pushPoint(destination);

//           const fallbackLine = new window.H.map.Polyline(lineString, {
//             style: {
//               strokeColor: "#FF9900", // Orange for fallback
//               lineWidth: 4,
//               lineDash: [10, 5], // Dashed line for fallback
//             },
//           });

//           map.addObject(fallbackLine);
//           routeLineRef.current = fallbackLine;
//           console.log("✅ Fallback straight line drawn (dashed orange)");
//         } catch (fallbackError) {
//           console.error("Fallback also failed:", fallbackError);
//         }
//       }
//     }
//   }, [map, userLocation, destination]);

//   // ========== 4. UPDATE MARKERS ==========
//   useEffect(() => {
//     if (!map || !window.H) return;

//     console.log("📍 Updating markers...");

//     // Clear old markers
//     markersRef.current.forEach((marker) => {
//       try {
//         map.removeObject(marker);
//       } catch (e) {
//         console.warn("Error removing marker:", e);
//       }
//     });
//     markersRef.current = [];

//     // Add origin marker (BLUE)
//     if (userLocation) {
//       const originMarker = new window.H.map.Marker(
//         { lat: userLocation.lat, lng: userLocation.lng },
//         {
//           icon: new window.H.map.Icon(`
//             <svg width="40" height="40" viewBox="0 0 40 40">
//               <circle cx="20" cy="20" r="15" fill="#2F80ED" stroke="white" stroke-width="3"/>
//               <circle cx="20" cy="20" r="5" fill="white"/>
//             </svg>
//           `),
//         }
//       );
//       map.addObject(originMarker);
//       markersRef.current.push(originMarker);
//     }

//     // Add destination marker (RED)
//     if (destination) {
//       const destMarker = new window.H.map.Marker(
//         { lat: destination.lat, lng: destination.lng },
//         {
//           icon: new window.H.map.Icon(`
//             <svg width="40" height="40" viewBox="0 0 40 40">
//               <circle cx="20" cy="20" r="15" fill="#FF0000" stroke="white" stroke-width="3"/>
//               <circle cx="20" cy="20" r="5" fill="white"/>
//             </svg>
//           `),
//         }
//       );
//       map.addObject(destMarker);
//       markersRef.current.push(destMarker);
//     }
//   }, [map, userLocation, destination]);

//   // ========== 5. TRIGGER ROUTE DRAWING ==========
//   useEffect(() => {
//     if (!map || !showRoute) return;

//     console.log("🚗 Triggering route drawing...");

//     // Small delay to ensure map is ready
//     setTimeout(() => {
//       if (userLocation && destination) {
//         drawRoute();
//       }
//     }, 300);
//   }, [map, showRoute, userLocation, destination, drawRoute]);

//   // ========== 6. DEBUG FUNCTIONS ==========
//   const testVisibility = useCallback(() => {
//     if (!map || !window.H) return;

//     console.log("🔍 Testing visibility...");

//     // Clear everything
//     const objects = map.getObjects();
//     objects.forEach((obj) => {
//       try {
//         map.removeObject(obj);
//       } catch (e) {
//         console.warn("Error removing object:", e);
//       }
//     });

//     markersRef.current = [];
//     routeLineRef.current = null;

//     // Draw a VERY visible test line
//     const lineString = new window.H.geo.LineString();
//     lineString.pushPoint({ lat: 42.6629, lng: 21.1655 });
//     lineString.pushPoint({ lat: 42.6629, lng: 21.1755 });

//     const testLine = new window.H.map.Polyline(lineString, {
//       style: {
//         strokeColor: "#FF0000",
//         lineWidth: 20, // VERY THICK
//         lineCap: "round",
//         lineJoin: "round",
//       },
//     });

//     map.addObject(testLine);
//     routeLineRef.current = testLine;

//     // Center map
//     map.setCenter({ lat: 42.6629, lng: 21.1705 });
//     map.setZoom(13);

//     console.log("✅ Test line drawn - CAN YOU SEE THE RED LINE?");
//     alert(
//       "A bright red line should now be visible on the map. Can you see it?"
//     );
//   }, [map]);

//   const checkMapState = useCallback(() => {
//     if (!map) {
//       console.log("❌ No map instance");
//       return;
//     }

//     console.log("🔍 MAP STATE:");
//     console.log("- Objects on map:", map.getObjects().length);
//     console.log("- Center:", map.getCenter());
//     console.log("- Zoom:", map.getZoom());
//     console.log("- Has route:", !!routeLineRef.current);
//     console.log("- Markers:", markersRef.current.length);
//   }, [map]);

//   // ========== 7. RENDER ==========
//   const mapHeight = window.innerWidth <= 480 ? "350px" : "calc(100vh - 120px)";

//   return (
//     <div className="here-map-container">
//       {/* Map container - SIMPLIFIED */}
//       <div
//         ref={mapRef}
//         className="map-canvas"
//         style={{
//           width: "100%",
//           height: mapHeight,
//           minHeight: "350px",
//           position: "relative",
//           backgroundColor: "#f0f0f0", // Show if map fails to load
//         }}
//       />

//       {/* Debug buttons */}
//       <div className="debug-controls">
//         <button
//           className="debug-btn"
//           onClick={testVisibility}
//           style={{ backgroundColor: "#FF0000", color: "white" }}
//         >
//           Test Visibility
//         </button>
//         <button className="debug-btn" onClick={checkMapState}>
//           Debug State
//         </button>
//       </div>

//       {/* Loading states */}
//       {loading && (
//         <div className="map-loading">
//           <div className="spinner"></div>
//           <p>Loading map...</p>
//         </div>
//       )}

//       {routeLoading && (
//         <div className="route-loading">
//           <div className="spinner small"></div>
//           <p>Calculating route...</p>
//         </div>
//       )}

//       {error && (
//         <div className="map-error">
//           <h3>Error</h3>
//           <p>{error}</p>
//           <button onClick={() => window.location.reload()}>Refresh Page</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HEREDeliveryMap;

/////WORKS WITH ICONS PIN../////////////////////////////////////////////////////////////////////////

// import React, { useRef, useEffect, useState, useCallback } from "react";
// import "./HEREDeliveryMap.css";
// import { calculateRoute, decodePolyline } from "../../../utils/hereRouting";

// const HEREDeliveryMap = ({
//   userLocation,
//   destination,
//   onMapClick,
//   showRoute = false,
// }) => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [routeLoading, setRouteLoading] = useState(false);
//   const routeLineRef = useRef(null);
//   const markersRef = useRef([]);

//   // ========== 1. SIMPLIFIED MAP INITIALIZATION ==========
//   const initializeMap = useCallback(() => {
//     if (!mapRef.current) return;

//     console.log("🗺️ Initializing HERE Map...");

//     // Check if SDK is loaded
//     if (!window.H || !window.H.service || !window.H.Map) {
//       console.error("HERE Maps SDK not loaded");
//       setError("HERE Maps SDK not loaded. Please refresh the page.");
//       return;
//     }

//     try {
//       // Create platform
//       const platform = new window.H.service.Platform({
//         apikey: "IWbj9t2I4YTh0ipZ6OtXe2cUbZ0mQ-1MY1LhPOMeCq4",
//       });

//       // Get default layers
//       const defaultLayers = platform.createDefaultLayers();

//       // Create map
//       const mapInstance = new window.H.Map(
//         mapRef.current,
//         defaultLayers.vector.normal.map,
//         {
//           center: { lat: 42.6629, lng: 21.1655 },
//           zoom: 8,
//           pixelRatio: window.devicePixelRatio || 1,
//         }
//       );

//       // Add basic behavior
//       const behavior = new window.H.mapevents.Behavior(
//         new window.H.mapevents.MapEvents(mapInstance)
//       );

//       // Add UI
//       window.H.ui.UI.createDefault(mapInstance, defaultLayers);

//       // Store reference
//       mapInstanceRef.current = mapInstance;
//       setMap(mapInstance);
//       setLoading(false);

//       console.log("✅ Map initialized successfully");

//       // Force resize after a delay
//       setTimeout(() => {
//         if (mapInstance && mapInstance.getViewPort) {
//           try {
//             mapInstance.getViewPort().resize();
//           } catch (e) {
//             console.warn("Resize error:", e);
//           }
//         }
//       }, 500);
//     } catch (err) {
//       console.error("❌ Map initialization error:", err);
//       setError(`Map failed to load: ${err.message}`);
//       setLoading(false);
//     }
//   }, []);

//   // ========== 2. INITIALIZE MAP ON MOUNT ==========
//   useEffect(() => {
//     console.log("🧭 Map component mounted");

//     // Wait for SDK to be ready
//     const checkSDK = () => {
//       if (window.H && window.H.service && window.H.Map) {
//         initializeMap();
//       } else {
//         setTimeout(checkSDK, 100);
//       }
//     };

//     checkSDK();

//     // Cleanup
//     return () => {
//       if (mapInstanceRef.current) {
//         try {
//           mapInstanceRef.current.dispose();
//         } catch (e) {
//           console.warn("Error disposing map:", e);
//         }
//       }
//     };
//   }, [initializeMap]);

//   // ========== 3. SIMPLIFIED ROUTE DRAWING ==========
//   const drawRoute = useCallback(async () => {
//     if (!map || !userLocation || !destination) {
//       console.log("⚠️ Cannot draw route - missing data");
//       return;
//     }

//     try {
//       setRouteLoading(true);
//       console.log("🔄 Drawing route...");

//       // Clear previous route
//       if (routeLineRef.current) {
//         try {
//           map.removeObject(routeLineRef.current);
//         } catch (e) {
//           console.warn("Error removing old route:", e);
//         }
//         routeLineRef.current = null;
//       }

//       try {
//         // Get route from API
//         const routeData = await calculateRoute(userLocation, destination);
//         console.log("✅ Route data received:", routeData);

//         if (routeData?.sections?.[0]?.polyline) {
//           // Decode polyline
//           const lineString = decodePolyline(routeData.sections[0].polyline);

//           if (
//             lineString &&
//             lineString.getPointCount &&
//             lineString.getPointCount() > 0
//           ) {
//             console.log(
//               `✅ Decoded polyline with ${lineString.getPointCount()} points`
//             );

//             // Create route line
//             const routeLine = new window.H.map.Polyline(lineString, {
//               style: {
//                 strokeColor: "#2F80ED",
//                 lineWidth: 6,
//                 lineCap: "round",
//                 lineJoin: "round",
//               },
//             });

//             // Add to map
//             map.addObject(routeLine);
//             routeLineRef.current = routeLine;
//             console.log("✅ Route line added to map");
//           } else {
//             console.warn(
//               "⚠️ LineString is empty or invalid, using straight line"
//             );
//             drawStraightLine();
//           }
//         } else {
//           console.warn("⚠️ No polyline in route data, using straight line");
//           drawStraightLine();
//         }
//       } catch (apiError) {
//         console.error("❌ API route calculation failed:", apiError);
//         drawStraightLine();
//       }

//       // Center map on route
//       if (map && userLocation && destination) {
//         const bounds = new window.H.geo.Rect(
//           Math.min(userLocation.lat, destination.lat),
//           Math.min(userLocation.lng, destination.lng),
//           Math.max(userLocation.lat, destination.lat),
//           Math.max(userLocation.lng, destination.lng)
//         );

//         map.getViewModel().setLookAtData(
//           {
//             bounds: bounds,
//             padding: { top: 50, right: 50, bottom: 50, left: 50 },
//           },
//           true
//         );
//         console.log("✅ Map centered on route");
//       }

//       setRouteLoading(false);
//     } catch (error) {
//       console.error("❌ Failed to draw route:", error);
//       setRouteLoading(false);
//       drawStraightLine();
//     }

//     // Helper function for straight line fallback
//     function drawStraightLine() {
//       if (map && window.H) {
//         try {
//           const lineString = new window.H.geo.LineString();
//           lineString.pushPoint(userLocation);
//           lineString.pushPoint(destination);

//           const fallbackLine = new window.H.map.Polyline(lineString, {
//             style: {
//               strokeColor: "#FF9900",
//               lineWidth: 4,
//               lineDash: [10, 5],
//             },
//           });

//           map.addObject(fallbackLine);
//           routeLineRef.current = fallbackLine;
//           console.log("✅ Fallback straight line drawn");
//         } catch (fallbackError) {
//           console.error("Fallback also failed:", fallbackError);
//         }
//       }
//     }
//   }, [map, userLocation, destination]);

//   // ========== 4. STANDARD HERE MAPS MARKERS ==========
//   useEffect(() => {
//     if (!map || !window.H) return;

//     console.log("📍 Updating markers...");

//     // Clear old markers
//     markersRef.current.forEach((marker) => {
//       try {
//         map.removeObject(marker);
//       } catch (e) {
//         console.warn("Error removing marker:", e);
//       }
//     });
//     markersRef.current = [];

//     // Use HERE Maps' built-in markers with colors
//     if (userLocation) {
//       // Blue marker for origin
//       const originMarker = new window.H.map.Marker(
//         { lat: userLocation.lat, lng: userLocation.lng },
//         {
//           // Use built-in marker with custom data
//           data: "origin",
//         }
//       );

//       // Try to style it blue
//       try {
//         // Some HERE Maps versions support styling
//         if (originMarker.setStyle) {
//           originMarker.setStyle({
//             fillColor: "rgba(66, 133, 244, 0.8)", // Google blue
//             strokeColor: "white",
//             lineWidth: 2,
//           });
//         }
//       } catch (e) {
//         console.log("Could not style marker, using default");
//       }

//       map.addObject(originMarker);
//       markersRef.current.push(originMarker);
//     }

//     if (destination) {
//       // Red marker for destination
//       const destMarker = new window.H.map.Marker(
//         { lat: destination.lat, lng: destination.lng },
//         {
//           data: "destination",
//         }
//       );

//       // Try to style it red
//       try {
//         if (destMarker.setStyle) {
//           destMarker.setStyle({
//             fillColor: "rgba(234, 67, 53, 0.8)", // Google red
//             strokeColor: "white",
//             lineWidth: 2,
//           });
//         }
//       } catch (e) {
//         console.log("Could not style marker, using default");
//       }

//       map.addObject(destMarker);
//       markersRef.current.push(destMarker);
//     }
//   }, [map, userLocation, destination]);

//   // ========== 5. TRIGGER ROUTE DRAWING ==========
//   useEffect(() => {
//     if (!map || !showRoute) return;

//     console.log("🚗 Triggering route drawing...");

//     // Small delay to ensure map is ready
//     setTimeout(() => {
//       if (userLocation && destination) {
//         drawRoute();
//       }
//     }, 300);
//   }, [map, showRoute, userLocation, destination, drawRoute]);

//   // ========== 6. DEBUG FUNCTIONS ==========
//   const testMarkers = useCallback(() => {
//     if (!map || !window.H) return;

//     console.log("🔍 Testing markers...");

//     // Clear everything
//     const objects = map.getObjects();
//     objects.forEach((obj) => {
//       try {
//         map.removeObject(obj);
//       } catch (e) {
//         console.warn("Error removing object:", e);
//       }
//     });

//     markersRef.current = [];
//     routeLineRef.current = null;

//     // Test with simple colored circle icons that are guaranteed to work
//     const originMarker = new window.H.map.Marker(
//       { lat: 42.6629, lng: 21.1655 },
//       {
//         icon: new window.H.map.Icon(`
//           <svg width="30" height="30" viewBox="0 0 30 30">
//             <circle cx="15" cy="15" r="12" fill="#4285F4" stroke="white" stroke-width="2"/>
//             <circle cx="15" cy="15" r="5" fill="white"/>
//           </svg>
//         `),
//       }
//     );

//     const destMarker = new window.H.map.Marker(
//       { lat: 42.6629, lng: 21.1755 },
//       {
//         icon: new window.H.map.Icon(`
//           <svg width="30" height="30" viewBox="0 0 30 30">
//             <circle cx="15" cy="15" r="12" fill="#EA4335" stroke="white" stroke-width="2"/>
//             <circle cx="15" cy="15" r="5" fill="white"/>
//           </svg>
//         `),
//       }
//     );

//     map.addObject(originMarker);
//     map.addObject(destMarker);
//     markersRef.current = [originMarker, destMarker];

//     // Add a simple line to test
//     const lineString = new window.H.geo.LineString();
//     lineString.pushPoint({ lat: 42.6629, lng: 21.1655 });
//     lineString.pushPoint({ lat: 42.6629, lng: 21.1755 });

//     const testLine = new window.H.map.Polyline(lineString, {
//       style: {
//         strokeColor: "#4285F4",
//         lineWidth: 4,
//       },
//     });

//     map.addObject(testLine);
//     routeLineRef.current = testLine;

//     // Center map
//     map.setCenter({ lat: 42.6629, lng: 21.1705 });
//     map.setZoom(13);

//     console.log("✅ Test markers and line added");
//     console.log("You should see:");
//     console.log("- BLUE circle (origin marker)");
//     console.log("- RED circle (destination marker)");
//     console.log("- Blue line connecting them");

//     alert(
//       "Check the map: You should see a BLUE circle and a RED circle connected by a blue line."
//     );
//   }, [map]);

//   const checkMapState = useCallback(() => {
//     if (!map) {
//       console.log("❌ No map instance");
//       return;
//     }

//     console.log("🔍 MAP STATE:");
//     console.log("- Objects on map:", map.getObjects().length);
//     console.log("- Center:", map.getCenter());
//     console.log("- Zoom:", map.getZoom());
//     console.log("- Has route:", !!routeLineRef.current);
//     console.log("- Markers:", markersRef.current.length);

//     // Log each object type
//     const objects = map.getObjects();
//     objects.forEach((obj, index) => {
//       console.log(`Object ${index}:`, {
//         type: obj.constructor.name,
//         isMarker: obj instanceof window.H.map.Marker,
//         isPolyline: obj instanceof window.H.map.Polyline,
//       });
//     });
//   }, [map]);

//   // ========== 7. RENDER ==========
//   const mapHeight = window.innerWidth <= 480 ? "350px" : "calc(100vh - 120px)";

//   return (
//     <div className="here-map-container">
//       {/* Map container */}
//       <div
//         ref={mapRef}
//         className="map-canvas"
//         style={{
//           width: "100%",
//           height: mapHeight,
//           minHeight: "350px",
//           position: "relative",
//           backgroundColor: "#f0f0f0",
//         }}
//       />

//       {/* Debug buttons */}
//       <div className="debug-controls">
//         <button
//           className="debug-button"
//           onClick={testMarkers}
//           style={{
//             backgroundColor: "#4285F4",
//             color: "white",
//             marginBottom: "5px",
//           }}
//         >
//           Test Markers (BLUE & RED)
//         </button>
//         <button
//           className="debug-button"
//           onClick={checkMapState}
//           style={{
//             backgroundColor: "#EA4335",
//             color: "white",
//           }}
//         >
//           Debug State
//         </button>
//       </div>

//       {/* Loading states */}
//       {loading && (
//         <div className="map-loading">
//           <div className="loading-spinner"></div>
//           <p>Loading map...</p>
//         </div>
//       )}

//       {routeLoading && (
//         <div className="route-loading">
//           <div className="loading-spinner small"></div>
//           <p>Calculating route...</p>
//         </div>
//       )}

//       {error && (
//         <div className="map-error">
//           <h3>Error</h3>
//           <p>{error}</p>
//           <button onClick={() => window.location.reload()}>Refresh Page</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HEREDeliveryMap;

import React, { useRef, useEffect, useState, useCallback } from "react";
import "./HEREDeliveryMap.css";
import { calculateRoute, decodePolyline } from "../../../utils/hereRouting";
import geoFilIcon from "../../../icons/geo-alt-fill.svg";

const HEREDeliveryMap = ({ userLocation, destination, showRoute = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLineRef = useRef(null);
  const markersRef = useRef([]);

  const originIconRef = useRef(null);
  const destinationIconRef = useRef(null);

  const [map, setMap] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= MAP INIT =================
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.H) return;

    try {
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
          pixelRatio: window.devicePixelRatio || 1,
        }
      );

      new window.H.mapevents.Behavior(
        new window.H.mapevents.MapEvents(mapInstance)
      );

      window.H.ui.UI.createDefault(mapInstance, layers);

      mapInstanceRef.current = mapInstance;
      setMap(mapInstance);

      setTimeout(() => mapInstance.getViewPort().resize(), 300);
    } catch (e) {
      console.error(e);
      setError("Failed to load HERE map");
    }
  }, []);

  useEffect(() => {
    const waitForSDK = () => {
      if (window.H && window.H.Map) initializeMap();
      else setTimeout(waitForSDK, 100);
    };
    waitForSDK();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
      }
    };
  }, [initializeMap]);

  // ================= ICONS (SAFE DATA-URL SVG) =================
  useEffect(() => {
    if (!map || !window.H) return;

    // 🟢 ORIGIN → rreth (si më parë)
    const createSvgIcon = (color) => {
      const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

      return new window.H.map.Icon(
        `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
        {
          size: { w: 32, h: 32 },
          anchor: { x: 16, y: 16 },
        }
      );
    };

    originIconRef.current = createSvgIcon("#4285F4"); // BLUE

    // 🔴 DESTINATION → Bootstrap SVG PIN
    destinationIconRef.current = new window.H.map.Icon(geoFilIcon, {
      size: { w: 32, h: 32 },
      anchor: { x: 16, y: 32 }, // PIN TOUCHES GROUND
    });
  }, [map]);

  // ================= MARKERS =================
  useEffect(() => {
    if (!map) return;

    // Remove old markers safely
    markersRef.current.forEach((m) => {
      if (m && map.hasObject && map.hasObject(m)) {
        map.removeObject(m);
      }
    });
    markersRef.current = [];

    // Add origin marker
    if (userLocation && originIconRef.current) {
      const m = new window.H.map.Marker(userLocation, {
        icon: originIconRef.current,
      });
      map.addObject(m);
      markersRef.current.push(m);
    }

    // Add destination marker
    if (destination && destinationIconRef.current) {
      const m = new window.H.map.Marker(destination, {
        icon: destinationIconRef.current,
      });
      map.addObject(m);
      markersRef.current.push(m);
    }
  }, [map, userLocation, destination]);

  // ================= ROUTE =================
  const drawRoute = useCallback(async () => {
    if (!map || !userLocation || !destination) return;

    setRouteLoading(true);

    if (routeLineRef.current) {
      map.removeObject(routeLineRef.current);
      routeLineRef.current = null;
    }

    try {
      const route = await calculateRoute(userLocation, destination);
      const polyline = route?.sections?.[0]?.polyline;

      if (polyline) {
        const lineString = decodePolyline(polyline);
        const routeLine = new window.H.map.Polyline(lineString, {
          style: { strokeColor: "#2F80ED", lineWidth: 6 },
        });
        map.addObject(routeLine);
        routeLineRef.current = routeLine;
      }
    } catch {
      const ls = new window.H.geo.LineString();
      ls.pushPoint(userLocation);
      ls.pushPoint(destination);

      const fallback = new window.H.map.Polyline(ls, {
        style: { strokeColor: "#FF9900", lineWidth: 4, lineDash: [8, 4] },
      });

      map.addObject(fallback);
      routeLineRef.current = fallback;
    }

    map.getViewModel().setLookAtData({
      bounds: new window.H.geo.Rect(
        Math.min(userLocation.lat, destination.lat),
        Math.min(userLocation.lng, destination.lng),
        Math.max(userLocation.lat, destination.lat),
        Math.max(userLocation.lng, destination.lng)
      ),
      padding: { top: 50, left: 50, right: 50, bottom: 50 },
    });

    setRouteLoading(false);
  }, [map, userLocation, destination]);

  useEffect(() => {
    if (map && showRoute) setTimeout(drawRoute, 300);
  }, [map, showRoute, drawRoute]);

  // ================= RENDER =================
  return (
    <div className="here-map-container">
      <div
        ref={mapRef}
        className="map-canvas"
        style={{ width: "100%", height: "100%" }}
      />

      {routeLoading && (
        <div className="route-loading">
          <div className="loading-spinner small" />
          <p>Calculating route...</p>
        </div>
      )}

      {error && (
        <div className="map-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default HEREDeliveryMap;
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
//   packages = [], // Add this prop to receive packages
//   routeLocation = "", // Add these to know which packages are matching
//   routeDestination = "",
// }) => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const routeLineRef = useRef(null);
//   const markersRef = useRef([]);
//   const packageMarkersRef = useRef([]); // New ref for package markers

//   const originIconRef = useRef(null);
//   const destinationIconRef = useRef(null);
//   const matchingPackageIconRef = useRef(null);
//   const otherPackageIconRef = useRef(null);

//   const [map, setMap] = useState(null);
//   const [routeLoading, setRouteLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [packageCoordinates, setPackageCoordinates] = useState({}); // Store geocoded package locations

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

//   // ================= ICONS =================
//   useEffect(() => {
//     if (!map || !window.H) return;

//     // Create SVG icons for different marker types
//     const createSvgIcon = (color, isPackage = false) => {
//       if (isPackage) {
//         // Package icon: square with drop shadow
//         const svg = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
//           <defs>
//             <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
//               <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
//               <feOffset dx="0" dy="2" result="offsetblur"/>
//               <feMerge>
//                 <feMergeNode/>
//                 <feMergeNode in="SourceGraphic"/>
//               </feMerge>
//             </filter>
//           </defs>
//           <rect x="6" y="6" width="20" height="20" rx="4" fill="${color}" filter="url(#shadow)" stroke="white" stroke-width="2"/>
//           <path d="M12 12 L20 12 L20 20 L12 20 Z" fill="white" fill-opacity="0.8"/>
//         </svg>
//       `;
//         return new window.H.map.Icon(
//           `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
//           {
//             size: { w: 32, h: 32 },
//             anchor: { x: 16, y: 16 },
//           }
//         );
//       } else {
//         // Circle icon for origin
//         const svg = `
//         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
//           <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="3"/>
//           <circle cx="16" cy="16" r="6" fill="white"/>
//         </svg>
//       `;
//         return new window.H.map.Icon(
//           `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
//           {
//             size: { w: 32, h: 32 },
//             anchor: { x: 16, y: 16 },
//           }
//         );
//       }
//     };

//     originIconRef.current = createSvgIcon("#4285F4", false); // Blue circle
//     matchingPackageIconRef.current = createSvgIcon("#4CAF50", true); // Green package
//     otherPackageIconRef.current = createSvgIcon("#FF9800", true); // Orange package

//     // 🔴 DESTINATION → Bootstrap SVG PIN
//     destinationIconRef.current = new window.H.map.Icon(geoFilIcon, {
//       size: { w: 32, h: 32 },
//       anchor: { x: 16, y: 32 }, // PIN TOUCHES GROUND
//     });
//   }, [map]);

//   // ================= GEOCODE PACKAGE LOCATIONS =================
//   const geocodePackages = useCallback(async () => {
//     if (!packages.length) return;

//     console.log("📍 Geocoding package locations...");

//     const coordinates = {};
//     const geocodePromises = [];

//     // Geocode each package's location
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
//               // Fallback to random coordinates near the route
//               const randomOffset = () => (Math.random() - 0.5) * 0.5;
//               coordinates[pkg.id] = {
//                 lat: 42.6629 + randomOffset(),
//                 lng: 21.1655 + randomOffset(),
//                 name: pkg.name,
//                 location: pkg.location,
//                 destination: pkg.destination,
//                 isMatching: false,
//               };
//             }
//           })()
//         );
//       }
//     }

//     // Execute all geocoding in parallel
//     await Promise.all(geocodePromises);
//     setPackageCoordinates(coordinates);

//     console.log("✅ Geocoded package coordinates:", coordinates);
//   }, [packages, routeLocation, routeDestination]);

//   // ================= ADD PACKAGE MARKERS =================
//   const addPackageMarkers = useCallback(() => {
//     if (!map || !window.H) return;

//     // Remove existing package markers
//     packageMarkersRef.current.forEach((marker) => {
//       if (marker && map.hasObject && map.hasObject(marker)) {
//         map.removeObject(marker);
//       }
//     });
//     packageMarkersRef.current = [];

//     // Add markers for each geocoded package
//     Object.entries(packageCoordinates).forEach(([packageId, coords]) => {
//       const icon = coords.isMatching
//         ? matchingPackageIconRef.current
//         : otherPackageIconRef.current;

//       const marker = new window.H.map.Marker(
//         { lat: coords.lat, lng: coords.lng },
//         { icon: icon }
//       );

//       // Add info bubble on click
//       marker.addEventListener("tap", (evt) => {
//         const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
//           content: `
//               <div style="padding: 10px; font-family: Arial, sans-serif;">
//                 <h3 style="margin: 0 0 8px 0; color: #333;">${coords.name}</h3>
//                 <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">
//                   <strong>From:</strong> ${coords.location}
//                 </p>
//                 <p style="margin: 0; color: #666; font-size: 12px;">
//                   <strong>To:</strong> ${coords.destination}
//                 </p>
//                 ${
//                   coords.isMatching
//                     ? '<span style="display: inline-block; background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-top: 6px;">Matches Route</span>'
//                     : ""
//                 }
//               </div>
//             `,
//         });

//         // Remove any existing info bubble
//         map.getObjects().forEach((obj) => {
//           if (obj instanceof window.H.ui.InfoBubble) {
//             map.removeObject(obj);
//           }
//         });

//         map.addObject(bubble);
//       });

//       map.addObject(marker);
//       packageMarkersRef.current.push(marker);
//     });

//     console.log(
//       `📍 Added ${packageMarkersRef.current.length} package markers to map`
//     );
//   }, [map, packageCoordinates]);

//   // ================= ROUTE MARKERS =================
//   useEffect(() => {
//     if (!map) return;

//     // Remove old route markers
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
//         zIndex: 100, // Higher z-index to appear above packages
//       });
//       map.addObject(m);
//       markersRef.current.push(m);
//     }

//     // Add destination marker
//     if (destination && destinationIconRef.current) {
//       const m = new window.H.map.Marker(destination, {
//         icon: destinationIconRef.current,
//         zIndex: 100, // Higher z-index to appear above packages
//       });
//       map.addObject(m);
//       markersRef.current.push(m);
//     }
//   }, [map, userLocation, destination]);

//   // ================= ROUTE DRAWING =================
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
//           style: {
//             strokeColor: "#2F80ED",
//             lineWidth: 6,
//             zIndex: 50, // Route should be below markers but above base map
//           },
//           zIndex: 50,
//         });
//         map.addObject(routeLine);
//         routeLineRef.current = routeLine;
//       }
//     } catch {
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

//       map.addObject(fallback);
//       routeLineRef.current = fallback;
//     }

//     // Adjust view to show both route and package markers
//     const allPoints = [
//       userLocation,
//       destination,
//       ...Object.values(packageCoordinates).map((coord) => ({
//         lat: coord.lat,
//         lng: coord.lng,
//       })),
//     ].filter(Boolean);

//     if (allPoints.length > 0) {
//       const bounds = new window.H.geo.Rect(
//         Math.min(...allPoints.map((p) => p.lat)),
//         Math.min(...allPoints.map((p) => p.lng)),
//         Math.max(...allPoints.map((p) => p.lat)),
//         Math.max(...allPoints.map((p) => p.lng))
//       );

//       map.getViewModel().setLookAtData({
//         bounds: bounds,
//         padding: { top: 50, left: 50, right: 50, bottom: 50 },
//       });
//     }

//     setRouteLoading(false);
//   }, [map, userLocation, destination, packageCoordinates]);

//   // ================= EFFECTS =================
//   // Geocode packages when they change
//   useEffect(() => {
//     if (packages.length > 0 && map) {
//       geocodePackages();
//     }
//   }, [packages, map, geocodePackages]);

//   // Add package markers when coordinates are ready
//   useEffect(() => {
//     if (map && Object.keys(packageCoordinates).length > 0) {
//       addPackageMarkers();
//     }
//   }, [map, packageCoordinates, addPackageMarkers]);

//   // Draw route when needed
//   useEffect(() => {
//     if (map && showRoute && userLocation && destination) {
//       setTimeout(drawRoute, 300);
//     }
//   }, [map, showRoute, drawRoute, userLocation, destination]);

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

//       {/* Package count indicator */}
//       {Object.keys(packageCoordinates).length > 0 && (
//         <div className="package-count-indicator">
//           <span className="package-count-badge">
//             📦 {Object.keys(packageCoordinates).length} packages on map
//           </span>
//           <div className="package-legend">
//             <div className="legend-item">
//               <span className="legend-color matching"></span>
//               <span>
//                 Matches route (
//                 {
//                   Object.values(packageCoordinates).filter((c) => c.isMatching)
//                     .length
//                 }
//                 )
//               </span>
//             </div>
//             <div className="legend-item">
//               <span className="legend-color other"></span>
//               <span>
//                 Other packages (
//                 {
//                   Object.values(packageCoordinates).filter((c) => !c.isMatching)
//                     .length
//                 }
//                 )
//               </span>
//             </div>
//           </div>
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
