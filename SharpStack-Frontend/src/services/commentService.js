import axiosInstance from "./axios";

const commentService = {
  getCommentsByPostId: async (postId, page = 1, pageSize = 10) => {
    const response = await axiosInstance.get(
      `/posts/${postId}/comments?page=${page}&pageSize=${pageSize}`,
    );
    return response.data;
  },

  createComment: async (postId, content) => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, {
      content,
    });
    return response.data;
  },

  updateComment: async (postId, commentId, content) => {
    const response = await axiosInstance.put(
      `/posts/${postId}/comments/${commentId}`,
      { content },
    );
    return response.data;
  },

  deleteComment: async (postId, commentId) => {
    const response = await axiosInstance.delete(
      `/posts/${postId}/comments/${commentId}`,
    );
    return response.data;
  },
};

export default commentService;
