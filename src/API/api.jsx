// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://localhost:7273", // Adjust the URL to match your backend
// });

// export default api;
// import axios from "axios";

// const API_URL = "http://192.168.0.66:5210/api";

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: false,
// });

// // Add request interceptor to include the token if available
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // Don't log FormData content as it's not easily readable
//   if (!(config.data instanceof FormData)) {
//     console.log("Request data:", config.data);
//   }

//   console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
//   return config;
// });

// api.interceptors.response.use(
//   (response) => {
//     console.log(`API Response: ${response.status} ${response.config.url}`);

//     // Don't log large file responses
//     if (
//       !response.config.url.includes("/auth/complete-profile") &&
//       !response.config.url.includes("/auth/update-profile")
//     ) {
//       console.log("Response data:", response.data);
//     }

//     return response;
//   },
//   (error) => {
//     console.error(`API Error: ${error.response?.status} ${error.config?.url}`);

//     // Handle file upload errors specifically
//     if (
//       error.config?.url.includes("/auth/complete-profile") ||
//       error.config?.url.includes("/auth/update-profile")
//     ) {
//       console.error("File upload error:", error.response?.data?.message);
//     } else {
//       console.error("Error details:", error.response?.data);
//     }

//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authApi = {
//   // Add the missing validateToken method
//   validateToken: async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         return { isValid: false };
//       }

//       const response = await api.get("/auth/validate");
//       const user = response.data || {};

//       // Process user data to include profile image
//       const userData = {
//         id: user.id,
//         email: user.email,
//         fullName: user.fullName,
//         dateOfBirth: user.dateOfBirth,
//         streetAddress: user.streetAddress,
//         city: user.city,
//         state: user.state,
//         zipCode: user.zipCode,
//         mobileNumber: user.mobileNumber,
//         idDocumentPath: user.idDocumentPath,
//         drivingLicensePath: user.drivingLicensePath,
//         profileImage: user.ProfileImagePath || user.profileImagePath, // Add profile image
//         isProfileComplete: user.isProfileComplete,
//       };

//       return { isValid: true, user: userData };
//     } catch (error) {
//       console.error("Token validation error:", error);
//       return { isValid: false };
//     }
//   },

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
//       console.log("Raw login response:", response.data);

//       const user = response.data.user || {};
//       const userData = {
//         id: user.Id || user.id,
//         email: user.Email || user.email,
//         fullName: user.FullName || user.fullName,
//         dateOfBirth: user.DateOfBirth || user.dateOfBirth,
//         streetAddress: user.StreetAddress || user.streetAddress,
//         city: user.City || user.city,
//         state: user.State || user.state,
//         zipCode: user.ZipCode || user.zipCode,
//         mobileNumber: user.MobileNumber || user.mobileNumber,
//         idDocumentPath: user.IdDocumentPath || user.idDocumentPath,
//         drivingLicensePath: user.DrivingLicensePath || user.drivingLicensePath,
//         profileImage: user.ProfileImagePath || user.profileImagePath, // Add profile image
//         isProfileComplete: response.data.profileComplete ?? false,
//         token: response.data.token,
//       };

//       console.log("Processed user data:", userData);
//       localStorage.setItem("token", userData.token);
//       localStorage.setItem("user", JSON.stringify(userData));
//       return userData;
//     } catch (error) {
//       console.error("Login API error:", error);
//       throw error.response?.data || error.message;
//     }
//   },

//   completeProfile: async (formData) => {
//     try {
//       const response = await api.post("/auth/complete-profile", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         transformRequest: (data) => data,
//       });

//       // Process the response to include profile image
//       const userData = response.data.user || {};
//       const processedData = {
//         ...response.data,
//         user: {
//           ...userData,
//           profileImage: userData.ProfileImagePath || userData.profileImagePath,
//         },
//       };

//       return processedData;
//     } catch (error) {
//       console.error("Complete profile API error:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       throw error.response?.data || error.message;
//     }
//   },

//   updateProfile: async (formData) => {
//     try {
//       const response = await api.post("/users/update-profile", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         transformRequest: (data) => data,
//       });

