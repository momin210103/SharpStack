using Blog.Application.DTOs.Search;
using Blog.Application.Interfaces.Repositories;
using Blog.Application.Interfaces.Services;
using Blog.Domain.Exceptions;

namespace Blog.Application.Services
{
    public class SearchService : ISearchService
    {
        private readonly IPostRepository _postRepository;
        private readonly ICategoryRepository _categoryRepository;

        public SearchService(IPostRepository postRepository, ICategoryRepository categoryRepository)
        {
            _postRepository = postRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<PagedSearchResponse> SearchAsync(string query, Guid? categoryId, int page, int pageSize, bool includeUnpublished = false)
        {
            if (string.IsNullOrWhiteSpace(query))
                throw new BadRequestException("Search query cannot be empty");

            if (query.Length < 3)
                throw new BadRequestException("Search query must be at least 3 characters long");

            if (page < 1)
                page = 1;

            if (pageSize < 1 || pageSize > 100)
                pageSize = 20;

            var allPosts = await _postRepository.GetAllAsync();
            
            // Filter by published status
            var posts = includeUnpublished 
                ? allPosts 
                : allPosts.Where(p => p.IsPublished);

            // Filter by category if specified
            if (categoryId.HasValue)
            {
                posts = posts.Where(p => p.CategoryId == categoryId.Value);
            }

            // Search in title and content (case-insensitive)
            var searchResults = posts.Where(p => 
                p.Title.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                p.Content.Contains(query, StringComparison.OrdinalIgnoreCase)
            ).OrderByDescending(p => p.CreatedAt);

            var totalCount = searchResults.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var pagedResults = searchResults
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new SearchResponse
                {
                    Type = "Post",
                    Id = p.Id,
                    Title = p.Title,
                    ContentPreview = TruncateContent(p.Content, 200),
                    CategoryName = p.Category?.Name,
                    IsPublished = p.IsPublished,
                    CreatedAt = p.CreatedAt
                })
                .ToList();

            return new PagedSearchResponse
            {
                Results = pagedResults,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPreviousPage = page > 1
            };
        }

        public async Task<IEnumerable<SearchResponse>> SearchCategoriesAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Enumerable.Empty<SearchResponse>();

            if (query.Length < 3)
                return Enumerable.Empty<SearchResponse>();

            var categories = await _categoryRepository.GetAllAsync();

            return categories
                .Where(c => c.Name.Contains(query, StringComparison.OrdinalIgnoreCase))
                .Select(c => new SearchResponse
                {
                    Type = "Category",
                    Id = c.Id,
                    Title = c.Name,
                    ContentPreview = null,
                    CategoryName = null,
                    IsPublished = c.IsActive,
                    CreatedAt = c.CreatedAt
                });
        }

        private string TruncateContent(string content, int maxLength)
        {
            if (string.IsNullOrEmpty(content))
                return string.Empty;

            if (content.Length <= maxLength)
                return content;

            return content.Substring(0, maxLength) + "...";
        }
    }
}
