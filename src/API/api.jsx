// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://localhost:7273", // Adjust the URL to match your backend
// });

// export default api;
import axios from "axios";

const API_URL = "http://localhost:5210/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Add request interceptor to include the token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  // Add the missing validateToken method
  validateToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { isValid: false };
      }

      // Simple token validation - you might want to implement proper JWT validation
      const response = await api.get("/auth/validate");
      return { isValid: true, user: response.data };
    } catch (error) {
      console.error("Token validation error:", error);
      return { isValid: false };
    }
  },

  basicRegister: async (userData) => {
    try {
      const response = await api.post(
        "/auth/basic-register",
        {
          FullName: userData.FullName,
          Email: userData.Email,
          DateOfBirth: userData.DateOfBirth,
          Password: userData.Password,
          ConfirmPassword: userData.ConfirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const serverError = error.response.data;
        throw {
          message: serverError.title || "Registration failed",
          errors: serverError.errors,
          status: error.response.status,
        };
      }
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      console.log("Raw login response:", response.data);

      const user = response.data.user || {};
      const userData = {
        id: user.Id || user.id,
        email: user.Email || user.email,
        fullName: user.FullName || user.fullName,
        dateOfBirth: user.DateOfBirth || user.dateOfBirth,
        streetAddress: user.StreetAddress || user.streetAddress,
        city: user.City || user.city,
        state: user.State || user.state,
        zipCode: user.ZipCode || user.zipCode,
        mobileNumber: user.MobileNumber || user.mobileNumber,
        idDocumentPath: user.IdDocumentPath || user.idDocumentPath,
        drivingLicensePath: user.DrivingLicensePath || user.drivingLicensePath,
        isProfileComplete: response.data.profileComplete ?? false,
        token: response.data.token,
      };

      console.log("Processed user data:", userData);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login API error:", error);
      throw error.response?.data || error.message;
    }
  },

  completeProfile: async (formData) => {
    try {
      const response = await api.post("/auth/complete-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        transformRequest: (data) => data,
      });
      return response.data;
    } catch (error) {
      console.error("Complete profile API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error.response?.data || error.message;
    }
  },
};

// Packages API
export const packagesApi = {
  createPackage: async (packageData) => {
    try {
      const response = await api.post("/packages", {
        name: packageData.name,
        location: packageData.location,
        destination: packageData.destination,
        description: packageData.description,
        weight: parseFloat(packageData.weightinKg),
        length: parseFloat(packageData.length),
        height: parseFloat(packageData.height),
        width: parseFloat(packageData.width),
        price: parseFloat(packageData.price),
      });

      console.log("Package creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Package creation error:",
        error.response?.data || error.message
      );
      throw error.response?.data || error.message;
    }
  },

  getPackages: async () => {
    try {
      const response = await api.get("/packages");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPackage: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Simple user lookup from localStorage (fallback)
  getUser: async (identifier) => {
    try {
      // First try to get from API if endpoint exists
      try {
        const response = await api.get(`/users/${identifier}`);
        return response.data;
      } catch (apiError) {
        console.log(
          "User API endpoint not available, using localStorage fallback"
        );

        // Fallback to localStorage
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

        // Add current user to users array if not already there
        if (currentUser.id && !users.some((u) => u.id === currentUser.id)) {
          users.push(currentUser);
        }

        const user = users.find(
          (u) => u.id === identifier || u.email === identifier
        );

        if (user) {
          return user;
        }

        // If user not found, return basic info
        return {
          id: identifier,
          name: "Unknown User",
          email:
            typeof identifier === "string" && identifier.includes("@")
              ? identifier
              : "unknown@example.com",
          phone: "Not available",
          isPlaceholder: true,
        };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },
  resolveReferences: async (references) => {
    try {
      const referenceIds = references
        .map((ref) => {
          // Extract ID from $ref (could be like '10', '12', etc.)
          const refValue = ref.$ref;
          if (!isNaN(refValue)) return parseInt(refValue);

          const match = refValue.match(/\d+/);
          return match ? parseInt(match[0]) : null;
        })
        .filter((id) => id !== null);

      console.log("Reference IDs to resolve:", referenceIds);

      // Fetch each referenced package
      const resolvedPackages = [];
      for (const id of referenceIds) {
        try {
          const packageDetail = await packagesApi.getPackage(id);
          if (packageDetail && packageDetail.id) {
            resolvedPackages.push(packageDetail);
          }
        } catch (error) {
          console.error(`Failed to fetch package ${id}:`, error);
        }
      }

      return resolvedPackages;
    } catch (error) {
      console.error("Error resolving references:", error);
      return [];
    }
  },
};

export default api;

// import axios from "axios";

// const API_URL = "http://localhost:5210/api"; // Përdor HTTP pa redirect

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: false, // Vendose true nëse përdor credentials
// });

// // Add request interceptor to include the token if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auth API
// export const authApi = {
//   basicRegister: async (userData) => {
//     try {
//       const response = await api.post(
//         "/auth/basic-register",
//         {
//           FullName: userData.FullName,
//           Email: userData.Email,
//           DateOfBirth: userData.DateOfBirth,
//           Password: userData.Password,
//           ConfirmPassword: userData.ConfirmPassword,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       // Enhanced error parsing
//       if (error.response) {
//         const serverError = error.response.data;
//         throw {
//           message: serverError.title || "Registration failed",
//           errors: serverError.errors,
//           status: error.response.status,
//         };
//       }
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await api.post("/auth/login", credentials);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // Add this new method for complete profile
//   completeProfile: async (formData) => {
//     try {
//       const response = await api.post("/auth/complete-profile", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },
// };

// // Packages API
// export const packagesApi = {
//   createPackage: async (packageData) => {
//     try {
//       const response = await api.post("/packages", packageData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getPackages: async () => {
//     try {
//       const response = await api.get("/packages");
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getPackage: async (id) => {
//     try {
//       const response = await api.get(`/packages/${id}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },
// };

// export default api;
