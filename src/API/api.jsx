// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://localhost:7273", // Adjust the URL to match your backend
// });

// export default api;
import axios from "axios";

const API_URL = "http://localhost:5210/api"; // Përdor HTTP pa redirect

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Vendose true nëse përdor credentials
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
      // Enhanced error parsing
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

  // In your authApi.login function
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      console.log("Raw login response:", response.data); // Debug log

      // Normalize the user data structure
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

      console.log("Processed user data:", userData); // Debug log
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login API error:", error);
      throw error.response?.data || error.message;
    }
  },

  // Add this new method for complete profile
  completeProfile: async (formData) => {
    try {
      const response = await api.post("/auth/complete-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        transformRequest: (data) => data, // Important for FormData
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
      const response = await api.post("/packages", packageData);
      return response.data;
    } catch (error) {
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
