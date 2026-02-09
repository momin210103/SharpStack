import axiosInstance from "./axios";

const postService = {
  // Public endpoints
  getPublicPosts: async (page = 1, pageSize = 10, categoryId = null) => {
    const params = new URLSearchParams({ page, pageSize });
    if (categoryId) params.append("categoryId", categoryId);
    const response = await axiosInstance.get(`/posts?${params}`);
    return response.data;
  },
  getPostById: async (id) => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  // Get post by ID (for admin/edit)
  getByIdAsync: async (id) => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  getPostBySlug: async (slug) => {
    const response = await axiosInstance.get(`/posts/by-slug/${slug}`);
    return response.data;
  },

  // Admin endpoints
  getAllPosts: async () => {
    const response = await axiosInstance.get("/posts/allposts");
    return response.data;
  },

  getUnpublishedPosts: async () => {
    const response = await axiosInstance.get("/posts/unpublished");
    return response.data;
  },

  createPost: async (postData) => {
    // Check if postData is FormData (for file uploads) or regular object
    const config =
      postData instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

    const response = await axiosInstance.post("/posts", postData, config);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await axiosInstance.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await axiosInstance.delete(`/posts/${id}`);
    return response.data;
  },

  publishPost: async (id) => {
    const response = await axiosInstance.put(`/posts/${id}/publish`);
    return response.data;
  },

  // Image endpoints
  uploadImages: async (postId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await axiosInstance.post(
      `/posts/${postId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  getPostImages: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}/images`);
    return response.data;
  },

  deleteImage: async (postId, imageId) => {
    const response = await axiosInstance.delete(
      `/posts/${postId}/images/${imageId}`,
    );
    return response.data;
  },
  
};

export default postService;