//       // Process the response
//       const userData = response.data || {};
//       const processedData = {
//         ...userData,
//         profileImage: userData.ProfileImagePath || userData.profileImagePath,
//       };

//       return processedData;
//     } catch (error) {
//       console.error("Update profile API error:", error);

//       // ADD BETTER ERROR LOGGING
//       if (error.response?.data?.errors) {
//         console.error("Validation errors:", error.response.data.errors);
//       }
//       if (error.response?.data) {
//         console.error("Full error response:", error.response.data);
//       }

//       throw error.response?.data || error.message;
//     }
//   },
// };

// // Packages API
// export const packagesApi = {
//   createPackage: async (formData) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(`${API_URL}/packages`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Package creation response:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Package creation error:",
//         error.response?.data || error.message
//       );
//       throw error.response?.data || error.message;
//     }
//   },

//   getPackages: async () => {
//     try {
//       const response = await api.get("/packages");
//       console.log("API Response:", response.data); // Add this line
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

//   // Simple user lookup from localStorage (fallback)
//   getUser: async (identifier) => {
//     try {
//       // First try to get from API if endpoint exists
//       try {
//         const response = await api.get(`/users/${identifier}`);
//         const userData = response.data || {};
//         return {
//           ...userData,
//           profileImage: userData.ProfileImagePath || userData.profileImagePath,
//         };
//       } catch (apiError) {
//         console.log(
//           "User API endpoint not available, using localStorage fallback"
//         );

//         // Fallback to localStorage
//         const users = JSON.parse(localStorage.getItem("users")) || [];
//         const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

//         // Add current user to users array if not already there
//         if (currentUser.id && !users.some((u) => u.id === currentUser.id)) {
//           users.push(currentUser);
//         }

//         const user = users.find(
//           (u) => u.id === identifier || u.email === identifier
//         );

//         if (user) {
//           return {
//             ...user,
//             profileImage:
//               user.ProfileImagePath ||
//               user.profileImagePath ||
//               user.profileImage,
//           };
//         }

//         // If user not found, return basic info
//         return {
//           id: identifier,
//           name: "Unknown User",
//           email:
//             typeof identifier === "string" && identifier.includes("@")
//               ? identifier
//               : "unknown@example.com",
//           phone: "Not available",
//           isPlaceholder: true,
//         };
//       }
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       throw error;
//     }
//   },

//   resolveReferences: async (references) => {
//     try {
//       const referenceIds = references
//         .map((ref) => {
//           // Extract ID from $ref (could be like '10', '12', etc.)
//           const refValue = ref.$ref;
//           if (!isNaN(refValue)) return parseInt(refValue);

//           const match = refValue.match(/\d+/);
//           return match ? parseInt(match[0]) : null;
//         })
//         .filter((id) => id !== null);

//       console.log("Reference IDs to resolve:", referenceIds);

//       // Fetch each referenced package
//       const resolvedPackages = [];
//       for (const id of referenceIds) {
//         try {
//           const packageDetail = await packagesApi.getPackage(id);
//           if (packageDetail && packageDetail.id) {
//             resolvedPackages.push(packageDetail);
//           }
//         } catch (error) {
//           console.error(`Failed to fetch package ${id}:`, error);
//         }
//       }

//       return resolvedPackages;
//     } catch (error) {
//       console.error("Error resolving references:", error);
//       return [];
//     }
//   },
// };

// // API/api.js
// export const transportApi = {
//   createRequest: async (requestData) => {
//     try {
//       const response = await api.post("/transportrequests", requestData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getUserRequests: async (userId) => {
//     try {
//       const response = await api.get(`/transportrequests/user/${userId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   // In your api.js, update the updateRequestStatus method
//   updateRequestStatus: async (requestId, status) => {
//     try {
//       // Try the correct endpoint first
//       try {
//         const response = await api.put(
//           `/transportrequests/${requestId}/status`,
//           {
//             status: status,
//           }
//         );
//         return response.data;
//       } catch (error) {
//         console.log("Primary endpoint failed, trying alternatives...");

//         // Try alternative endpoints
//         try {
//           // Try with different status values
//           const statusMap = {
//             approve: "Accepted",
//             decline: "Rejected",
//             Accepted: "Accepted",
//             Rejected: "Rejected",
//           };

