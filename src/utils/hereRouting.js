const HERE_API_KEY = "IWbj9t2I4YTh0ipZ6OtXe2cUbZ0mQ-1MY1LhPOMeCq4";

// Function to calculate route using HERE Routing API v8
export const calculateRoute = async (origin, destination) => {
  try {
    if (!origin || !destination) {
      throw new Error("Missing origin or destination coordinates");
    }

    if (!origin.lat || !origin.lng || !destination.lat || !destination.lng) {
      throw new Error("Invalid coordinates format");
    }

    console.log("🚗 Calculating route with HERE API v8:", {
      origin,
      destination,
    });

    const url =
      `https://router.hereapi.com/v8/routes?` +
      `transportMode=car&` +
      `origin=${origin.lat},${origin.lng}&` +
      `destination=${destination.lat},${destination.lng}&` +
      `return=polyline,summary&` +
      `apiKey=${HERE_API_KEY}`;

    console.log("📡 API URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let errorText = "Unknown error";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = response.statusText;
      }
      console.error("❌ API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Route API Response:", data);

    if (!data.routes || data.routes.length === 0) {
      throw new Error("No routes found in response");
    }

    return data.routes[0];
  } catch (error) {
    console.error("❌ Route calculation error:", error);
    throw new Error(`Route calculation failed: ${error.message}`);
  }
};

// Function to geocode an address
export const geocodeAddress = async (address) => {
  try {
    if (!address || typeof address !== "string" || address.trim() === "") {
      throw new Error("Invalid address provided");
    }

    console.log("📍 Geocoding address:", address);

    const url =
      `https://geocode.search.hereapi.com/v1/geocode?` +
      `q=${encodeURIComponent(address.trim())}&` +
      `apiKey=${HERE_API_KEY}`;

    console.log("📡 Geocoding URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let errorText = "Unknown error";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = response.statusText;
      }
      console.error("❌ Geocoding API Error:", errorText);
      throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Geocoding Response:", data);

    if (!data.items || data.items.length === 0) {
      throw new Error("Address not found");
    }

    const location = data.items[0].position;
    if (!location || !location.lat || !location.lng) {
      throw new Error("Invalid location data received");
    }

    return {
      lat: location.lat,
      lng: location.lng,
      address: data.items[0].address?.label || address,
    };
  } catch (error) {
    console.error("❌ Geocoding error:", error);
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

export const decodePolyline = (polyline) => {
  if (!polyline) {
    console.error("❌ No polyline provided for decoding");
    return null;
  }

  if (!window.H || !window.H.geo || !window.H.geo.LineString) {
    console.error("❌ HERE Maps SDK (H.geo.LineString) not available");
    return null;
  }

  try {
    console.log("🔍 Decoding polyline:", polyline.substring(0, 50) + "...");

    // Try using the built-in decoder if it exists
    if (window.H.geo.LineString.fromFlexiblePolyline) {
      try {
        console.log("✅ Using fromFlexiblePolyline");
        return window.H.geo.LineString.fromFlexiblePolyline(polyline);
      } catch (e) {
        console.warn("fromFlexiblePolyline failed, trying fallback", e);
      }
    }

    // Fallback: Manual decoding for flexible polyline format
    console.log("🔄 Using manual decoder fallback");

    // Parse the polyline manually
    const lineString = new window.H.geo.LineString();

    try {
      // Simple approach: Create a line string with start and end points
      // (You might need a proper polyline decoder library here)

      // For now, return null to trigger the straight line fallback
      console.warn(
        "⚠️ Using straight line fallback - implement proper polyline decoder"
      );
      return null;
    } catch (error) {
      console.error("Manual decoding error:", error);
      return null;
    }
  } catch (e) {
    console.error("❌ Failed to decode polyline:", e);
    return null;
  }
};

// SIMPLE POLYLINE DECODER (for testing)
export const simpleDecodePolyline = (str, precision = 5) => {
  if (!str) return null;

  try {
    console.log("🔍 Simple polyline decoder called");

    // Create a basic line string with start and end points
    // This is just for testing - you'd need a real decoder for complex routes
    const lineString = new window.H.geo.LineString();

    // Parse the polyline string (basic implementation)
    // This is a simplified version - actual polyline encoding is more complex
    const coords = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < str.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = str.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);

      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      coords.push([lat * 1e-5, lng * 1e-5]);
    }

    // Add coordinates to line string
    coords.forEach((coord) => {
      lineString.pushPoint({ lat: coord[0], lng: coord[1] });
    });

    console.log(`✅ Simple decoder created line with ${coords.length} points`);
    return lineString;
  } catch (e) {
    console.error("Simple decoder error:", e);
    return null;
  }
};
