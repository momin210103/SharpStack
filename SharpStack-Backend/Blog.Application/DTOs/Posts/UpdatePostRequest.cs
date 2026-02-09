

namespace Blog.Application.DTOs.Posts
{
    public class UpdatePostRequest
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public Guid CategoryId { get; set; }
        
    }
}