

using Blog.Domain.Entities;

namespace Blog.Application.Interfaces.Repositories
{
    public interface ICategoryRepository
    {
        Task AddAsync(Category category);
        Task<IEnumerable<Category>> GetAllAsync();
    }
}