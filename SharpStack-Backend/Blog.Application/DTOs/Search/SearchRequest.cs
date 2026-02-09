namespace Blog.Application.DTOs.Search
{
    public class SearchRequest
    {
        public string Query { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
