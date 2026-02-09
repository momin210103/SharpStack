using Blog.Application.DTOs.Search;

namespace Blog.Application.Interfaces.Services
{
    public interface ISearchService
    {
        Task<PagedSearchResponse> SearchAsync(string query, Guid? categoryId, int page, int pageSize, bool includeUnpublished = false);
        Task<IEnumerable<SearchResponse>> SearchCategoriesAsync(string query);
    }
}
