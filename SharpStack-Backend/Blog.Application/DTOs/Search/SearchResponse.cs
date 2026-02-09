namespace Blog.Application.DTOs.Search
{
    public class SearchResponse
    {
        public string Type { get; set; } = string.Empty; // "Post" or "Category"
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ContentPreview { get; set; }
        public string? CategoryName { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
