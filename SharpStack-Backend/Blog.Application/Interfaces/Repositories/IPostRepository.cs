
using Blog.Application.DTOs.BusinessLogic;
using Blog.Application.DTOs.Posts;
using Blog.Domain.Entities;

namespace Blog.Application.Interfaces.Repositories
{
    public interface IPostRepository
    {
        // Define methods for post repository
        Task AddAsync(Post post);
        Task<Post?> GetByIdAsync(Guid postId);
        Task <Post?> GetBySlugAsync(string slug);
        Task <IEnumerable<Post>> GetAllAsync();
        Task UpdateAsync(Post post);
        Task DeleteAsync(Post post);
        Task SaveChangesAsync();
        Task<PostStatDto> GetPostStatisticsAsync();
        
    }
}