using Blog.Domain.Entities;

namespace Blog.Application.Interfaces.Repositories
{
    public interface ICommentRepository
    {
        Task AddAsync(Comment comment);
        Task<Comment?> GetByIdAsync(Guid commentId);
        Task<IEnumerable<Comment>> GetByPostIdAsync(Guid postId, int page, int pageSize);
        Task UpdateAsync(Comment comment);
        Task DeleteAsync(Comment comment);
    }
}
