using Blog.Application.DTOs.Comments;

namespace Blog.Application.Interfaces.Services
{
    public interface ICommentService
    {
        Task<Guid> CreateCommentAsync(Guid postId, CreateCommentRequest request, string userId, string userDisplayName);
        Task<IEnumerable<CommentResponse>> GetCommentsByPostIdAsync(Guid postId, int page, int pageSize);
        Task UpdateCommentAsync(Guid commentId, UpdateCommentRequest request, string userId);
        Task DeleteCommentAsync(Guid commentId, string userId, bool isAdmin);
    }
}
