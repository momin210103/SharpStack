import axiosInstance from "./axios";

const statisticService = {
  getStatistics: async () => {
    try {
      const response = await axiosInstance.get("admin/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  },
};

export default statisticService;
