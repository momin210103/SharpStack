import axiosInstance from "./axios";

const authService = {
  register: async (email, password) => {
    const response = await axiosInstance.post("/auth/register", {
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes("Admin") || false;
  },
};

export default authService;
