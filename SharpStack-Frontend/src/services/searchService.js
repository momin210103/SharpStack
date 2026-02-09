import axiosInstance from "./axios";

const searchService = {
  search: async (query, categoryId = null, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ q: query, page, pageSize });
    if (categoryId) params.append("categoryId", categoryId);
    const response = await axiosInstance.get(`/search?${params}`);
    return response.data;
  },

  searchCategories: async (query) => {
    const response = await axiosInstance.get(`/search/categories?q=${query}`);
    return response.data;
  },
};

export default searchService;
