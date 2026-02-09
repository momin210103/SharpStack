

using Blog.Application.DTOs.BusinessLogic;
using Blog.Application.DTOs.Posts;
using Blog.Application.Interfaces.Repositories;
using Blog.Domain.Entities;
using Blog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDbContext _context;

        public PostRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async  Task AddAsync(Post post)
        {
            await _context.Posts.AddAsync(post);
            await  _context.SaveChangesAsync();
            
        }

        public async Task DeleteAsync(Post post)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Post>> GetAllAsync()
        {
            return await _context.Posts
            .Include(p => p.Category)
            .Include(p => p.Images)
            .ToListAsync();
        }

        public async Task<Post?> GetByIdAsync(Guid postId)
        {
            return await _context.Posts
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<Post?> GetBySlugAsync(string slug)
        {
            return await _context.Posts
            .Include(p => p.Category)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Slug == slug);
        }

        public async Task UpdateAsync(Post post)
        {
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<PostStatDto> GetPostStatisticsAsync()
        {
           var statistics = await _context.Posts
            .GroupBy(p => 1)
            .Select(x => new PostStatDto
            {
                TotalPosts = x.Count(),
                PublishedPosts = x.Count(p => p.IsPublished),
                UnpublishedPosts = x.Count(p => !p.IsPublished)
            })
            .FirstOrDefaultAsync();

            return statistics ?? new PostStatDto();
        }

        // Implement repository methods here
    }
}