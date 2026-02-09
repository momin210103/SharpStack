import axiosInstance from "./axios";

const categoryService = {
  getAll: async () => {
    const response = await axiosInstance.get("/categories");
    return response.data;
  },

  create: async (categoryData) => {
    const response = await axiosInstance.post("/categories", categoryData);
    return response.data;
  },
};

export default categoryService;
