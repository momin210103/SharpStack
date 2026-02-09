namespace Blog.Application.DTOs.Search
{
    public class PagedSearchResponse
    {
        public IEnumerable<SearchResponse> Results { get; set; } = new List<SearchResponse>();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
}