//           const backendStatus = statusMap[status] || status;

//           const response = await api.put(`/transportrequests/${requestId}`, {
//             status: backendStatus,
//           });
//           return response.data;
//         } catch (error2) {
//           console.log("Second endpoint failed, trying PATCH...");

//           try {
//             const response = await api.patch(
//               `/transportrequests/${requestId}`,
//               {
//                 status: status,
//               }
//             );
//             return response.data;
//           } catch (error3) {
//             console.log("All API endpoints failed, using mock update");

//             // For development, update mock data
//             if (process.env.NODE_ENV === "development") {
//               const userId = JSON.parse(
//                 localStorage.getItem("user") || "{}"
//               ).id;
//               if (userId) {
//                 const userRequestsKey = `pendingRequests_${userId}`;
//                 const mockRequests = JSON.parse(
//                   localStorage.getItem(userRequestsKey) || "[]"
//                 );

//                 const updatedRequests = mockRequests.filter(
//                   (req) => req.id != requestId
//                 );
//                 localStorage.setItem(
//                   userRequestsKey,
//                   JSON.stringify(updatedRequests)
//                 );

//                 return {
//                   success: true,
//                   message: "Request updated in mock data",
//                 };
//               }
//             }

//             throw error3;
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error updating request status:", error);
//       throw error.response?.data || error.message;
//     }
//   },

//   // In your api.js, update the getOwnerRequests method
//   getOwnerRequests: async (userId) => {
//     try {
//       console.log("🔄 Fetching owner requests for user:", userId);

//       const response = await api.get("/transportrequests/owner/my-requests");
//       console.log("📦 Raw API response:", response);
//       console.log("📦 Response data:", response.data);

//       return response.data;
//     } catch (error) {
//       console.error("❌ Error in getOwnerRequests:", error);
//       console.error("❌ Error response:", error.response?.data);

//       // For development fallback
//       if (process.env.NODE_ENV === "development") {
//         console.log("🔄 Using development fallback data");
//         return [
//           {
//             id: 1,
//             packageId: 101,
//             packageName: "Test Package",
//             requesterId: "test-user",
//             requesterName: "Test User",
//             requesterEmail: "test@example.com",
//             message: "Test request message",
//             status: "Pending",
//             requestDate: new Date().toISOString(),
//           },
//         ];
//       }

//       throw error.response?.data || error.message;
//     }
//   },
// };

// // API/api.js - Add to transportApi or create new messagesApi
// export const messagesApi = {
//   sendMessage: async (messageData) => {
//     try {
//       const response = await api.post("/messages", messageData);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getConversation: async (otherUserId) => {
//     try {
//       const response = await api.get(`/messages/conversation/${otherUserId}`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   getContacts: async () => {
//     try {
//       const response = await api.get("/messages/contacts");
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },

//   markAsRead: async (messageId) => {
//     try {
//       const response = await api.put(`/messages/${messageId}/read`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || error.message;
//     }
//   },
// };

// // Utility function to convert file to base64 (for previews)
// export const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

// // Utility function to check if a file is an image
// export const isImageFile = (file) => {
//   return file && file.type.startsWith("image/");
// };

// // Utility function to get full profile image URL
// export const getProfileImageUrl = (imagePath) => {
//   if (!imagePath) return null;

//   // If it's already a URL (http/https) or data URL
//   if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
//     return imagePath;
//   }

//   // If it's a relative path, construct full URL
//   // Remove any leading slashes to ensure proper path construction
//   const cleanPath = imagePath.replace(/^\/+/, "");
//   return `${API_URL}/${cleanPath}`;
// };

// export default api;

import axios from "axios";

const API_URL = "http://192.168.0.66:5210/api";

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

  // Debug token information
  console.log("🔐 Token Debug:", {
    hasToken: !!token,
    tokenLength: token?.length,
    endpoint: config.url,
    method: config.method,
  });

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token added to Authorization header");

    // Debug: Log the token payload (for development only)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("🔐 Token payload:", {
        userId: payload.userId,
        name: payload.unique_name,
        nameIdentifier: payload.nameid,
        expires: new Date(payload.exp * 1000),
      });
    } catch (e) {
      console.log("🔐 Could not parse token payload");
    }
  } else {
    console.warn("⚠️ No token found in localStorage");
  }

  // Don't log FormData content as it's not easily readable
  if (!(config.data instanceof FormData)) {
    console.log("Request data:", config.data);
  }

  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);

    // Don't log large file responses
    if (
      !response.config.url.includes("/auth/complete-profile") &&
      !response.config.url.includes("/auth/update-profile")
    ) {
      console.log("Response data:", response.data);
    }

    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status} ${error.config?.url}`);

    // Handle file upload errors specifically
    if (
      error.config?.url.includes("/auth/complete-profile") ||
      error.config?.url.includes("/auth/update-profile")
    ) {
      console.error("File upload error:", error.response?.data?.message);
    } else {
      console.error("Error details:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  // Add the missing validateToken method
  validateToken: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { isValid: false };
      }

      const response = await api.get("/auth/validate");
      const user = response.data || {};

      // Process user data to include profile image
      const userData = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        dateOfBirth: user.dateOfBirth,
        streetAddress: user.streetAddress,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        mobileNumber: user.mobileNumber,
        idDocumentPath: user.idDocumentPath,
        drivingLicensePath: user.drivingLicensePath,
        profileImage: user.ProfileImagePath || user.profileImagePath, // Add profile image
        isProfileComplete: user.isProfileComplete,
      };

      return { isValid: true, user: userData };
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
        profileImage: user.ProfileImagePath || user.profileImagePath, // Add profile image
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

      // Process the response to include profile image
      const userData = response.data.user || {};
      const processedData = {
        ...response.data,
        user: {
          ...userData,
          profileImage: userData.ProfileImagePath || userData.profileImagePath,
        },
      };

      return processedData;
    } catch (error) {
      console.error("Complete profile API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (formData) => {
    try {
      const response = await api.post("/users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        transformRequest: (data) => data,
      });

      // Process the response
      const userData = response.data || {};
      const processedData = {
        ...userData,
        profileImage: userData.ProfileImagePath || userData.profileImagePath,
      };

      return processedData;
    } catch (error) {
      console.error("Update profile API error:", error);

      // ADD BETTER ERROR LOGGING
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
      if (error.response?.data) {
        console.error("Full error response:", error.response.data);
      }

      throw error.response?.data || error.message;
    }
  },
};

// Packages API
export const packagesApi = {
  createPackage: async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/packages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
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
      console.log("API Response:", response.data); // Add this line
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // In api.js - Update getPackage method
  getPackage: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      console.log("📦 Package details response:", response.data); // Add this log
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Simple user lookup from localStorage (fallback)
  getUser: async (identifier) => {
    try {
      // First try to get from the new API endpoint
      try {
        const response = await api.get(`/users/by-identifier/${identifier}`);
        const userData = response.data || {};

        return {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName,
          name: userData.fullName,
          profileImage: userData.profileImagePath,
          mobileNumber: userData.mobileNumber,
        };
      } catch (apiError) {
        console.log("User API endpoint not available, using fallback");

        // Fallback: check if this is the current user
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (currentUser.id === identifier || currentUser.email === identifier) {
          return currentUser;
        }

        // For other users, return basic info
        return {
          id: identifier,
          name: "Unknown User",
          email:
            typeof identifier === "string" && identifier.includes("@")
              ? identifier
              : "unknown@example.com",
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

// API/api.js
export const transportApi = {
  createRequest: async (requestData) => {
    try {
      const response = await api.post("/transportrequests", requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // In your api.js - Update the getUserRequests method to ensure ownerId is included
  getUserRequests: async (userId) => {
    try {
      const response = await api.get(`/transportrequests/user/${userId}`);
      console.log("🔍 RAW getUserRequests response:", response.data);

      // Transform the response to ensure all fields are properly mapped
      const requests = response.data.map((request) => ({
        id: request.id,
        packageId: request.packageId,
        packageName: request.packageName,
        ownerId: request.ownerId, // This should now be available
        requesterId: request.requesterId,
        ownerEmail: request.ownerEmail,
        requesterEmail: request.requesterEmail,
        ownerName: request.ownerName,
        requesterName: request.requesterName,
        status: request.status,
        requestDate: request.requestDate,
      }));

      console.log("📋 Processed getUserRequests:", requests);
      return requests;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // In your api.js, update the updateRequestStatus method
  updateRequestStatus: async (requestId, status) => {
    try {
      // Try the correct endpoint first
      try {
        const response = await api.put(
          `/transportrequests/${requestId}/status`,
          {
            status: status,
          }
        );
        return response.data;
      } catch (error) {
        console.log("Primary endpoint failed, trying alternatives...");

        // Try alternative endpoints
        try {
          // Try with different status values
          const statusMap = {
            approve: "Accepted",
            decline: "Rejected",
            Accepted: "Accepted",
            Rejected: "Rejected",
          };

          const backendStatus = statusMap[status] || status;

          const response = await api.put(`/transportrequests/${requestId}`, {
            status: backendStatus,
          });
          return response.data;
        } catch (error2) {
          console.log("Second endpoint failed, trying PATCH...");

          try {
            const response = await api.patch(
              `/transportrequests/${requestId}`,
              {
                status: status,
              }
            );
            return response.data;
          } catch (error3) {
            console.log("All API endpoints failed, using mock update");

            // For development, update mock data
            if (process.env.NODE_ENV === "development") {
              const userId = JSON.parse(
                localStorage.getItem("user") || "{}"
              ).id;
              if (userId) {
                const userRequestsKey = `pendingRequests_${userId}`;
                const mockRequests = JSON.parse(
                  localStorage.getItem(userRequestsKey) || "[]"
                );

                const updatedRequests = mockRequests.filter(
                  (req) => req.id != requestId
                );
                localStorage.setItem(
                  userRequestsKey,
                  JSON.stringify(updatedRequests)
                );

                return {
                  success: true,
                  message: "Request updated in mock data",
                };
              }
            }

            throw error3;
          }
        }
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error.response?.data || error.message;
    }
  },

  // In your api.js, update the getOwnerRequests method
  // getOwnerRequests: async (userId) => {
  //   try {
  //     console.log("🔄 Fetching owner requests for user:", userId);

  //     const response = await api.get("/transportrequests/owner/my-requests");
  //     console.log("📦 Raw API response:", response);
  //     console.log("📦 Response data:", response.data);

  //     return response.data;
  //   } catch (error) {
  //     console.error("❌ Error in getOwnerRequests:", error);
  //     console.error("❌ Error response:", error.response?.data);

  //     // For development fallback
  //     if (process.env.NODE_ENV === "development") {
  //       console.log("🔄 Using development fallback data");
  //       return [
  //         {
  //           id: 1,
  //           packageId: 101,
  //           packageName: "Test Package",
  //           requesterId: "test-user",
  //           requesterName: "Test User",
  //           requesterEmail: "test@example.com",
  //           message: "Test request message",
  //           status: "Pending",
  //           requestDate: new Date().toISOString(),
  //         },
  //       ];
  //     }

  //     throw error.response?.data || error.message;
  //   }
  // },

  getOwnerRequests: async (userId) => {
    try {
      console.log("🔍 Fetching owner requests from backend...");
      const response = await api.get("/transportrequests/owner/my-requests");
      console.log("📦 RAW API RESPONSE:", response);
      console.log("📦 Response data:", response.data);
      console.log("📦 Response status:", response.status);

      let requestsArray = [];
      if (Array.isArray(response.data)) {
        requestsArray = response.data;
        console.log("✅ Response is array, length:", requestsArray.length);
      } else if (
        response.data?.$values &&
        Array.isArray(response.data.$values)
      ) {
        requestsArray = response.data.$values;
        console.log(
          "✅ Response has $values array, length:",
          requestsArray.length
        );
      } else {
        requestsArray = [response.data];
        console.log("✅ Response is single object, wrapped in array");
      }

      // Log each request to see the actual fields
      console.log("🔍 DETAILED REQUEST ANALYSIS:");
      requestsArray.forEach((request, index) => {
        console.log(`📋 Request ${index}:`, {
          id: request.id,
          Id: request.Id,
          requestId: request.requestId,
          packageId: request.packageId,
          PackageId: request.PackageId,
          packageName: request.packageName,
          PackageName: request.PackageName,
          requesterEmail: request.requesterEmail,
          RequesterEmail: request.RequesterEmail,
          requesterId: request.requesterId,
          RequesterId: request.RequesterId,
          // Add all possible field variations
          ALL_FIELDS: Object.keys(request),
        });
      });

      // SIMPLIFIED - No need to fetch packages separately anymore
      const mappedRequests = requestsArray.map((request) => {
        const mapped = {
          requestId: request.id || request.Id || request.requestId,
          deliveryId: request.packageId || request.PackageId,
          deliveryName: request.packageName || request.PackageName,
          requester: request.requesterEmail || request.RequesterEmail,
          requesterId: request.requesterId || request.RequesterId,
          requesterName: request.requesterName || request.RequesterName,
          requesterProfileImage: request.requesterProfileImage,
          ownerId: request.ownerId || request.OwnerId,
          status: request.status || request.Status,
          timestamp:
            request.requestDate || request.RequestDate || request.createdAt,
        };

        console.log(`🔄 Mapping request ${mapped.requestId}:`, mapped);
        return mapped;
      });

      console.log("🔄 FINAL Mapped requests:", mappedRequests);
      return mappedRequests;
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      console.error("❌ Error response:", error.response?.data);
      throw error;
    }
  },
};

// API/api.js - Add to transportApi or create new messagesApi
export const messagesApi = {
  getConversation: async (otherUserId) => {
    try {
      // Validate the ID
      if (!otherUserId) {
        throw new Error("User ID is required");
      }

      const response = await api.get(`/messages/conversation/${otherUserId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error getting conversation for user ${otherUserId}:`,
        error
      );
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      // Validate message data
      if (!messageData.ReceiverId) {
        throw new Error("ReceiverId is required");
      }
      if (!messageData.Content) {
        throw new Error("Message content is required");
      }

      const response = await api.post("/messages", messageData);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  getContacts: async () => {
    try {
      const response = await api.get("/messages/contacts");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (messageId) => {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Utility function to convert file to base64 (for previews)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Utility function to check if a file is an image
export const isImageFile = (file) => {
  return file && file.type.startsWith("image/");
};

// Utility function to get full profile image URL
export const getProfileImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a URL (http/https) or data URL
  if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
    return imagePath;
  }

  // If it's a relative path, construct full URL
  // Remove any leading slashes to ensure proper path construction
  const cleanPath = imagePath.replace(/^\/+/, "");
  return `${API_URL}/${cleanPath}`;
};

// Favorites API
export const favoritesApi = {
  getUserFavorites: async () => {
    try {
      const response = await api.get("/favoritepackages");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addFavorite: async (packageId) => {
    try {
      const response = await api.post("/favoritepackages", {
        packageId: packageId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  removeFavorite: async (packageId) => {
    try {
      const response = await api.delete(`/favoritepackages/${packageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  checkFavorite: async (packageId) => {
    try {
      const response = await api.get(`/favoritepackages/check/${packageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Token validation utility
export const tokenUtils = {
  getTokenInfo: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { isValid: false, message: "No token found" };
    }

    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        return { isValid: false, message: "Invalid token format" };
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const isExpired = payload.exp && Date.now() >= payload.exp * 1000;

      return {
        isValid: !isExpired,
        payload: payload,
        expires: payload.exp ? new Date(payload.exp * 1000) : null,
        isExpired: isExpired,
      };
    } catch (error) {
      return { isValid: false, message: "Error parsing token" };
    }
  },

  clearAuthData: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("🗑️ Cleared authentication data");
  },
};

// Add this to check token on app start
export const initializeAuth = () => {
  const tokenInfo = tokenUtils.getTokenInfo();
  console.log("🔐 Initial Auth Check:", tokenInfo);

  if (!tokenInfo.isValid) {
    tokenUtils.clearAuthData();
  }

  return tokenInfo;
};

export default api;
